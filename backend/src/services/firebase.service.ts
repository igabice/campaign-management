import * as admin from "firebase-admin";
import logger from "../config/logger";

// key-pair
// BJc-PMPadvedBngjVpfere3E6mjuufwPXFrBqEhlpjo6UZYZ0WGTLOy8yKjdWtq-wPwgYbg2gbID2PrdUWP1_zY
// priv-
// 319JjBHRmOtCEBMzDrAz-niwKolGHRtqoliZV-JcHjY

// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY, // Use process.env for Next.js/CRA
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
//   measurementId: process.env.FIREBASE_MEASUREMENT_ID,
// };

class FirebaseService {
  private initialized = false;

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

      if (!serviceAccountBase64) {
        throw new Error(
          "FIREBASE_SERVICE_ACCOUNT_BASE64 not found in environment"
        );
      }

      const serviceAccount = JSON.parse(
        Buffer.from(serviceAccountBase64, "base64").toString("utf-8")
      );

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      this.initialized = true;
      logger.info("Firebase initialized successfully");
    } catch (error) {
      logger.error("Failed to initialize Firebase:", error);
    }
  }

  async sendPushNotification(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>
  ): Promise<void> {
    if (!this.initialized) {
      logger.warn("Firebase not initialized, skipping push notification");
      return;
    }

    try {
      const message = {
        token,
        notification: {
          title,
          body,
        },
        data: data || {},
        android: {
          priority: "high" as const,
          notification: {
            sound: "default",
            clickAction: "FLUTTER_NOTIFICATION_CLICK",
          },
        },
        apns: {
          payload: {
            aps: {
              sound: "default",
              badge: 1,
            },
          },
        },
      };

      const response = await admin.messaging().send(message);
      logger.info("Push notification sent successfully:", response);
    } catch (error) {
      logger.error("Failed to send push notification:", error);
      // If token is invalid, we might want to remove it from the database
      if (
        error instanceof Error &&
        error.message.includes("registration-token-not-registered")
      ) {
        logger.warn("Invalid Firebase token detected:", token);
        // TODO: Remove invalid token from database
      }
    }
  }

  async sendNotificationToUser(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, string>
  ): Promise<void> {
    if (!this.initialized) {
      return;
    }

    try {
      // Import prisma here to avoid circular dependencies
      const prisma = (await import("../config/prisma")).default;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { firebaseToken: true },
      });

      if (user?.firebaseToken) {
        await this.sendPushNotification(user.firebaseToken, title, body, data);
      }
    } catch (error) {
      logger.error("Failed to send notification to user:", error);
    }
  }

  async sendNotificationToMultipleUsers(
    userIds: string[],
    title: string,
    body: string,
    data?: Record<string, string>
  ): Promise<void> {
    if (!this.initialized) {
      return;
    }

    const promises = userIds.map((userId) =>
      this.sendNotificationToUser(userId, title, body, data)
    );

    await Promise.allSettled(promises);
  }
}

const firebaseService = new FirebaseService();
export default firebaseService;
