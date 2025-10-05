import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Button,
  List,
  ListItem,
  Flex,
  Spacer,
  Badge,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  IconButton,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { notificationsApi, Notification } from "../../services/notifications";

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationsApi.getNotifications();
      setNotifications(data);
    } catch (err) {
      setError("Failed to load notifications");
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading notifications...</Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Box p={6} maxW="800px" mx="auto">
      <VStack spacing={6} align="stretch">
        <Flex align="center">
          <Heading size="lg">Notifications</Heading>
          <Spacer />
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} size="sm" colorScheme="blue">
              Mark All as Read
            </Button>
          )}
        </Flex>

        {notifications.length === 0 ? (
          <Box textAlign="center" py={12}>
            <Text color="gray.500">No notifications yet</Text>
          </Box>
        ) : (
          <List spacing={3}>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                p={4}
                bg={bgColor}
                borderRadius="md"
                border="1px"
                borderColor={borderColor}
                opacity={notification.isRead ? 0.7 : 1}
              >
                <Flex align="center">
                  <Box flex="1">
                    <Text fontSize="sm" whiteSpace="pre-wrap">
                      {notification.description}
                    </Text>
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      {new Date(notification.createdAt).toLocaleString()}
                    </Text>
                  </Box>
                  <Spacer />
                  {!notification.isRead && (
                    <Badge colorScheme="blue" mr={2}>
                      New
                    </Badge>
                  )}
                  {!notification.isRead && (
                    <IconButton
                      aria-label="Mark as read"
                      icon={<CheckIcon />}
                      size="sm"
                      variant="ghost"
                      onClick={() => markAsRead(notification.id)}
                    />
                  )}
                </Flex>
              </ListItem>
            ))}
          </List>
        )}
      </VStack>
    </Box>
  );
};