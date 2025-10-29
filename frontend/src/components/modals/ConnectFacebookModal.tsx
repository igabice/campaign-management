import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Checkbox,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Badge,
  useToast,
  Image,
  Avatar,
} from "@chakra-ui/react";
import { socialMediaApi } from "../../services/socialMedia";
import { useTeam } from "../../contexts/TeamContext";
import { useAuth } from "../../features/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { authClient } from "../../lib/auth-client";

interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  category?: string;
  tasks?: string[];
  profile_picture?: string;
  link?: string;
}

interface ConnectFacebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: () => void;
}

export const ConnectFacebookModal: React.FC<ConnectFacebookModalProps> = ({
  isOpen,
  onClose,
  onConnected,
}) => {
  const { activeTeam } = useTeam();
  const { session } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && session) {
      fetchFacebookPages();
    }
  }, [isOpen, session]);

  const fetchFacebookPages = async () => {
    if (!session) {
      toast({
        title: "Session expired",
        description: "Please log in again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First check if user has Facebook authentication
      const authStatus = await socialMediaApi.checkFacebookAuth();

      if (!authStatus.hasFacebookAuth) {
        // If no Facebook auth, show message with login button
        setError(`Facebook authentication required. ${authStatus.message}`);
        return;
      }

      // If authenticated, fetch pages
      const fetchedPages = await socialMediaApi.getFacebookPages();
      setPages(fetchedPages);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch Facebook pages";
      setError(errorMessage);
      toast({
        title: "Failed to fetch Facebook pages",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageToggle = (pageId: string) => {
    setSelectedPages((prev) =>
      prev.includes(pageId)
        ? prev.filter((id) => id !== pageId)
        : [...prev, pageId]
    );
  };

  const handleConnect = async () => {
    if (!activeTeam || selectedPages.length === 0) return;

    if (!session) {
      toast({
        title: "Session expired",
        description: "Please log in again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
      return;
    }

    setIsConnecting(true);

    try {
      const pagesToSave = pages.filter((page) =>
        selectedPages.includes(page.id)
      );
      await socialMediaApi.saveFacebookPages({
        teamId: activeTeam.id,
        pages: pagesToSave,
      });

      toast({
        title: "Facebook pages connected",
        description: `${selectedPages.length} page(s) successfully connected`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onConnected();
      onClose();
      setSelectedPages([]);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to connect Facebook pages";
      toast({
        title: "Failed to connect Facebook pages",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleClose = () => {
    setSelectedPages([]);
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Connect Facebook Pages</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text>
              Select the Facebook pages you want to connect for automated
              posting. Make sure you've granted the necessary permissions when
              logging in with Facebook.
            </Text>

            {error && (
              <Alert status="error">
                <AlertIcon />
                <Box>
                  <AlertTitle>Facebook Authentication Required</AlertTitle>
                  <AlertDescription>
                    {error}
                    <br />
                    <br />
                    <Button
                      colorScheme="facebook"
                      size="sm"
                      onClick={async () => {
                        try {
                          const result = await authClient.signIn.social({
                            provider: "facebook",
                            callbackURL: window.location.href,
                          });
                          if (result.error) {
                            toast({
                              title: "Facebook login failed",
                              description: result.error.message,
                              status: "error",
                              duration: 5000,
                              isClosable: true,
                            });
                          }
                        } catch (error: any) {
                          toast({
                            title: "Facebook login failed",
                            description:
                              error?.message ?? "An unexpected error occurred",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                          });
                        }
                      }}
                    >
                      Login with Facebook
                    </Button>
                  </AlertDescription>
                </Box>
              </Alert>
            )}

            {isLoading ? (
              <VStack spacing={4} py={8}>
                <Spinner size="lg" />
                <Text>Loading your Facebook pages...</Text>
              </VStack>
            ) : pages.length === 0 && !error ? (
              <Alert status="info">
                <AlertIcon />
                <Box>
                  <AlertTitle>No Facebook pages found</AlertTitle>
                  <AlertDescription>
                    You don't have any Facebook pages associated with your
                    account that you can manage.
                    <br />
                    <br />
                    <strong>To connect Facebook pages:</strong>
                    <br />• You must have admin/editor access to Facebook pages
                    <br />• Login with Facebook (not just Google) to access your
                    pages
                    <br />• Grant page management permissions when logging in
                    <br />
                    <br />
                    If you just logged in with Facebook, try refreshing this
                    page or clicking "Connect Facebook" again.
                  </AlertDescription>
                </Box>
              </Alert>
            ) : (
              <VStack spacing={3} align="stretch">
                {pages.map((page) => (
                  <Box
                    key={page.id}
                    p={3}
                    borderWidth={1}
                    borderRadius="md"
                    borderColor={
                      selectedPages.includes(page.id) ? "blue.300" : "gray.200"
                    }
                    bg={selectedPages.includes(page.id) ? "blue.50" : "white"}
                  >
                    <HStack spacing={3}>
                      <Checkbox
                        isChecked={selectedPages.includes(page.id)}
                        onChange={() => handlePageToggle(page.id)}
                        colorScheme="blue"
                      />
                      <VStack align="start" spacing={1} flex={1}>
                        <HStack>
                          {page.profile_picture ? (
                            <Image
                              src={page.profile_picture}
                              alt={`${page.name} profile`}
                              boxSize="24px"
                              borderRadius="full"
                              objectFit="cover"
                            />
                          ) : (
                            <Avatar size="xs" name={page.name} />
                          )}
                          <Text fontWeight="medium">{page.name}</Text>
                          {page.category && (
                            <Badge colorScheme="gray" size="sm">
                              {page.category}
                            </Badge>
                          )}
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          Page ID: {page.id}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleConnect}
            isLoading={isConnecting}
            loadingText="Connecting..."
            isDisabled={selectedPages.length === 0 || isLoading}
          >
            Connect {selectedPages.length > 0 && `(${selectedPages.length})`}
          </Button>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
