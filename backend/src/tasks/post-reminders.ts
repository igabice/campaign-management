import logger from "../config/logger";
import prisma from "../config/prisma";
import telegramService from "../services/telegram.service";
import mailService from "../services/mail.service";

interface PostReminderData {
  post: {
    id: string;
    title?: string | null;
    content: string;
    scheduledDate: Date;
    createdBy: string;
    creator: { name?: string | null; email: string };
    team: { title: string };
  };
}

const generateReminderMessage = (data: PostReminderData, format: 'email' | 'telegram') => {
  const { post } = data;
  const contentPreview = post.content
    .replace(/<[^>]*>/g, "")
    .substring(0, 200);
  const truncatedContent = post.content.length > 200 ? contentPreview + "..." : contentPreview;
  const calendarUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/calendar`;

  if (format === 'email') {
    return {
      subject: `Post Reminder: "${post.title || "Untitled Post"}" scheduled for ${post.scheduledDate.toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>📅 Post Reminder</h2>
          <p>Hello ${post.creator.name || "there"},</p>
          <p>This is a reminder that your post "${post.title || "Untitled Post"}" is scheduled to be published on <strong>${post.scheduledDate.toLocaleString()}</strong>.</p>
          <p><strong>Post Details:</strong></p>
          <ul>
            <li><strong>Team:</strong> ${post.team.title}</li>
            <li><strong>Scheduled Date:</strong> ${post.scheduledDate.toLocaleString()}</li>
            <li><strong>Content:</strong> ${truncatedContent}</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${calendarUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              View in Calendar
            </a>
          </div>
          <p>Don't forget to review and publish your content!</p>
          <p>Best regards,<br>Your Dokahub Team</p>
        </div>
      `,
    };
  } else {
    return `📅 Post Reminder\n\nHello ${post.creator.name || "there"}!\n\nYour post "${post.title || "Untitled Post"}" is scheduled to be published on ${post.scheduledDate.toLocaleString()}.\n\n📋 Post Details:\n• Team: ${post.team.title}\n• Scheduled: ${post.scheduledDate.toLocaleString()}\n• Content: ${truncatedContent}\n\n🔗 View in Calendar: ${calendarUrl}\n\nDon't forget to review and publish your content!`;
  }
};

const sendReminderNotification = async (
  post: PostReminderData['post'],
  type: 'email' | 'telegram'
): Promise<void> => {
  const postId = post.id;
  const userId = post.createdBy;

  try {
    if (type === 'email') {
      // Email notifications are always sent
      const emailMessage = generateReminderMessage({ post }, 'email') as { subject: string; html: string };
      await mailService.sendMail({
        to: post.creator.email,
        subject: emailMessage.subject,
        html: emailMessage.html,
      });
      logger.info(`Email reminder sent for post ${postId}`);
    } else {
      // Telegram notifications only sent if user has enabled them
      const userPreference = await prisma.userPreference.findUnique({
        where: { userId },
        select: { telegramEnabled: true, telegramChatId: true },
      });

      if (userPreference?.telegramEnabled && userPreference.telegramChatId) {
        const telegramMessage = generateReminderMessage({ post }, 'telegram') as string;
        await telegramService.sendMessage(
          userPreference.telegramChatId,
          telegramMessage
        );
        logger.info(`Telegram reminder sent for post ${postId} to user ${userId}`);
      } else {
        logger.info(`Telegram reminder skipped for post ${postId} - user ${userId} has not enabled Telegram notifications`);
      }
    }
  } catch (error) {
    logger.error(
      `Failed to send ${type} reminder for post ${postId}:`,
      error
    );
  }
};

/**
 * Send reminders for posts scheduled within the next 24 hours
 * Runs every hour
 */
export const sendPostReminders = async (): Promise<void> => {
  try {
    logger.info("Running post reminder check...");

    const reminderTime = new Date();
    reminderTime.setHours(reminderTime.getHours() + 24); // 24 hours from now

    // Find posts scheduled within the next 24 hours that haven't been reminded yet
    const postsToRemind = await prisma.post.findMany({
      where: {
        scheduledDate: {
          lte: reminderTime,
          gt: new Date(),
        },
        sendReminder: true,
        reminderSent: false,
      },
      include: {
        creator: true,
        team: true,
      },
    });

    for (const post of postsToRemind) {
      try {
        logger.info(`Sending reminder for post ${post.id}`);

        // Send email reminder (always sent)
        await sendReminderNotification(post, 'email');

        // Send Telegram reminder (only if user has enabled it)
        await sendReminderNotification(post, 'telegram');

        // Mark reminder as sent
        await prisma.post.update({
          where: { id: post.id },
          data: {
            reminderSent: true,
          },
        });

        logger.info(`Reminder sent for post ${post.id}`);
      } catch (error) {
        logger.error(`Failed to send reminder for post ${post.id}:`, error);
      }
    }

    if (postsToRemind.length > 0) {
      logger.info(`Sent reminders for ${postsToRemind.length} posts`);
    }
  } catch (error) {
    logger.error("Error in post reminder task:", error);
  }
};
