import logger from "../config/logger";
import prisma from "../config/prisma";

/**
 * Check for posts that need to be published and publish them
 * Runs every minute
 */
export const checkAndPublishPosts = async (): Promise<void> => {
  try {
    logger.info("Running post publication check...");

    const now = new Date();

    // Find posts that are scheduled to be published and haven't been published yet
    const postsToPublish = await prisma.post.findMany({
      where: {
        scheduledDate: {
          lte: now,
        },
        status: {
          not: "published",
        },
      },
      include: {
        socialMedias: true,
        team: true,
      },
    });

    for (const post of postsToPublish) {
      try {
        logger.info(`Publishing post ${post.id} to social media platforms`);

        // Here you would integrate with social media APIs to actually publish
        // For now, we'll just mark them as published
        await prisma.post.update({
          where: { id: post.id },
          data: {
            status: "published",
            publishedAt: now,
          },
        });

        logger.info(`Successfully published post ${post.id}`);
      } catch (error) {
        logger.error(`Failed to publish post ${post.id}:`, error);
      }
    }

    if (postsToPublish.length > 0) {
      logger.info(`Published ${postsToPublish.length} posts`);
    }
  } catch (error) {
    logger.error("Error in post publication task:", error);
  }
};