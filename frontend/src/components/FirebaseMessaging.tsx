import { useEffect, useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import firebaseService from "../services/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

export const FirebaseMessaging = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { session, isLoading } = useAuth();

  const handleNotificationClick = useCallback((data: any) => {
    switch (data.type) {
      case "post_approval_request":
        if (data.postId) {
          navigate(`/content-planner/${data.postId}`);
        }
        break;
      case "plan_approval_request":
        if (data.planId) {
          navigate(`/content-planner/${data.planId}`);
        }
        break;
      case "post_approval_result":
        if (data.postId) {
          navigate(`/content-planner/${data.postId}`);
        }
        break;
      case "plan_approval_result":
        if (data.planId) {
          navigate(`/content-planner/${data.planId}`);
        }
        break;
      case "plan_created":
        if (data.planId) {
          navigate(`/content-planner/${data.planId}`);
        }
        break;
      case "plan_published":
        if (data.planId) {
          navigate(`/content-planner/${data.planId}`);
        }
        break;
      case "invite_accepted":
        if (data.teamId) {
          navigate(`/team`);
        }
        break;
      case "team_created":
        if (data.teamId) {
          navigate(`/team`);
        }
        break;
      default:
        navigate("/notifications");
    }
  }, [navigate]);

  useEffect(() => {
    // Only setup Firebase messaging for authenticated users
    if (isLoading || !session?.user) {
      return;
    }

    // Request notification permission and register token
    const setupFirebase = async () => {
      try {
        console.log("Setting up Firebase messaging...");
        const token = await firebaseService.requestPermission();
        if (token) {
          console.log("Firebase token obtained successfully");
        } else {
          console.log("Firebase token not obtained - messaging may not be available");
        }
      } catch (error) {
        console.error("Failed to setup Firebase:", error);
        toast({
          title: "Notification Setup Failed",
          description: "Unable to set up push notifications. Some features may not work.",
          status: "warning",
          duration: 5000,
        });
      }
    };

    setupFirebase();

    // Setup message listener for foreground messages
    try {
      firebaseService.setupMessageListener((payload) => {
        const { notification, data } = payload;

        if (notification) {
          // Show toast notification
          toast({
            title: notification.title,
            description: notification.body,
            status: "info",
            duration: 5000,
            isClosable: true,
          });

          // Also show browser notification if permission granted
          if (Notification.permission === "granted") {
            const browserNotification = new Notification(notification.title, {
              body: notification.body,
              icon: "/logo192.png",
            });

            // Add click handler to browser notification
            browserNotification.onclick = () => {
              handleNotificationClick(data);
              // Close the notification after clicking
              browserNotification.close();
              // Focus the window
              window.focus();
            };
          }
        }
      });
      console.log("Firebase message listener set up successfully");
    } catch (error) {
      console.error("Failed to set up Firebase message listener:", error);
    }

    // Listen for messages from service worker
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NAVIGATE') {
        navigate(event.data.url);
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleServiceWorkerMessage);

    // Cleanup function
    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleServiceWorkerMessage);
      // Firebase messaging cleanup is handled automatically
    };
  }, [toast, navigate, session, isLoading, handleNotificationClick]);

  return null; // This component doesn't render anything
};