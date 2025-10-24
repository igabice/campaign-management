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
  Grid,
  GridItem,
  Image,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { teamsApi } from "../../services/teams";
import { userPreferenceApi } from "../../services/userPreferences";
import { useAuth } from "../../features/auth/AuthContext";
import { useTeam } from "../../contexts/TeamContext";
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
  const { refreshTeams } = useTeam();
  const navigate = useNavigate();
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1 data
  const [teamName, setTeamName] = useState("");
  const [topics, setTopics] = useState<string[]>([]);

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

  const removeTopic = (topicToRemove: string) => {
    setTopics(topics.filter((t) => t !== topicToRemove));
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

      // Refresh teams in context to load the newly created team
      await refreshTeams();

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
      <FormControl>
        <FormLabel fontWeight="semibold">Team Name</FormLabel>
        <Input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Enter your team name"
          size="lg"
        />
        <FormHelperText>
          This will be the name of your content team (e.g., "Santa's Profile")
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel fontWeight="semibold">Topics of Interest</FormLabel>
        <FormHelperText mb={4}>
          Select topics you're interested in for personalized content generation
        </FormHelperText>
        <Grid templateColumns="repeat(auto-fill, minmax(140px, 1fr))" gap={3}>
          {POPULAR_TOPICS.map((topic) => {
            const isSelected = topics.includes(topic);
            return (
              <Box
                key={topic}
                as="button"
                onClick={() => {
                  if (isSelected) {
                    removeTopic(topic);
                  } else {
                    setTopics([...topics, topic]);
                  }
                }}
                p={3}
                borderRadius="lg"
                border="2px solid"
                borderColor={isSelected ? "yellow.400" : "gray.200"}
                bg={isSelected ? "yellow.50" : "white"}
                color={isSelected ? "yellow.800" : "gray.700"}
                fontWeight={isSelected ? "semibold" : "medium"}
                fontSize="sm"
                textAlign="center"
                transition="all 0.2s"
                _hover={{
                  borderColor: isSelected ? "yellow.500" : "gray.300",
                  bg: isSelected ? "yellow.100" : "gray.50",
                  transform: "translateY(-1px)",
                  shadow: "sm",
                }}
                _active={{
                  transform: "translateY(0)",
                }}
              >
                {topic}
              </Box>
            );
          })}
        </Grid>
        {topics.length > 0 && (
          <Box mt={4}>
            <Text fontSize="sm" color="gray.600" mb={2}>
              Selected topics ({topics.length}):
            </Text>
            <HStack wrap="wrap" spacing={2}>
              {topics.map((topic) => (
                <Tag key={topic} size="sm" colorScheme="yellow" variant="solid">
                  <TagLabel>{topic}</TagLabel>
                  <TagCloseButton onClick={() => removeTopic(topic)} />
                </Tag>
              ))}
            </HStack>
          </Box>
        )}
      </FormControl>
    </VStack>
  );

  const renderStep2 = () => (
    <VStack spacing={6} align="stretch">
      <FormControl>
        <FormLabel fontWeight="semibold" mb={3}>
          Preferred Posting Days
        </FormLabel>
        <CheckboxGroup
          value={preferredDays}
          onChange={(values) => setPreferredDays(values as string[])}
        >
          <VStack align="start" spacing={3}>
            {DAYS_OF_WEEK.map((day) => (
              <Checkbox key={day.value} value={day.value} size="lg">
                {day.label}
              </Checkbox>
            ))}
          </VStack>
        </CheckboxGroup>
      </FormControl>

      <FormControl>
        <FormLabel fontWeight="semibold" mb={3}>
          Preferred Posting Times
        </FormLabel>
        <VStack align="stretch" spacing={3}>
          {preferredTimes.map((time, index) => (
            <HStack key={index}>
              <Input
                type="time"
                value={time}
                onChange={(e) => updateTime(index, e.target.value)}
                size="lg"
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
      <FormControl>
        <HStack justify="space-between">
          <Box>
            <FormLabel fontWeight="semibold" mb={1}>
              Email Notifications
            </FormLabel>
            <FormHelperText>Receive notifications via email</FormHelperText>
          </Box>
          <Switch
            colorScheme="yellow"
            isChecked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
            size="lg"
          />
        </HStack>
      </FormControl>

      <FormControl>
        <HStack justify="space-between">
          <Box>
            <FormLabel fontWeight="semibold" mb={1}>
              Telegram Notifications
            </FormLabel>
            <FormHelperText>Receive notifications via Telegram</FormHelperText>
          </Box>
          <Switch
            colorScheme="yellow"
            isChecked={telegramEnabled}
            onChange={(e) => setTelegramEnabled(e.target.checked)}
            size="lg"
          />
        </HStack>
        {telegramEnabled && (
          <VStack
            spacing={4}
            mt={4}
            align="stretch"
            p={4}
            bg="gray.50"
            borderRadius="md"
          >
            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={2} color="blue.600">
                Step 1: Copy your User ID
              </Text>
              <HStack>
                <Input
                  value={userId}
                  isReadOnly
                  placeholder="Your User ID will appear here"
                  size="sm"
                />
                <Tooltip label={hasCopied ? "Copied!" : "Copy User ID"}>
                  <IconButton
                    aria-label="Copy User ID"
                    icon={<CopyIcon />}
                    onClick={onCopy}
                    colorScheme={hasCopied ? "green" : "gray"}
                    size="sm"
                  />
                </Tooltip>
              </HStack>
              <Text fontSize="xs" color="gray.600" mt={1}>
                This is your unique identifier needed to link your Telegram
                account.
              </Text>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={2} color="blue.600">
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
              <Text fontSize="sm" fontWeight="semibold" mb={2} color="blue.600">
                Step 3: Confirm Setup
              </Text>
              <Input
                placeholder="Telegram Chat ID (will be auto-filled)"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                size="sm"
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
            <FormLabel fontWeight="semibold" mb={1}>
              WhatsApp Notifications
            </FormLabel>
            <FormHelperText>Receive notifications via WhatsApp</FormHelperText>
          </Box>
          <Switch
            colorScheme="yellow"
            isChecked={whatsappEnabled}
            onChange={(e) => setWhatsappEnabled(e.target.checked)}
            size="lg"
          />
        </HStack>
        {whatsappEnabled && (
          <Box mt={3}>
            <PhoneInput
              value={whatsappNumber}
              onChange={(value) => setWhatsappNumber(value)}
              country={"us"}
              inputStyle={{ width: "100%", height: "40px", fontSize: "16px" }}
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

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return {
          title: "Welcome to Dokahub",
          subtitle: "Your Social Media Command Center",
          description:
            "Let's start by setting up your team and defining your content interests. This will help us personalize your experience and generate better content recommendations.",
          highlights: [
            "Create your first team workspace",
            "Define topics you want to post about",
            "Set up your content preferences",
          ],
        };
      case 2:
        return {
          title: "Smart Content Scheduling",
          subtitle: "Post at the Perfect Time",
          description:
            "Tell us when and how often you want to post. Our intelligent scheduling system will help you reach your audience when they're most active.",
          highlights: [
            "Choose your preferred posting days",
            "Set optimal posting times",
            "Automate your content calendar",
          ],
        };
      case 3:
        return {
          title: "Stay Connected",
          subtitle: "Never Miss an Update",
          description:
            "Set up your notification preferences to stay on top of your social media campaigns. Get notified about important updates and deadlines.",
          highlights: [
            "Email and Telegram notifications",
            "WhatsApp alerts for urgent updates",
            "Customizable notification preferences",
          ],
        };
      default:
        return {
          title: "",
          subtitle: "",
          description: "",
          highlights: [],
        };
    }
  };

  const stepInfo = getStepDescription();

  return (
    <Box minH="100vh" bg="gray.50">
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} minH="100vh">
        {/* Left Side - Description */}
        <GridItem
          bg="blue.600"
          color="white"
          p={12}
          display="flex"
          alignItems="center"
        >
          <VStack spacing={8} align="stretch" maxW="500px">
            <Box>
              <Image src="/logo.png" alt="Dokahub Logo" w="200px" mb={6} />
              <Heading size="2xl" fontWeight="bold" mb={2}>
                {stepInfo.title}
              </Heading>
              <Text fontSize="lg" fontWeight="medium" opacity={0.9} mb={4}>
                {stepInfo.subtitle}
              </Text>
              <Text fontSize="md" opacity={0.8} mb={6}>
                {stepInfo.description}
              </Text>
            </Box>

            <VStack spacing={3} align="stretch">
              {stepInfo.highlights.map((highlight, index) => (
                <HStack key={index} spacing={3}>
                  <Box
                    w={2}
                    h={2}
                    bg="yellow.400"
                    borderRadius="full"
                    flexShrink={0}
                  />
                  <Text fontSize="sm" fontWeight="medium">
                    {highlight}
                  </Text>
                </HStack>
              ))}
            </VStack>

            <Box pt={4}>
              <Progress
                value={(currentStep / 3) * 100}
                colorScheme="yellow"
                size="sm"
                bg="blue.700"
              />
              <Text fontSize="xs" opacity={0.7} mt={2}>
                Step {currentStep} of 3
              </Text>
            </Box>
          </VStack>
        </GridItem>

        {/* Right Side - Form */}
        <GridItem
          bg="white"
          p={12}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <VStack spacing={8} align="stretch" maxW="500px" mx="auto" w="full">
            <Box>
              <Heading size="xl" color="gray.800" mb={2}>
                {currentStep === 1 && "Set Up Your Profile"}
                {currentStep === 2 && "Content Scheduling"}
                {currentStep === 3 && "Notification Preferences"}
              </Heading>
              <Text color="gray.600">
                {currentStep === 1 && "Tell us about your team and interests"}
                {currentStep === 2 && "When would you like to post content?"}
                {currentStep === 3 &&
                  "How would you like to receive notifications?"}
              </Text>
            </Box>

            <Box minH="300px">{renderCurrentStep()}</Box>

            <HStack justify="space-between" pt={4}>
              <Button
                variant="outline"
                onClick={prevStep}
                isDisabled={currentStep === 1}
                colorScheme="gray"
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
        </GridItem>
      </Grid>
    </Box>
  );
};

export default OnboardingPage;
