import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  Messaging,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Check if all required Firebase config values are present
const requiredConfigKeys = ["apiKey", "authDomain", "projectId"];
const missingKeys = requiredConfigKeys.filter(
  (key) => !firebaseConfig[key as keyof typeof firebaseConfig]
);

if (missingKeys.length > 0) {
  console.error("Missing required Firebase configuration:", missingKeys);
  console.error(
    "Please check your .env file and ensure all REACT_APP_FIREBASE_* variables are set"
  );
}

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log("Firebase app initialized successfully");
} catch (error) {
  console.error("Firebase app initialization failed:", error);
  throw error;
}

// Initialize Firebase Cloud Messaging
let messaging: Messaging | null = null;

try {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    messaging = getMessaging(app);
    console.log("Firebase messaging initialized successfully");
  } else {
    console.warn(
      "Firebase messaging not supported: window or serviceWorker not available"
    );
  }
} catch (error) {
  console.error("Firebase messaging initialization failed:", error);
  console.error(
    "This might be due to missing Firebase configuration or unsupported browser"
  );
}

export { messaging };
export default app;
