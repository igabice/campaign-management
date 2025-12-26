import { messaging } from "../lib/firebase";
import { getToken, onMessage, Messaging } from "firebase/messaging";
import { post, del } from "../lib/http";

class FirebaseService {
  private messaging: Messaging | null = messaging;

  async requestPermission(): Promise<string | null> {
    try {
      if (!this.messaging) {
        console.warn("Firebase messaging not available");
        return null;
      }

      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await getToken(this.messaging, {
          vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
        });

        if (token) {
          // Register token with backend
          await this.registerToken(token);
          return token;
        }
      } else {
        console.warn("Notification permission denied");
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
    return null;
  }

  async registerToken(token: string): Promise<void> {
    try {
      await post("/users/firebase-token", { token });
      console.log("Firebase token registered successfully");
    } catch (error) {
      console.error("Failed to register Firebase token:", error);
    }
  }

  async unregisterToken(): Promise<void> {
    try {
      await del("/users/firebase-token");
      console.log("Firebase token unregistered successfully");
    } catch (error) {
      console.error("Failed to unregister Firebase token:", error);
    }
  }

  setupMessageListener(callback: (payload: any) => void): void {
    if (!this.messaging) {
      console.warn("Firebase messaging not available for message listening");
      return;
    }

    onMessage(this.messaging, (payload) => {
      console.log("Received foreground message:", payload);
      callback(payload);
    });
  }

  async getCurrentToken(): Promise<string | null> {
    try {
      if (!this.messaging) return null;

      return await getToken(this.messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
      });
    } catch (error) {
      console.error("Error getting current token:", error);
      return null;
    }
  }
}

const firebaseService = new FirebaseService();
export default firebaseService;