import logger from "../config/logger";
import prisma from "../config/prisma";
import telegramService from "../services/telegram.service";
import mailService from "../services/mail.service";

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

        // Send email reminder
        try {
          await mailService.sendMail({
            to: post.creator.email,
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
                  <li><strong>Content:</strong> ${post.content.substring(0, 200)}${post.content.length > 200 ? "..." : ""}</li>
                </ul>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/calendar" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                    View in Calendar
                  </a>
                </div>
                <p>Don't forget to review and publish your content!</p>
                <p>Best regards,<br>Your Campaign Management Team</p>
              </div>
            `,
          });
        } catch (emailError) {
          logger.error(
            `Failed to send email reminder for post ${post.id}:`,
            emailError
          );
        }

        // Send Telegram reminder if enabled
        try {
          const contentPreview = post.content
            .replace(/<[^>]*>/g, "")
            .substring(0, 200);
          const truncatedContent =
            post.content.length > 200 ? contentPreview + "..." : contentPreview;

          await telegramService.sendNotificationToUser(
            post.createdBy,
            `📅 Post Reminder\n\nHello ${post.creator.name || "there"}!\n\nYour post "${post.title || "Untitled Post"}" is scheduled to be published on ${post.scheduledDate.toLocaleString()}.\n\n📋 Post Details:\n• Team: ${post.team.title}\n• Scheduled: ${post.scheduledDate.toLocaleString()}\n• Content: ${truncatedContent}\n\n🔗 View in Calendar: ${process.env.FRONTEND_URL || "http://localhost:3000"}/calendar\n\nDon't forget to review and publish your content!`
          );
        } catch (telegramError) {
          logger.error(
            `Failed to send Telegram reminder for post ${post.id}:`,
            telegramError
          );
        }

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
