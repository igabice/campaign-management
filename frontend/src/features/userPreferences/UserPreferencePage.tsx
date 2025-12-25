import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Switch,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
  CheckboxGroup,
  Tag,
  TagLabel,
  TagCloseButton,
  useToast,
  Spinner,
  Divider,
  FormControl,
  FormLabel,
  FormHelperText,
  Card,
  CardHeader,
  CardBody,
  Grid,
  useClipboard,
} from "@chakra-ui/react";
import { userPreferenceApi } from "../../services/userPreferences";
import { UserPreference } from "../../types/schemas";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const DAYS_OF_WEEK = [
  { value: "MON", label: "Monday" },
  { value: "TUE", label: "Tuesday" },
  { value: "WED", label: "Wednesday" },
  { value: "THU", label: "Thursday" },
  { value: "FRI", label: "Friday" },
  { value: "SAT", label: "Saturday" },
  { value: "SUN", label: "Sunday" },
];

const UserPreferencePage: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreference | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const toast = useToast();
  const { onCopy: copyUserId, hasCopied: hasCopiedUserId } = useClipboard(
    preferences?.userId || ""
  );

  const loadPreferences = useCallback(async () => {
    try {
      console.log("Loading preferences...");
      const preferences = await userPreferenceApi.getUserPreferences();
      console.log("Preferences loaded:", preferences);
      setPreferences(preferences);
      setLoading(false);
    } catch (error: any) {
      console.error("Error loading preferences:", error);
      console.error("Error response:", error.response);
      // Check if it's a 404 (preferences not found) or other error
      if (error.response?.status === 404) {
        console.log("Preferences not found, creating defaults...");
        // Preferences don't exist, create default ones
        await createDefaultPreferences();
      } else {
        // Other error, show error message
        toast({
          title: "Error",
          description: `Failed to load user preferences: ${
            error.response?.data?.message || error.message
          }`,
          status: "error",
          duration: 5000,
        });
        setLoading(false);
      }
    }
  }, [toast]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const createDefaultPreferences = async () => {
    try {
      const defaultPrefs = {
        emailNotifications: true,
        telegramEnabled: false,
        whatsappEnabled: false,
        postsPerDay: 3,
        postsPerWeek: 15,
        preferredPostTimes: ["09:00", "14:00", "19:00"],
        preferredPostDays: ["MON", "TUE", "WED", "THU", "FRI"],
        topics: [],
      };
      const preferences = await userPreferenceApi.createUserPreferences(
        defaultPrefs
      );
      setPreferences(preferences);
      setLoading(false);
    } catch (error) {
      console.error("Error creating default preferences:", error);
      toast({
        title: "Error",
        description: "Failed to load user preferences",
        status: "error",
        duration: 5000,
      });
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!preferences) return;

    setSaving(true);
    try {
      const { id, userId, createdAt, updatedAt, topics, ...updateData } =
        preferences;
      const updatedPreferences = await userPreferenceApi.updateUserPreferences(
        updateData
      );
      setPreferences(updatedPreferences);
      toast({
        title: "Success",
        description: "Preferences saved successfully",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save preferences",
        status: "error",
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddTopic = async () => {
    if (!newTopic.trim() || !preferences) return;

    const updatedTopics = [
      ...(preferences.topics || []),
      { topic: newTopic.trim(), weight: 1 },
    ];

    try {
      const updatedPreferences = await userPreferenceApi.updateTopics(
        updatedTopics
      );
      setPreferences(updatedPreferences);
      setNewTopic("");
    } catch (error) {
      console.error("Error adding topic:", error);
      toast({
        title: "Error",
        description: "Failed to add topic",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleRemoveTopic = async (topicToRemove: string) => {
    if (!preferences) return;

    const updatedTopics = (preferences.topics || []).filter(
      (t) => t.topic !== topicToRemove
    );

    try {
      const updatedPreferences = await userPreferenceApi.updateTopics(
        updatedTopics
      );
      setPreferences(updatedPreferences);
    } catch (error) {
      console.error("Error removing topic:", error);
      toast({
        title: "Error",
        description: "Failed to remove topic",
        status: "error",
        duration: 3000,
      });
    }
  };

  const updatePreference = (field: keyof UserPreference, value: any) => {
    if (!preferences) return;
    setPreferences({ ...preferences, [field]: value });
  };

  if (loading) {
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

  if (!preferences) {
    return (
      <Box textAlign="center" py={20}>
        <Text>Failed to load preferences</Text>
      </Box>
    );
  }

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="xl" mb={2}>
            User Preferences
          </Heading>
          <Text color="gray.600">
            Customize your content creation and notification preferences
          </Text>
        </Box>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <Heading size="md">Notification Preferences</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <FormControl>
                <HStack justify="space-between">
                  <Box>
                    <FormLabel mb={1}>Email Notifications</FormLabel>
                    <FormHelperText>
                      Receive notifications via email
                    </FormHelperText>
                  </Box>
                  <Switch
                    colorScheme="yellow"
                    isChecked={preferences.emailNotifications}
                    onChange={(e) =>
                      updatePreference("emailNotifications", e.target.checked)
                    }
                  />
                </HStack>
              </FormControl>

              <Divider />

              <FormControl>
                <HStack justify="space-between">
                  <Box>
                    <FormLabel mb={1}>Telegram Notifications</FormLabel>
                    <FormHelperText>
                      Receive notifications via Telegram
                    </FormHelperText>
                  </Box>
                  <Switch
                    colorScheme="yellow"
                    isChecked={preferences.telegramEnabled}
                    onChange={(e) =>
                      updatePreference("telegramEnabled", e.target.checked)
                    }
                  />
                </HStack>
                {preferences.telegramEnabled && (
                  <Box mt={3}>
                    <Text fontSize="sm" color="gray.600" mb={2}>
                      To enable Telegram notifications:
                    </Text>
                    <VStack align="start" spacing={2}>
                      {!preferences.telegramChatId && (
                        <Button
                          as="a"
                          href={`https://t.me/dokahub_bot?start=${preferences.userId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="sm"
                          colorScheme="blue"
                          mb={2}
                        >
                          Connect to Telegram
                        </Button>
                      )}
                      <Text fontSize="sm">
                        1. Start a chat with our bot:{" "}
                        <strong>@dokahub_bot</strong>
                      </Text>
                      <Text fontSize="sm">
                        2. Send your user ID:{" "}
                        {preferences.telegramChatId ? (
                          "Already connected!"
                        ) : (
                          <HStack spacing={2} align="center">
                            <Text>Send this ID to the bot:</Text>
                            <Button
                              size="xs"
                              onClick={copyUserId}
                              colorScheme="gray"
                            >
                              {hasCopiedUserId ? "Copied!" : preferences.userId}
                            </Button>
                          </HStack>
                        )}
                      </Text>
                      {preferences.telegramChatId && (
                        <VStack align="start" spacing={2}>
                          <Text fontSize="sm" color="green.500">
                            ✅ Telegram notifications are active
                          </Text>
                          <Button
                            size="sm"
                            colorScheme="red"
                            variant="outline"
                            onClick={() => {
                              updatePreference("telegramChatId", undefined);
                              updatePreference("telegramEnabled", false);
                              toast({
                                title: "Telegram Unlinked",
                                description:
                                  "Telegram notifications have been disabled",
                                status: "info",
                                duration: 3000,
                              });
                            }}
                          >
                            Unlink Telegram
                          </Button>
                        </VStack>
                      )}
                    </VStack>
                  </Box>
                )}
              </FormControl>

              <Divider />

              <FormControl>
                <HStack justify="space-between">
                  <Box>
                    <FormLabel mb={1}>WhatsApp Notifications</FormLabel>
                    <FormHelperText>
                      Receive notifications via WhatsApp
                    </FormHelperText>
                  </Box>
                  <Switch
                    colorScheme="yellow"
                    isChecked={preferences.whatsappEnabled}
                    onChange={(e) =>
                      updatePreference("whatsappEnabled", e.target.checked)
                    }
                  />
                </HStack>
                {preferences.whatsappEnabled && (
                  <Box mt={3}>
                    <PhoneInput
                      placeholder="WhatsApp Number (without +)"
                      value={preferences.whatsappNumber || ""}
                      onChange={(value) =>
                        updatePreference("whatsappNumber", value)
                      }
                      country={"us"}
                      inputStyle={{
                        width: "100%",
                        height: "40px",
                        fontSize: "16px",
                      }}
                    />
                  </Box>
                )}
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        {/* Content Planning Preferences */}
        <Card>
          <CardHeader>
            <Heading size="md">Content Planning Preferences</Heading>
          </CardHeader>
          <CardBody>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap={6}
            >
              <FormControl>
                <FormLabel>Posts Per Day</FormLabel>
                <NumberInput
                  min={1}
                  max={20}
                  value={preferences.postsPerDay || 3}
                  onChange={(_, value) =>
                    updatePreference("postsPerDay", value)
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormHelperText>
                  Number of posts to create per day
                </FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>Posts Per Week</FormLabel>
                <NumberInput
                  min={1}
                  max={100}
                  value={preferences.postsPerWeek || 15}
                  onChange={(_, value) =>
                    updatePreference("postsPerWeek", value)
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormHelperText>
                  Number of posts to create per week
                </FormHelperText>
              </FormControl>
            </Grid>

            <Divider my={6} />

            <FormControl>
              <FormLabel mb={3}>Preferred Posting Days</FormLabel>
              <CheckboxGroup
                value={preferences.preferredPostDays || []}
                onChange={(values) =>
                  updatePreference("preferredPostDays", values)
                }
              >
                <Grid
                  templateColumns={{
                    base: "repeat(2, 1fr)",
                    md: "repeat(4, 1fr)",
                  }}
                  gap={3}
                >
                  {DAYS_OF_WEEK.map((day) => (
                    <Checkbox key={day.value} value={day.value}>
                      {day.label}
                    </Checkbox>
                  ))}
                </Grid>
              </CheckboxGroup>
              <FormHelperText>
                Select the days you prefer to post content
              </FormHelperText>
            </FormControl>

            <Divider my={6} />

            <FormControl>
              <FormLabel mb={3}>Preferred Posting Times</FormLabel>
              <VStack align="stretch" spacing={3}>
                {(preferences.preferredPostTimes || []).map((time, index) => (
                  <HStack key={index}>
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => {
                        const newTimes = [...preferences.preferredPostTimes];
                        newTimes[index] = e.target.value;
                        updatePreference("preferredPostTimes", newTimes);
                      }}
                    />
                    <Button
                      size="sm"
                      colorScheme="red"
                      variant="outline"
                      onClick={() => {
                        const newTimes = preferences.preferredPostTimes.filter(
                          (_, i) => i !== index
                        );
                        updatePreference("preferredPostTimes", newTimes);
                      }}
                    >
                      Remove
                    </Button>
                  </HStack>
                ))}
                <Button
                  size="sm"
                  colorScheme="yellow"
                  variant="outline"
                  onClick={() => {
                    const newTimes = [
                      ...preferences.preferredPostTimes,
                      "09:00",
                    ];
                    updatePreference("preferredPostTimes", newTimes);
                  }}
                >
                  Add Time
                </Button>
              </VStack>
              <FormHelperText>
                Select the times you prefer to post content
              </FormHelperText>
            </FormControl>
          </CardBody>
        </Card>

        {/* Content Topics */}
        <Card>
          <CardHeader>
            <Heading size="md">Content Topics</Heading>
            <Text fontSize="sm" color="gray.600">
              Add topics you're interested in for content generation
            </Text>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack>
                <Input
                  placeholder="Add a topic (e.g., Technology, Health, Travel)"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTopic()}
                />
                <Button
                  colorScheme="yellow"
                  onClick={handleAddTopic}
                  isDisabled={!newTopic.trim()}
                >
                  Add
                </Button>
              </HStack>

              <Box>
                <Text fontSize="sm" color="gray.600" mb={2}>
                  Your Topics:
                </Text>
                <HStack wrap="wrap" spacing={2}>
                  {(preferences.topics || []).map((topic) => (
                    <Tag
                      key={topic.topic}
                      size="md"
                      colorScheme="yellow"
                      variant="solid"
                    >
                      <TagLabel>{topic.topic}</TagLabel>
                      <TagCloseButton
                        onClick={() => handleRemoveTopic(topic.topic)}
                      />
                    </Tag>
                  ))}
                  {preferences.topics?.length === 0 && (
                    <Text fontSize="sm" color="gray.500" fontStyle="italic">
                      No topics added yet
                    </Text>
                  )}
                </HStack>
              </Box>
            </VStack>
          </CardBody>
        </Card>

        {/* Save Button */}
        <Box textAlign="center">
          <Button
            colorScheme="yellow"
            size="lg"
            onClick={handleSave}
            isLoading={saving}
            loadingText="Saving..."
          >
            Save Preferences
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default UserPreferencePage;
