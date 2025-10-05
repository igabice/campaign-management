import logger from "../config/logger";
import prisma from "../config/prisma";
import mailService from "../services/mail.service";

/**
 * Send re-engagement emails to inactive users
 * Runs daily at 9 AM
 */
export const sendReEngagementEmails = async (): Promise<void> => {
  try {
    logger.info("Running re-engagement email task...");

    const now = new Date();

    // Define the re-engagement periods (in days)
    const reEngagementPeriods = [
      { days: 3, subject: "We miss you! Come back to Campaign Manager" },
      { days: 5, subject: "Your campaigns are waiting for you" },
      { days: 7, subject: "Don't forget about your social media strategy" },
      { days: 14, subject: "Time to boost your social media presence" },
      { days: 21, subject: "Your audience is waiting - let's create some content!" },
    ];

    for (const period of reEngagementPeriods) {
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() - period.days);

      // Find users who haven't been active for exactly this many days
      // (within a 1-day window to avoid sending multiple emails)
      const startOfPeriod = new Date(targetDate);
      startOfPeriod.setHours(0, 0, 0, 0);

      const endOfPeriod = new Date(targetDate);
      endOfPeriod.setHours(23, 59, 59, 999);

      const inactiveUsers = await prisma.user.findMany({
        where: {
          updatedAt: {
            gte: startOfPeriod,
            lte: endOfPeriod,
          },
          emailVerified: true, // Only send to verified users
        },
        select: {
          id: true,
          email: true,
          name: true,
          updatedAt: true,
          reEngagementEmailsSent: true,
        },
      });

      // Filter out users who have already received this re-engagement email
      const filteredUsers = inactiveUsers.filter(user => {
        const sentEmails = user.reEngagementEmailsSent as Record<string, boolean> | null;
        return !sentEmails || !sentEmails[period.days.toString()];
      });

      logger.info(`Found ${filteredUsers.length} users inactive for ${period.days} days (after filtering sent emails)`);

      for (const user of filteredUsers) {
        try {
          logger.info(`Sending ${period.days}-day re-engagement email to ${user.email}`);

          // Send the actual re-engagement email
          await mailService.sendReEngagementEmail({
            name: user.name,
            email: user.email,
          }, period.days);

          // Mark that we've sent this re-engagement email
          const sentEmails = (user.reEngagementEmailsSent as Record<string, boolean>) || {};
          sentEmails[period.days.toString()] = true;

          await prisma.user.update({
            where: { id: user.id },
            data: {
              reEngagementEmailsSent: sentEmails,
            },
          });

          logger.info(`Successfully sent ${period.days}-day re-engagement email to ${user.email}`);

        } catch (error) {
          logger.error(`Failed to send re-engagement email to ${user.email}:`, error);
        }
      }

      if (inactiveUsers.length > 0) {
        logger.info(`Sent ${period.days}-day re-engagement emails to ${inactiveUsers.length} users`);
      }
    }

  } catch (error) {
    logger.error("Error in re-engagement email task:", error);
  }
};