import * as cron from "node-cron";
import logger from "./config/logger";
import { checkAndPublishPosts } from "./tasks/post-publication";
import { sendPostReminders } from "./tasks/post-reminders";
import { cleanupOldPosts } from "./tasks/cleanup";
import { updateSocialMediaStats } from "./tasks/social-media-stats";
import { sendReEngagementEmails } from "./tasks/re-engagement-emails";
import { sendOnboardingEmails } from "./tasks/onboarding-emails";

/**
 * Initialize and start all cron jobs
 */
export const startCronJobs = () => {
  logger.info("Initializing cron jobs...");

  // Post publication check - runs every minute
  cron.schedule("0 * * * *", async () => {
    try {
      await checkAndPublishPosts();
    } catch (error) {
      logger.error("Error in post publication cron job:", error);
    }
  });

  // Post reminder check - runs every hour
  cron.schedule("0 * * * *", async () => {
    try {
      await sendPostReminders();
    } catch (error) {
      logger.error("Error in post reminder cron job:", error);
    }
  });

  // Cleanup old posts - runs daily at midnight
  cron.schedule("0 0 * * *", async () => {
    try {
      await cleanupOldPosts();
    } catch (error) {
      logger.error("Error in cleanup cron job:", error);
    }
  });

  // Social media stats update - runs every 6 hours
  cron.schedule("0 */6 * * *", async () => {
    try {
      await updateSocialMediaStats();
    } catch (error) {
      logger.error("Error in social media stats cron job:", error);
    }
  });

  // Re-engagement emails - runs daily at 9 AM
  cron.schedule("0 9 * * *", async () => {
    try {
      await sendReEngagementEmails();
    } catch (error) {
      logger.error("Error in re-engagement email cron job:", error);
    }
  });

  // Onboarding emails - runs daily at 10 AM
  cron.schedule("0 10 * * *", async () => {
    try {
      await sendOnboardingEmails();
    } catch (error) {
      logger.error("Error in onboarding email cron job:", error);
    }
  });

  logger.info("All cron jobs initialized successfully");
};

/**
 * Stop all cron jobs (useful for testing or graceful shutdown)
 */
export const stopCronJobs = () => {
  logger.info("Stopping all cron jobs...");
  // node-cron doesn't provide a direct way to stop all jobs,
  // but we can destroy the cron instance if needed
  cron.getTasks().forEach((task) => {
    task.destroy();
  });
  logger.info("All cron jobs stopped");
};

// Export for testing purposes
export { cron };
