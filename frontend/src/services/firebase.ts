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

      // Register service worker manually if not already registered
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          console.log('Service Worker registered successfully:', registration);

          // Wait for service worker to be ready
          await navigator.serviceWorker.ready;

          // Send Firebase config to service worker
          const firebaseConfig = {
            apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
            authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
            storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.REACT_APP_FIREBASE_APP_ID,
            measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
          };

          // Send config to all service worker instances
          registration.active?.postMessage({
            type: 'FIREBASE_CONFIG',
            config: firebaseConfig
          });

          console.log('Firebase config sent to service worker');

          // Small delay to allow service worker to initialize Firebase
          await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
          console.error('Service Worker registration failed:', error);
          // Continue without service worker - foreground messages will still work
        }
      }

      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await getToken(this.messaging, {
          vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
        });

        if (token) {
          console.log("FCM Token generated:", token);
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

    console.log("Setting up foreground message listener");
    onMessage(this.messaging, (payload) => {
      console.log("Received foreground message:", payload);
      console.log("Message structure:", JSON.stringify(payload, null, 2));
      callback(payload);
    });
  }

  async getCurrentToken(): Promise<string | null> {
    try {
      if (!this.messaging) {
        console.warn("Firebase messaging not available");
        return null;
      }

      const token = await getToken(this.messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
      });

      console.log("Current FCM token:", token);
      return token;
    } catch (error) {
      console.error("Error getting current token:", error);
      return null;
    }
  }
}

// Add to window for debugging
declare global {
  interface Window {
    firebaseService: FirebaseService;
  }
}

const firebaseService = new FirebaseService();

// Make service available globally for debugging
if (typeof window !== 'undefined') {
  window.firebaseService = firebaseService;
}

export default firebaseService;