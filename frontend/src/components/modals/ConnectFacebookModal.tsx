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
  Select,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { socialMediaApi } from "../../services/socialMedia";
import { useTeam } from "../../contexts/TeamContext";
import { useAuth } from "../../features/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { authClient } from "../../lib/auth-client";

interface FacebookPage {
  id: string;
  name: string;
  access_token?: string;
  category?: string;
  tasks?: string[];
  profile_picture?: string;
  link?: string;
  has_access_token?: boolean;
}

interface ExistingFacebookPage {
  id: string;
  pageId: string;
  accountName: string;
  profileLink: string;
  image?: string;
  status: string;
}

interface FacebookAccount {
  id: string;
  accountId: string;
  providerAccountId: string;
  accessToken: string;
  expiresAt: string | null;
  createdAt: string;
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
  const [existingPages, setExistingPages] = useState<ExistingFacebookPage[]>(
    []
  );
  const [facebookAccounts, setFacebookAccounts] = useState<FacebookAccount[]>(
    []
  );
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && session) {
      fetchFacebookPages();
    }
  }, [isOpen, session]);

  useEffect(() => {
    if (selectedAccountId && facebookAccounts.length > 0) {
      // Refetch pages when selected account changes
      const fetchPagesForAccount = async () => {
        setIsLoading(true);
        try {
          const fetchedPages = await socialMediaApi.getFacebookPages(
            selectedAccountId
          );
          console.log(
            `Fetched ${fetchedPages.length} Facebook pages for account ${selectedAccountId}:`,
            fetchedPages
          );
          setPages(fetchedPages);
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to fetch Facebook pages";
          setError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPagesForAccount();
    }
  }, [selectedAccountId, facebookAccounts.length]);

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
      // Fetch Facebook accounts for this user
      const accounts = await socialMediaApi.getFacebookAccounts();
      setFacebookAccounts(accounts);

      if (accounts.length === 0) {
        // If no Facebook accounts, show message with login button
        setError(
          `Facebook authentication required. Please connect a Facebook account first.`
        );
        return;
      }

      // Set the first account as selected if none is selected
      if (!selectedAccountId && accounts.length > 0) {
        setSelectedAccountId(accounts[0].id);
      }

      // Fetch existing Facebook pages for this team
      const existingResponse = await socialMediaApi.getAllSocialMedia(1, 100, {
        teamId: activeTeam?.id,
        platform: "facebook",
      });
      setExistingPages(existingResponse.result || []);

      // If we have a selected account, fetch available pages from that account
      if (selectedAccountId || accounts.length > 0) {
        const accountIdToUse = selectedAccountId || accounts[0].id;
        const fetchedPages = await socialMediaApi.getFacebookPages(
          accountIdToUse
        );
        console.log(
          `Fetched ${fetchedPages.length} Facebook pages:`,
          fetchedPages
        );
        setPages(fetchedPages);
      }
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
      // Only save pages that are not already connected and have access tokens
      const newPagesToSave = pages.filter(
        (page) =>
          selectedPages.includes(page.id) &&
          !existingPages.some((existing) => existing.pageId === page.id) &&
          (page.access_token || page.has_access_token)
      );

      if (newPagesToSave.length === 0) {
        toast({
          title: "No new pages to connect",
          description: "All selected pages are already connected",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        onClose();
        return;
      }

      await socialMediaApi.saveFacebookPages({
        teamId: activeTeam.id,
        pages: newPagesToSave,
        accountId: selectedAccountId,
      });

      toast({
        title: "Facebook pages connected",
        description: `${newPagesToSave.length} new page(s) successfully connected`,
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
    setSelectedAccountId("");
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
              Select additional Facebook pages you want to connect for automated
              posting. Already connected pages are shown below for reference.
              Make sure you've granted the necessary permissions when logging in
              with Facebook.
            </Text>

            {facebookAccounts.length > 0 && (
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">
                  Facebook Account
                </FormLabel>
                <HStack spacing={2}>
                  <Select
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    placeholder="Select Facebook account"
                  >
                    {facebookAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        Facebook Account ({account.providerAccountId})
                      </option>
                    ))}
                  </Select>
                  <Button
                    colorScheme="facebook"
                    size="md"
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
                        } else {
                          // Refresh accounts after connecting new one
                          await fetchFacebookPages();
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
                    Connect New Account
                  </Button>
                </HStack>
              </FormControl>
            )}

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
                          } else {
                            // Refresh accounts after connecting
                            await fetchFacebookPages();
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
                      Connect Facebook Account
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
                {/* Show connected pages first */}
                {existingPages.length > 0 && (
                  <>
                    <Text fontWeight="medium" color="gray.700">
                      Already Connected ({existingPages.length})
                    </Text>
                    {existingPages.map((existingPage) => (
                      <Box
                        key={existingPage.id}
                        p={3}
                        borderWidth={1}
                        borderRadius="md"
                        borderColor="green.300"
                        bg="green.50"
                        opacity={0.7}
                      >
                        <HStack spacing={3}>
                          <Box
                            w="16px"
                            h="16px"
                            borderRadius="full"
                            bg="green.400"
                          />
                          <VStack align="start" spacing={1} flex={1}>
                            <HStack>
                              {existingPage.image ? (
                                <Image
                                  src={existingPage.image}
                                  alt={`${existingPage.accountName} profile`}
                                  boxSize="24px"
                                  borderRadius="full"
                                  objectFit="cover"
                                />
                              ) : (
                                <Avatar
                                  size="xs"
                                  name={existingPage.accountName}
                                />
                              )}
                              <Text fontWeight="medium">
                                {existingPage.accountName}
                              </Text>
                              <Badge colorScheme="green" size="sm">
                                Connected
                              </Badge>
                            </HStack>
                            <Text fontSize="sm" color="gray.600">
                              Page ID: {existingPage.pageId}
                            </Text>
                          </VStack>
                        </HStack>
                      </Box>
                    ))}
                    {pages.some(
                      (page) =>
                        !existingPages.some(
                          (existing) => existing.pageId === page.id
                        )
                    ) && (
                      <Text fontWeight="medium" color="gray.700" mt={4}>
                        Available to Connect
                      </Text>
                    )}
                  </>
                )}

                {/* Show available pages */}
                {pages
                  .filter(
                    (page) =>
                      !existingPages.some(
                        (existing) => existing.pageId === page.id
                      )
                  )
                  .map((page) => {
                    const canPost = page.access_token || page.has_access_token;
                    return (
                      <Box
                        key={page.id}
                        p={3}
                        borderWidth={1}
                        borderRadius="md"
                        borderColor={
                          selectedPages.includes(page.id)
                            ? "blue.300"
                            : "gray.200"
                        }
                        bg={
                          selectedPages.includes(page.id) ? "blue.50" : "white"
                        }
                        opacity={canPost ? 1 : 0.6}
                      >
                        <HStack spacing={3}>
                          <Checkbox
                            isChecked={selectedPages.includes(page.id)}
                            onChange={() => handlePageToggle(page.id)}
                            colorScheme="blue"
                            isDisabled={!canPost}
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
                              {!canPost && (
                                <Badge colorScheme="orange" size="sm">
                                  View Only
                                </Badge>
                              )}
                            </HStack>
                            <Text fontSize="sm" color="gray.600">
                              Page ID: {page.id}
                              {!canPost && " • No posting permissions"}
                            </Text>
                          </VStack>
                        </HStack>
                      </Box>
                    );
                  })}
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
            Add {selectedPages.length > 0 && `(${selectedPages.length})`} Page
            {selectedPages.length !== 1 ? "s" : ""}
          </Button>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
