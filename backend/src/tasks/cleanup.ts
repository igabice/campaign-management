import logger from "../config/logger";
import prisma from "../config/prisma";

/**
 * Clean up old draft posts
 * Runs daily at midnight
 */
export const cleanupOldPosts = async (): Promise<void> => {
  try {
    logger.info("Running cleanup job...");

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Delete draft posts older than 30 days
    const deletedPosts = await prisma.post.deleteMany({
      where: {
        status: "draft",
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    logger.info(`Cleaned up ${deletedPosts.count} old draft posts`);
  } catch (error) {
    logger.error("Error in cleanup task:", error);
  }
};