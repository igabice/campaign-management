// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

let firebaseApp = null;
let messaging = null;

// Handle notification click - must be registered on initial evaluation
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  event.notification.close();

  // Determine the URL to navigate to based on notification data
  let url = '/notifications'; // Default fallback URL

  if (event.notification.data) {
    const data = event.notification.data;
    switch (data.type) {
      case 'post_approval_request':
      case 'post_approval_result':
        if (data.postId) {
          url = `/content-planner/${data.postId}`;
        }
        break;
      case 'plan_approval_request':
      case 'plan_approval_result':
      case 'plan_created':
      case 'plan_published':
        if (data.planId) {
          url = `/content-planner/${data.planId}`;
        }
        break;
      case 'invite_accepted':
      case 'team_created':
        if (data.teamId) {
          url = '/team';
        }
        break;
      default:
        url = '/notifications';
    }
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window/tab open with our app
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          // Focus the existing window and navigate
          return client.focus().then(() => {
            // Post a message to the client to handle navigation
            client.postMessage({
              type: 'NAVIGATE',
              url: url
            });
          });
        }
      }

      // If no suitable client found, open a new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Listen for Firebase config from the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    const firebaseConfig = event.data.config;

    if (!firebaseApp) {
      try {
        firebaseApp = firebase.initializeApp(firebaseConfig);
        messaging = firebase.messaging();

        console.log('Firebase initialized in service worker');

        // Set up background message handler
        messaging.onBackgroundMessage((payload) => {
          console.log('Received background message:', payload);

          const notificationTitle = payload.notification?.title || 'New Notification';
          const notificationOptions = {
            body: payload.notification?.body || 'You have a new notification',
            icon: '/logo192.png',
            badge: '/logo192.png',
            data: payload.data,
            tag: payload.data?.type || 'default',
            requireInteraction: false,
            silent: false
          };

          return self.registration.showNotification(notificationTitle, notificationOptions);
        });
      } catch (error) {
        console.error('Failed to initialize Firebase in service worker:', error);
      }
    }
  }
});