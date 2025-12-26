import logger from "../config/logger";
import prisma from "../config/prisma";
import { GoogleNewsService } from "../services/rss.service";
import { generateArticle } from "../ai/flows/generate-rss-content";
import articleService from "../services/article.service";

/**
 * Generate articles from news based on user topics
 * Runs daily to create content for users based on their topic preferences
 */
export const generateTopicArticles = async (): Promise<void> => {
  try {
    logger.info("Starting topic articles generation task...");

    // Fetch all unique topics from user preferences
    const topicPreferences = await prisma.topicPreference.findMany({
      include: {
        userPreference: {
          select: {
            userId: true,
            about: true,
          },
        },
      },
    });

    // Group topics by user and include about field
    const userData: { [userId: string]: { topics: string[], about?: string } } = {};
    topicPreferences.forEach((tp) => {
      if (!userData[tp.userPreference.userId]) {
        userData[tp.userPreference.userId] = {
          topics: [],
          about: tp.userPreference.about || undefined,
        };
      }
      userData[tp.userPreference.userId].topics.push(tp.topic);
    });

    const newsService = new GoogleNewsService();
    let totalArticlesGenerated = 0;

    // Process each user's topics
    for (const [userId, userInfo] of Object.entries(userData)) {
      logger.info(`Processing ${userInfo.topics.length} topics for user ${userId}`);

      for (const topic of userInfo.topics) {
        try {
          // Search for news on this topic
          const newsItems = await newsService.searchNews(topic);

          // Limit to first 3 news items per topic to avoid overwhelming
          const limitedNewsItems = newsItems.slice(0, 3);

          for (const newsItem of limitedNewsItems) {
            try {
              // Generate article from news
              const articleContent = await generateArticle({
                agencyDescription: userInfo.about || "Tech and startup news aggregator",
                title: newsItem.title,
                content: newsItem.content,
                contentSnippet: newsItem.contentSnippet,
                source: newsItem.link,
              });

              // Save article to database
              await articleService.createArticle({
                title: articleContent.title || newsItem.title,
                body: articleContent.body || newsItem.contentSnippet,
                hook: articleContent.hook,
                callToAction: articleContent.callToAction,
                onScreenText: articleContent.onScreenText,
                topic: topic,
                userId: userId,
              });

              totalArticlesGenerated++;
              logger.info(`Generated article for topic "${topic}" for user ${userId}`);

            } catch (error) {
              logger.error(`Failed to generate article for news item "${newsItem.title}":`, error);
            }
          }

        } catch (error) {
          logger.error(`Failed to process topic "${topic}" for user ${userId}:`, error);
        }
      }
    }

    logger.info(`Topic articles generation completed. Generated ${totalArticlesGenerated} articles.`);

  } catch (error) {
    logger.error("Error in topic articles generation task:", error);
  }
};