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
          not: "Posted",
        },
        approvalStatus: "approved", // Only publish approved posts
      },
      include: {
        socialMedias: true,
        team: true,
        creator: true,
      },
    });

    for (const post of postsToPublish) {
      try {
        logger.info(`Publishing post ${post.id} to ${post.socialMedias.length} social media platforms`);

        let successCount = 0;
        let failureCount = 0;
        const errors: string[] = [];

        // Publish to each social media account
        for (const socialMedia of post.socialMedias) {
          try {
            if (socialMedia.platform === "facebook") {
              // Import here to avoid circular dependencies
              const socialMediaService = await import("../services/socialMedia.service");

              const content = {
                message: post.content,
                ...(post.image && { image: post.image }),
              };

              await socialMediaService.default.postToFacebookPage(socialMedia.id, content);
              logger.info(`Successfully posted to Facebook page: ${socialMedia.accountName}`);
              successCount++;
            } else {
              // For other platforms, mark as successful for now (implement later)
              logger.warn(`Platform ${socialMedia.platform} not yet implemented for auto-publishing`);
              successCount++;
            }
          } catch (error: any) {
            logger.error(`Failed to post to ${socialMedia.platform} (${socialMedia.accountName}):`, error.message);
            errors.push(`${socialMedia.platform} (${socialMedia.accountName}): ${error.message}`);
            failureCount++;
          }
        }

        // Update post status based on results
        if (successCount > 0 && failureCount === 0) {
          // All platforms succeeded
          await prisma.post.update({
            where: { id: post.id },
            data: {
              status: "Posted",
              publishedAt: now,
            },
          });
          logger.info(`Successfully published post ${post.id} to all platforms`);
        } else if (successCount > 0) {
          // Partial success - some platforms failed
          await prisma.post.update({
            where: { id: post.id },
            data: {
              status: "Posted", // Still mark as posted since some succeeded
              publishedAt: now,
            },
          });
          logger.warn(`Partially published post ${post.id}: ${successCount} succeeded, ${failureCount} failed`);
          if (errors.length > 0) {
            logger.warn("Errors:", errors.join("; "));
          }
        } else {
          // All platforms failed - don't mark as published
          logger.error(`Failed to publish post ${post.id} to any platform`);
          if (errors.length > 0) {
            logger.error("Errors:", errors.join("; "));
          }
          // Could implement retry logic here
        }

      } catch (error) {
        logger.error(`Failed to publish post ${post.id}:`, error);
      }
    }

    if (postsToPublish.length > 0) {
      logger.info(`Processed ${postsToPublish.length} posts for publication`);
    }
  } catch (error) {
    logger.error("Error in post publication task:", error);
  }
};