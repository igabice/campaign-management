import logger from "../config/logger";
import prisma from "../config/prisma";

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

        // Here you would send email/SMS reminders
        // For now, we'll just mark the reminder as sent
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