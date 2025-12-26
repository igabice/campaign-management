import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  FormControl,
  FormLabel,
  Avatar,
  HStack,
  Spinner,
  useToast,
  Divider,
  Badge,
} from "@chakra-ui/react";
import { useAuth } from "../../features/auth/AuthContext";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  isAdmin: boolean;
  createdAt: string;
}

const ProfilePage: React.FC = () => {
  const { session, isLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingName, setSavingName] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [editNameMode, setEditNameMode] = useState(false);
  const [editEmailMode, setEditEmailMode] = useState(false);
  const [nameFormData, setNameFormData] = useState("");
  const [emailFormData, setEmailFormData] = useState("");
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const toast = useToast();

  const loadProfile = useCallback(async () => {
    try {
      // For now, we'll use the session data. In a real app, you might have a dedicated profile endpoint
      const userData = session?.user;
      if (userData) {
        const profileData: UserProfile = {
          id: userData.id,
          name: userData.name || "",
          email: userData.email || "",
          image: userData.image || undefined,
          emailVerified: userData.emailVerified || false,
          twoFactorEnabled: false, // This would come from a separate API call
          isAdmin: false, // This would come from a separate API call
          createdAt: userData.createdAt ? new Date(userData.createdAt).toISOString() : new Date().toISOString(),
        };
        setProfile(profileData);
        setNameFormData(profileData.name);
        setEmailFormData(profileData.email);
      }
    } catch (error: any) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error",
        description: `Failed to load profile: ${error.message}`,
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [session?.user, toast]);

  useEffect(() => {
    if (session?.user) {
      loadProfile();
    }
  }, [session, loadProfile]);

  const handleSaveName = async () => {
    if (!profile) return;

    setSavingName(true);
    try {
      // In a real app, you'd call an API to update the name
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      setProfile(prev => prev ? { ...prev, name: nameFormData } : null);
      setEditNameMode(false);

      toast({
        title: "Success",
        description: "Name updated successfully",
        status: "success",
        duration: 3000,
      });
    } catch (error: any) {
      console.error("Error updating name:", error);
      toast({
        title: "Error",
        description: `Failed to update name: ${error.message}`,
        status: "error",
        duration: 5000,
      });
    } finally {
      setSavingName(false);
    }
  };

  const handleSaveEmail = async () => {
    if (!profile) return;

    setSavingEmail(true);
    try {
      // In a real app, you'd call an API to request email change
      // This would send a verification email to the new email address
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      setEmailVerificationSent(true);
      setEditEmailMode(false);

      toast({
        title: "Verification Email Sent",
        description: "Please check your email and click the verification link to complete the email change.",
        status: "info",
        duration: 5000,
      });
    } catch (error: any) {
      console.error("Error requesting email change:", error);
      toast({
        title: "Error",
        description: `Failed to request email change: ${error.message}`,
        status: "error",
        duration: 5000,
      });
    } finally {
      setSavingEmail(false);
    }
  };

  const handleCancelName = () => {
    if (profile) {
      setNameFormData(profile.name);
    }
    setEditNameMode(false);
  };

  const handleCancelEmail = () => {
    if (profile) {
      setEmailFormData(profile.email);
    }
    setEditEmailMode(false);
    setEmailVerificationSent(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading || loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="400px"
      >
        <Spinner size="xl" color="yellow.500" />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box textAlign="center" py={20}>
        <Text>Failed to load profile</Text>
      </Box>
    );
  }

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="xl" mb={2}>
            Profile Settings
          </Heading>
          <Text color="gray.600">
            Manage your account information and preferences
          </Text>
        </Box>

        <Card>
          <CardHeader>
            <HStack spacing={4}>
              <Avatar
                size="lg"
                name={profile.name}
                src={profile.image}
              />
              <VStack align="start" spacing={1}>
                <Heading size="md">{profile.name}</Heading>
                <Text color="gray.600">{profile.email}</Text>
                <HStack>
                  {profile.emailVerified && (
                    <Badge colorScheme="green" fontSize="xs">
                      Email Verified
                    </Badge>
                  )}
                  {profile.isAdmin && (
                    <Badge colorScheme="purple" fontSize="xs">
                      Admin
                    </Badge>
                  )}
                  {profile.twoFactorEnabled && (
                    <Badge colorScheme="blue" fontSize="xs">
                      2FA Enabled
                    </Badge>
                  )}
                </HStack>
              </VStack>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              {/* Name Update Section */}
              <Box>
                <FormControl>
                  <FormLabel>Full Name</FormLabel>
                  {editNameMode ? (
                    <VStack spacing={3} align="stretch">
                      <Input
                        value={nameFormData}
                        onChange={(e) => setNameFormData(e.target.value)}
                        placeholder="Enter your full name"
                      />
                      <HStack justify="flex-end" spacing={3}>
                        <Button size="sm" variant="outline" onClick={handleCancelName}>
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="yellow"
                          onClick={handleSaveName}
                          isLoading={savingName}
                          loadingText="Saving..."
                        >
                          Save Name
                        </Button>
                      </HStack>
                    </VStack>
                  ) : (
                    <HStack justify="space-between" align="center">
                      <Text fontSize="md" py={2}>
                        {profile.name}
                      </Text>
                      <Button size="sm" variant="outline" onClick={() => setEditNameMode(true)}>
                        Edit
                      </Button>
                    </HStack>
                  )}
                </FormControl>
              </Box>

              {/* Email Update Section */}
              <Box>
                <FormControl>
                  <FormLabel>Email Address</FormLabel>
                  {editEmailMode ? (
                    <VStack spacing={3} align="stretch">
                      <Input
                        type="email"
                        value={emailFormData}
                        onChange={(e) => setEmailFormData(e.target.value)}
                        placeholder="Enter your new email address"
                      />
                      <Text fontSize="sm" color="gray.600">
                        Changing your email will require verification. We'll send a confirmation link to your new email address.
                      </Text>
                      <HStack justify="flex-end" spacing={3}>
                        <Button size="sm" variant="outline" onClick={handleCancelEmail}>
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="yellow"
                          onClick={handleSaveEmail}
                          isLoading={savingEmail}
                          loadingText="Sending..."
                          isDisabled={!emailFormData || emailFormData === profile.email}
                        >
                          Send Verification Email
                        </Button>
                      </HStack>
                    </VStack>
                  ) : emailVerificationSent ? (
                    <VStack spacing={3} align="start">
                      <Text fontSize="md" py={2}>
                        {profile.email}
                      </Text>
                      <Badge colorScheme="blue" fontSize="sm">
                        Verification Email Sent
                      </Badge>
                      <Text fontSize="sm" color="gray.600">
                        Please check your email and click the verification link to complete the change.
                      </Text>
                      <Button size="sm" variant="outline" onClick={handleCancelEmail}>
                        Cancel Change
                      </Button>
                    </VStack>
                  ) : (
                    <HStack justify="space-between" align="center">
                      <VStack align="start" spacing={1}>
                        <Text fontSize="md">
                          {profile.email}
                        </Text>
                        {profile.emailVerified && (
                          <Badge colorScheme="green" fontSize="xs">
                            Verified
                          </Badge>
                        )}
                      </VStack>
                      <Button size="sm" variant="outline" onClick={() => setEditEmailMode(true)}>
                        Change Email
                      </Button>
                    </HStack>
                  )}
                </FormControl>
              </Box>

              <Divider />

              <FormControl>
                <FormLabel>Account Created</FormLabel>
                <Text fontSize="md" py={2}>
                  {formatDate(profile.createdAt)}
                </Text>
              </FormControl>


            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Account Security</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Box>
                  <Text fontWeight="semibold">Two-Factor Authentication</Text>
                  <Text fontSize="sm" color="gray.600">
                    Add an extra layer of security to your account
                  </Text>
                </Box>
                <Badge colorScheme={profile.twoFactorEnabled ? "green" : "gray"}>
                  {profile.twoFactorEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </HStack>

              <Divider />

              <HStack justify="space-between">
                <Box>
                  <Text fontWeight="semibold">Password</Text>
                  <Text fontSize="sm" color="gray.600">
                    Last updated: Never (set a password to secure your account)
                  </Text>
                </Box>
                <Button size="sm" variant="outline">
                  Change Password
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default ProfilePage;