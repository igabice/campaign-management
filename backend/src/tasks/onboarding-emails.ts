import logger from "../config/logger";
import prisma from "../config/prisma";
import mailService from "../services/mail.service";

/**
 * Send onboarding/feature emails to new users
 * Runs daily at 10 AM
 */
export const sendOnboardingEmails = async (): Promise<void> => {
  try {
    logger.info("Running onboarding email task...");

    const now = new Date();

    // Define the onboarding email campaigns with different features
    const onboardingCampaigns = [
      {
        days: 3,
        subject: "Welcome to Dokahub - Getting Started with Teams",
        feature: "Team Management",
        content:
          "Learn how to create and manage teams, invite members, and collaborate effectively.",
      },
      {
        days: 5,
        subject: "Discover Social Media Account Management",
        feature: "Social Media Integration",
        content:
          "Connect your social media accounts and manage multiple platforms from one dashboard.",
      },
      {
        days: 7,
        subject: "Master Content Planning with AI",
        feature: "AI Content Generation",
        content:
          "Use our AI-powered tools to generate engaging content and create strategic posting schedules.",
      },
      {
        days: 14,
        subject: "Schedule Posts Like a Pro",
        feature: "Post Scheduling",
        content:
          "Automate your social media posting with advanced scheduling and calendar management.",
      },
      {
        days: 21,
        subject: "Track Your Success with Analytics",
        feature: "Performance Analytics",
        content:
          "Monitor engagement, track performance, and optimize your social media strategy.",
      },
    ];

    for (const campaign of onboardingCampaigns) {
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() - campaign.days);

      // Find users who registered exactly this many days ago
      // (within a 1-day window)
      const startOfPeriod = new Date(targetDate);
      startOfPeriod.setHours(0, 0, 0, 0);

      const endOfPeriod = new Date(targetDate);
      endOfPeriod.setHours(23, 59, 59, 999);

      const newUsers = await prisma.user.findMany({
        where: {
          createdAt: {
            gte: startOfPeriod,
            lte: endOfPeriod,
          },
          emailVerified: true, // Only send to verified users
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          onboardingEmailsSent: true,
        },
      });

      // Filter out users who have already received this onboarding email
      const filteredUsers = newUsers.filter((user) => {
        const sentEmails = user.onboardingEmailsSent as Record<
          string,
          boolean
        > | null;
        return !sentEmails || !sentEmails[campaign.days.toString()];
      });

      logger.info(
        `Found ${filteredUsers.length} users registered ${campaign.days} days ago (after filtering sent emails)`
      );

      for (const user of filteredUsers) {
        try {
          logger.info(
            `Sending ${campaign.days}-day onboarding email to ${user.email} about ${campaign.feature}`
          );

          // Send the actual onboarding email
          await mailService.sendOnboardingEmail(
            {
              name: user.name,
              email: user.email,
            },
            {
              subject: campaign.subject,
              feature: campaign.feature,
              content: campaign.content,
              daysAfterRegistration: campaign.days,
            }
          );

          // Mark that we've sent this onboarding email
          const sentEmails =
            (user.onboardingEmailsSent as Record<string, boolean>) || {};
          sentEmails[campaign.days.toString()] = true;

          await prisma.user.update({
            where: { id: user.id },
            data: {
              onboardingEmailsSent: sentEmails,
            },
          });

          logger.info(
            `Successfully sent ${campaign.days}-day onboarding email to ${user.email}`
          );
        } catch (error) {
          logger.error(
            `Failed to send onboarding email to ${user.email}:`,
            error
          );
        }
      }

      if (filteredUsers.length > 0) {
        logger.info(
          `Sent ${campaign.days}-day onboarding emails to ${filteredUsers.length} users about ${campaign.feature}`
        );
      }
    }
  } catch (error) {
    logger.error("Error in onboarding email task:", error);
  }
};
