import TelegramBot from "node-telegram-bot-api";
import prisma from "../config/prisma";
import logger from "../config/logger";

class TelegramService {
  private bot: TelegramBot | null = null;

  constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      logger.warn(
        "TELEGRAM_BOT_TOKEN not found, Telegram bot will not be initialized"
      );
      return;
    }

    this.bot = new TelegramBot(token, { polling: true });

    this.setupEventHandlers();
    logger.info("Telegram bot initialized");
  }

  private isBotAvailable(): boolean {
    return this.bot !== null;
  }

  private setupEventHandlers() {
    if (!this.bot) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.bot.on("message", async (msg: any) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      if (!text) return;

      let userId: string;

      if (text.startsWith('/start ')) {
        // Handle /start command with parameter
        userId = text.substring(7).trim();
      } else if (text.startsWith('/start')) {
        // Just /start without parameter
        await this.bot!.sendMessage(
          chatId,
          "Welcome! Please send your user ID to enable Telegram notifications."
        );
        return;
      } else {
        // Regular message, assume it's a userId
        userId = text.trim();
      }

      try {
        // Validate if it's a valid userId by checking if user exists
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, name: true },
        });

        if (!user) {
          await this.bot!.sendMessage(
            chatId,
            "Invalid user ID. Please send a valid user ID to enable Telegram notifications."
          );
          return;
        }

        // Update user preferences with chatId
        await prisma.userPreference.upsert({
          where: { userId },
          update: {
            telegramEnabled: true,
            telegramChatId: chatId.toString(),
          },
          create: {
            userId,
            telegramEnabled: true,
            telegramChatId: chatId.toString(),
            emailNotifications: true,
            whatsappEnabled: false,
            postsPerDay: 3,
            postsPerWeek: 15,
            preferredPostTimes: [],
            preferredPostDays: [],
          },
        });

        await this.bot!.sendMessage(
          chatId,
          `✅ Telegram notifications enabled successfully for user ${user.name || userId}!\n\nYou will now receive notifications about your content planning activities.`
        );

        logger.info(`Telegram chatId ${chatId} linked to user ${userId}`);
      } catch (error) {
        logger.error("Error processing Telegram message:", error);
        await this.bot!.sendMessage(
          chatId,
          "An error occurred. Please try again later."
        );
      }
    });
  }

  async sendMessage(chatId: string, message: string): Promise<void> {
    if (!this.bot) return;

    try {
      await this.bot.sendMessage(chatId, message);
    } catch (error) {
      logger.error("Error sending Telegram message:", error);
    }
  }

  async sendNotificationToUser(userId: string, message: string): Promise<void> {
    if (!this.isBotAvailable()) return;

    try {
      const preference = await prisma.userPreference.findUnique({
        where: { userId },
        select: { telegramEnabled: true, telegramChatId: true },
      });

      if (preference?.telegramEnabled && preference.telegramChatId) {
        await this.sendMessage(preference.telegramChatId, message);
      }
    } catch (error) {
      logger.error("Error sending notification to user:", error);
    }
  }

  getBot(): TelegramBot | null {
    return this.bot;
  }
}

export default new TelegramService();
