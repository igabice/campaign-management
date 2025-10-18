import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Tag,
  TagLabel,
  TagCloseButton,
  Checkbox,
  CheckboxGroup,
  Switch,
  Progress,
  FormControl,
  FormLabel,
  FormHelperText,
  useToast,
  useClipboard,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { teamsApi } from "../../services/teams";
import { userPreferenceApi } from "../../services/userPreferences";
import { useAuth } from "../../features/auth/AuthContext";
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

const POPULAR_TOPICS = [
  "Digital Marketing",
  "Mental Health",
  "Fitness",
  "Viral Trends",
  "Real Estate",
  "Fashion & Beauty",
  "Gaming",
  "Self-Care",
  "Minimalism",
  "Influencer Marketing",
  "Photography",
  "Software Engineering",
  "Technology",
  "Cybersecurity",
  "Podcasting",
  "Career Development",
  "Personal Branding",
];

const OnboardingPage: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1 data
  const [teamName, setTeamName] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Step 2 data
  const [preferredDays, setPreferredDays] = useState<string[]>([
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
  ]);
  const [preferredTimes, setPreferredTimes] = useState<string[]>([
    "09:00",
    "14:00",
    "19:00",
  ]);

  // Step 3 data
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [telegramChatId, setTelegramChatId] = useState("");
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");

  // Telegram setup
  const userId = session?.user?.id || "";
  const { onCopy, hasCopied } = useClipboard(userId);

  useEffect(() => {
    if (session?.user?.name) {
      setTeamName(`${session.user.name}'s Profile`);
    }
  }, [session]);

  const addTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      setTopics([...topics, newTopic.trim()]);
      setNewTopic("");
      setSuggestions([]);
    }
  };

  const removeTopic = (topicToRemove: string) => {
    setTopics(topics.filter((t) => t !== topicToRemove));
  };

  const handleNewTopicChange = (value: string) => {
    setNewTopic(value);
    if (value.trim()) {
      setSuggestions(
        POPULAR_TOPICS.filter(
          (topic) =>
            topic.toLowerCase().includes(value.toLowerCase()) &&
            !topics.includes(topic)
        )
      );
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (topic: string) => {
    if (!topics.includes(topic)) {
      setTopics([...topics, topic]);
    }
    setNewTopic("");
    setSuggestions([]);
  };

  const addTime = () => {
    const newTime = "09:00";
    if (!preferredTimes.includes(newTime)) {
      setPreferredTimes([...preferredTimes, newTime]);
    }
  };

  const removeTime = (index: number) => {
    setPreferredTimes(preferredTimes.filter((_, i) => i !== index));
  };

  const updateTime = (index: number, value: string) => {
    const newTimes = [...preferredTimes];
    newTimes[index] = value;
    setPreferredTimes(newTimes);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Create team
      const team = await teamsApi.createTeam({
        title: teamName,
      });

      // Create user preferences
      const preferencesData = {
        emailNotifications,
        telegramEnabled,
        telegramChatId: telegramEnabled ? telegramChatId : undefined,
        whatsappEnabled,
        whatsappNumber: whatsappEnabled ? whatsappNumber : undefined,
        postsPerDay: 3,
        postsPerWeek: 15,
        preferredPostTimes: preferredTimes,
        preferredPostDays: preferredDays,
        topics: topics.map((topic) => ({ topic, weight: 1 })),
      } as Partial<UserPreference>;

      await userPreferenceApi.createUserPreferences(preferencesData);

      toast({
        title: "Welcome!",
        description: "Your account has been set up successfully.",
        status: "success",
        duration: 5000,
      });

      // Small delay to ensure data is committed
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during onboarding:", error);
      toast({
        title: "Error",
        description: "Failed to complete setup. Please try again.",
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="md" mb={2}>
          Welcome! Let's set up your profile
        </Heading>
        <Text color="gray.600">
          First, tell us about your team and interests.
        </Text>
      </Box>

      <FormControl>
        <FormLabel>Team Name</FormLabel>
        <Input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Enter your team name"
        />
        <FormHelperText>
          This will be the name of your content team (e.g., "Santa's Profile")
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>Topics of Interest</FormLabel>
        <HStack>
          <Input
            placeholder="Add a topic (e.g., Technology, Health)"
            value={newTopic}
            onChange={(e) => handleNewTopicChange(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTopic()}
          />
          <Button
            colorScheme="yellow"
            onClick={addTopic}
            isDisabled={!newTopic.trim()}
          >
            Add
          </Button>
        </HStack>
        {suggestions.length > 0 && (
          <VStack align="start" spacing={1} mt={2}>
            {suggestions.slice(0, 5).map((suggestion) => (
              <Button
                key={suggestion}
                size="sm"
                variant="ghost"
                onClick={() => selectSuggestion(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </VStack>
        )}
        <FormHelperText>
          Add topics you're interested in for content generation
        </FormHelperText>
        <Box mt={3}>
          <HStack wrap="wrap" spacing={2}>
            {topics.map((topic) => (
              <Tag key={topic} size="md" colorScheme="yellow" variant="solid">
                <TagLabel>{topic}</TagLabel>
                <TagCloseButton onClick={() => removeTopic(topic)} />
              </Tag>
            ))}
          </HStack>
        </Box>
      </FormControl>
    </VStack>
  );

  const renderStep2 = () => (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="md" mb={2}>
          Content Scheduling
        </Heading>
        <Text color="gray.600">When would you like to post content?</Text>
      </Box>

      <FormControl>
        <FormLabel mb={3}>Preferred Posting Days</FormLabel>
        <CheckboxGroup
          value={preferredDays}
          onChange={(values) => setPreferredDays(values as string[])}
        >
          <VStack align="start" spacing={2}>
            {DAYS_OF_WEEK.map((day) => (
              <Checkbox key={day.value} value={day.value}>
                {day.label}
              </Checkbox>
            ))}
          </VStack>
        </CheckboxGroup>
      </FormControl>

      <FormControl>
        <FormLabel mb={3}>Preferred Posting Times</FormLabel>
        <VStack align="stretch" spacing={3}>
          {preferredTimes.map((time, index) => (
            <HStack key={index}>
              <Input
                type="time"
                value={time}
                onChange={(e) => updateTime(index, e.target.value)}
              />
              <Button
                size="sm"
                colorScheme="red"
                variant="outline"
                onClick={() => removeTime(index)}
              >
                Remove
              </Button>
            </HStack>
          ))}
          <Button
            size="sm"
            colorScheme="yellow"
            variant="outline"
            onClick={addTime}
          >
            Add Time
          </Button>
        </VStack>
        <FormHelperText>
          Select the times you prefer to post content
        </FormHelperText>
      </FormControl>
    </VStack>
  );

  const renderStep3 = () => (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="md" mb={2}>
          Notification Preferences
        </Heading>
        <Text color="gray.600">
          How would you like to receive notifications?
        </Text>
      </Box>

      <FormControl>
        <HStack justify="space-between">
          <Box>
            <FormLabel mb={1}>Email Notifications</FormLabel>
            <FormHelperText>Receive notifications via email</FormHelperText>
          </Box>
          <Switch
            colorScheme="yellow"
            isChecked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
          />
        </HStack>
      </FormControl>

      <FormControl>
        <HStack justify="space-between">
          <Box>
            <FormLabel mb={1}>Telegram Notifications</FormLabel>
            <FormHelperText>Receive notifications via Telegram</FormHelperText>
          </Box>
          <Switch
            colorScheme="yellow"
            isChecked={telegramEnabled}
            onChange={(e) => setTelegramEnabled(e.target.checked)}
          />
        </HStack>
        {telegramEnabled && (
          <VStack spacing={3} mt={3} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Step 1: Copy your User ID
              </Text>
              <HStack>
                <Input
                  value={userId}
                  isReadOnly
                  placeholder="Your User ID will appear here"
                />
                <Tooltip label={hasCopied ? "Copied!" : "Copy User ID"}>
                  <IconButton
                    aria-label="Copy User ID"
                    icon={<CopyIcon />}
                    onClick={onCopy}
                    colorScheme={hasCopied ? "green" : "gray"}
                  />
                </Tooltip>
              </HStack>
              <Text fontSize="xs" color="gray.600" mt={1}>
                This is your unique identifier needed to link your Telegram
                account.
              </Text>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Step 2: Start Telegram Chat
              </Text>
              <Button
                colorScheme="blue"
                size="sm"
                onClick={() => {
                  const botUsername =
                    process.env.REACT_APP_TELEGRAM_BOT_USERNAME ||
                    "dokahub_bot";
                  const telegramUrl = `https://t.me/${botUsername}?start=${userId}`;
                  window.open(telegramUrl, "_blank");
                }}
                leftIcon={<Text>📱</Text>}
              >
                Open Telegram Chat
              </Button>
              <Text fontSize="xs" color="gray.600" mt={1}>
                Click to open Telegram and send your User ID to enable
                notifications.
              </Text>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Step 3: Confirm Setup
              </Text>
              <Input
                placeholder="Telegram Chat ID (will be auto-filled)"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
              />
              <Text fontSize="xs" color="gray.600" mt={1}>
                This will be automatically filled once you complete the Telegram
                setup.
              </Text>
            </Box>
          </VStack>
        )}
      </FormControl>

      <FormControl>
        <HStack justify="space-between">
          <Box>
            <FormLabel mb={1}>WhatsApp Notifications</FormLabel>
            <FormHelperText>Receive notifications via WhatsApp</FormHelperText>
          </Box>
          <Switch
            colorScheme="yellow"
            isChecked={whatsappEnabled}
            onChange={(e) => setWhatsappEnabled(e.target.checked)}
          />
        </HStack>
        {whatsappEnabled && (
          <Box mt={3}>
            <PhoneInput
              value={whatsappNumber}
              onChange={(value) => setWhatsappNumber(value)}
              country={"us"}
              inputStyle={{ width: "100%" }}
            />
          </Box>
        )}
      </FormControl>
    </VStack>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="xl" mb={2}>
            Get Started
          </Heading>
          <Text color="gray.600">
            Let's set up your account in just a few steps
          </Text>
        </Box>

        <Box>
          <Progress
            value={(currentStep / 3) * 100}
            colorScheme="yellow"
            size="lg"
            mb={4}
          />
          <Text textAlign="center" fontSize="sm" color="gray.600">
            Step {currentStep} of 3
          </Text>
        </Box>

        <Box minH="400px">{renderCurrentStep()}</Box>

        <HStack justify="space-between">
          <Button
            variant="outline"
            onClick={prevStep}
            isDisabled={currentStep === 1}
          >
            Previous
          </Button>
          {currentStep < 3 ? (
            <Button colorScheme="yellow" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button
              colorScheme="yellow"
              onClick={handleSubmit}
              isLoading={loading}
              loadingText="Setting up..."
            >
              Complete Setup
            </Button>
          )}
        </HStack>
      </VStack>
    </Container>
  );
};

export default OnboardingPage;
