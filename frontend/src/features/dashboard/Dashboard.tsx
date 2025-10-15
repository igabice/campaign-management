import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Text,
  Heading,
  VStack,
  HStack,
  Grid,
  GridItem,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Button,
  Select,
  Badge,
  Avatar,
  List,
  ListItem,
  Divider,
  IconButton,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import {
  CalendarIcon,
  TimeIcon,
  CheckCircleIcon,
  WarningIcon,
  ChevronRightIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useTeam } from "../../contexts/TeamContext";
import { postsApi } from "../../services/posts";
import { userPreferenceApi } from "../../services/userPreferences";
import { Post } from "../../types/schemas";
import { format } from "date-fns";
import { CreateTeamModal } from "../../components/modals/CreateTeamModal";

type PeriodFilter = "year" | "month" | "3months";
type OverdueFilter = "24hours" | "3days" | "7days";

const Dashboard: React.FC = () => {
  const { activeTeam, teams, refreshTeams } = useTeam();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState<any>(null);
  const [upcomingPosts, setUpcomingPosts] = useState<Post[]>([]);
  const [recentActivity, setRecentActivity] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user has preferences, if not redirect to onboarding
  useEffect(() => {
    const checkPreferences = async () => {
      try {
        await userPreferenceApi.getUserPreferences();
      } catch (error: any) {
        if (error.response?.status === 404) {
          navigate('/onboarding');
        }
      }
    };
    checkPreferences();
  }, [navigate]);

  // Filters
  const [scheduledPeriod, setScheduledPeriod] = useState<PeriodFilter>("month");
  const [overduePeriod, setOverduePeriod] = useState<OverdueFilter>("24hours");

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    if (!activeTeam) return;

    try {
      setLoading(true);

      // Fetch all dashboard data in parallel
      const [analyticsData, upcomingData, recentData] = await Promise.all([
        postsApi.getDashboardAnalytics(activeTeam.id),
        postsApi.getUpcomingPosts(activeTeam.id, 5),
        postsApi.getRecentActivity(activeTeam.id, 5),
      ]);

      setAnalytics(analyticsData);
      setUpcomingPosts(upcomingData);
      setRecentActivity(recentData);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [activeTeam]);



  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Helper function to get analytics for current period
  const getScheduledStats = () => {
    if (!analytics)
      return { total: 0, change: 0, changeType: "increase" as const };

    switch (scheduledPeriod) {
      case "year":
        return {
          total: analytics.scheduled.year.current,
          change: analytics.scheduled.year.change,
          changeType:
            analytics.scheduled.year.change >= 0
              ? ("increase" as const)
              : ("decrease" as const),
        };
      case "month":
        return {
          total: analytics.scheduled.month.current,
          change: analytics.scheduled.month.change,
          changeType:
            analytics.scheduled.month.change >= 0
              ? ("increase" as const)
              : ("decrease" as const),
        };
      case "3months":
        return {
          total: analytics.scheduled.threeMonths.current,
          change: analytics.scheduled.threeMonths.change,
          changeType:
            analytics.scheduled.threeMonths.change >= 0
              ? ("increase" as const)
              : ("decrease" as const),
        };
    }
  };

  const getOverdueStats = () => {
    if (!analytics)
      return { total: 0, change: 0, changeType: "increase" as const };

    return {
      total: analytics.overdue[overduePeriod].current,
      change: analytics.overdue[overduePeriod].change,
      changeType:
        analytics.overdue[overduePeriod].change >= 0
          ? ("increase" as const)
          : ("decrease" as const),
    };
  };

  const getPeriodLabel = (period: PeriodFilter) => {
    switch (period) {
      case "year":
        return "This Year";
      case "month":
        return "This Month";
      case "3months":
        return "Last 3 Months";
    }
  };

  // Show loading only when we have teams but are still fetching data
  if (loading && teams.length > 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="400px"
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text>Loading dashboard...</Text>
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

  // If user has no teams at all, show getting started checklist
  if (teams.length === 0) {
    return (
      <Box p={8} maxW="1000px" mx="auto">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Heading size="2xl" mb={4} color="blue.600">
              Welcome to Campaign Management! 🎉
            </Heading>
            <Text fontSize="lg" color="gray.600" mb={6}>
              Let's get you set up and ready to manage your social media campaigns like a pro.
            </Text>
          </Box>

          {/* Getting Started Checklist */}
          <Box>
            <Heading size="lg" mb={6} textAlign="center">
              Your Quick Start Guide
            </Heading>

            <VStack spacing={6} align="stretch">
               {/* Step 1: Create Team */}
               <Box
                 bg="gray.50"
                 p={6}
                 borderRadius="lg"
                 border="2px"
                 borderColor="gray.200"
                 position="relative"
               >
                <HStack spacing={4} align="start">
                  <Box
                    bg="blue.500"
                    color="white"
                    borderRadius="full"
                    w={8}
                    h={8}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="bold"
                    fontSize="sm"
                    flexShrink={0}
                  >
                    1
                  </Box>
                  <Box flex="1">
                    <Heading size="md" mb={2} color="blue.700">
                      Create Your First Team
                    </Heading>
                    <Text color="gray.700" mb={4}>
                      Teams are the foundation of your campaign management. They help you organize
                      social media accounts, content planning, and collaboration with team members.
                      Think of it as your workspace for all marketing activities.
                    </Text>
                    <VStack align="start" spacing={2} mb={4}>
                      <Text fontSize="sm" color="gray.600">
                        ✓ Organize multiple social media accounts
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        ✓ Collaborate with team members
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        ✓ Track campaign performance
                      </Text>
                    </VStack>
                    <Button
                      colorScheme="blue"
                      size="md"
                      onClick={() => setIsCreateTeamModalOpen(true)}
                    >
                      Create Your Team
                    </Button>
                  </Box>
                </HStack>
              </Box>

              {/* Step 2: Schedule Content */}
              <Box
                bg="gray.50"
                p={6}
                borderRadius="lg"
                border="2px"
                borderColor="gray.200"
                opacity={0.6}
                position="relative"
              >
                <HStack spacing={4} align="start">
                  <Box
                    bg="gray.400"
                    color="white"
                    borderRadius="full"
                    w={8}
                    h={8}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="bold"
                    fontSize="sm"
                    flexShrink={0}
                  >
                    2
                  </Box>
                  <Box flex="1">
                    <Heading size="md" mb={2} color="gray.600">
                      Schedule Your First Posts
                    </Heading>
                    <Text color="gray.600" mb={4}>
                      Once you have a team, you can start scheduling content. Choose between
                      individual posts for quick updates or comprehensive content plans for
                      strategic campaigns with multiple posts.
                    </Text>
                    <VStack align="start" spacing={2} mb={4}>
                      <Text fontSize="sm" color="gray.500">
                        • <strong>Quick Post:</strong> Schedule a single post to any connected social account
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        • <strong>Content Plan:</strong> Create a series of posts with AI assistance for campaigns
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        • <strong>Goals & Targets:</strong> Set objectives like engagement, reach, or conversions
                      </Text>
                    </VStack>
                    <Text fontSize="sm" color="gray.500" fontStyle="italic">
                      Available after creating your team
                    </Text>
                  </Box>
                </HStack>
              </Box>

              {/* Benefits Section */}
              <Box
                bg="green.50"
                p={6}
                borderRadius="lg"
                border="2px"
                borderColor="green.200"
                mt={4}
              >
                <VStack spacing={4}>
                  <Heading size="md" color="green.700" textAlign="center">
                    Why Campaign Management?
                  </Heading>
                  <Grid templateColumns={["1fr", "repeat(2, 1fr)", "repeat(3, 1fr)"]} gap={4} w="full">
                    <VStack spacing={2} textAlign="center">
                      <Text fontSize="2xl">📅</Text>
                      <Text fontWeight="medium" color="green.700">Smart Scheduling</Text>
                      <Text fontSize="sm" color="gray.600">
                        Post at optimal times automatically
                      </Text>
                    </VStack>
                    <VStack spacing={2} textAlign="center">
                      <Text fontSize="2xl">🤖</Text>
                      <Text fontWeight="medium" color="green.700">AI Content Creation</Text>
                      <Text fontSize="sm" color="gray.600">
                        Generate engaging posts with AI
                      </Text>
                    </VStack>
                    <VStack spacing={2} textAlign="center">
                      <Text fontSize="2xl">📊</Text>
                      <Text fontWeight="medium" color="green.700">Performance Tracking</Text>
                      <Text fontSize="sm" color="gray.600">
                        Monitor engagement and growth
                      </Text>
                    </VStack>
                  </Grid>
                </VStack>
              </Box>
            </VStack>
          </Box>

          {/* Help Section */}
          <Box textAlign="center" pt={4}>
            <Text fontSize="sm" color="gray.500">
              Need help getting started? Check out our{" "}
              <Text as="span" color="blue.500" cursor="pointer" _hover={{ textDecoration: "underline" }}>
                comprehensive guide
              </Text>{" "}
              or{" "}
              <Text as="span" color="blue.500" cursor="pointer" _hover={{ textDecoration: "underline" }}>
                contact support
              </Text>
            </Text>
          </Box>
        </VStack>

        <CreateTeamModal
          isOpen={isCreateTeamModalOpen}
          onClose={() => setIsCreateTeamModalOpen(false)}
          onTeamCreated={(newTeam) => {
            refreshTeams();
            // The TeamContext will automatically set this as activeTeam
          }}
        />
      </Box>
    );
  }

  if (!activeTeam) {
    return (
      <Box p={4}>
        <Alert status="info">
          <AlertIcon />
          Please select or create a team to view your dashboard.
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={6} maxW="1400px" mx="auto">
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="xl" mb={2}>
            Welcome back to {activeTeam.title}
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Here's what's happening with your content calendar
          </Text>
        </Box>

        {/* Analytics Cards */}
        <Grid
          templateColumns={["1fr", "repeat(2, 1fr)", "repeat(4, 1fr)"]}
          gap={6}
        >
          {/* Scheduled Posts */}
          <GridItem>
            <Card bg={bgColor} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel fontSize="sm" color="gray.600">
                    Scheduled Posts
                    <Select
                      size="xs"
                      ml={2}
                      w="auto"
                      value={scheduledPeriod}
                      onChange={(e) =>
                        setScheduledPeriod(e.target.value as PeriodFilter)
                      }
                    >
                      <option value="year">Year</option>
                      <option value="month">Month</option>
                      <option value="3months">3 Months</option>
                    </Select>
                  </StatLabel>
                  <StatNumber fontSize="3xl" color="blue.500">
                    {getScheduledStats().total}
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow type={getScheduledStats().changeType} />
                    {getScheduledStats().change.toFixed(1)}% from last{" "}
                    {getPeriodLabel(scheduledPeriod).toLowerCase()}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>

          {/* Total Posts */}
          <GridItem>
            <Card bg={bgColor} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel fontSize="sm" color="gray.600">
                    Total Posts
                  </StatLabel>
                  <StatNumber fontSize="3xl" color="green.500">
                    {analytics?.totalPosts || 0}
                  </StatNumber>
                  <StatHelpText>All time posts created</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>

          {/* Published Posts */}
          <GridItem>
            <Card bg={bgColor} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel fontSize="sm" color="gray.600">
                    Published Posts
                  </StatLabel>
                  <StatNumber fontSize="3xl" color="purple.500">
                    {analytics?.publishedPosts || 0}
                  </StatNumber>
                  <StatHelpText>Successfully published</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>

          {/* Overdue Posts */}
          <GridItem>
            <Card bg={bgColor} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel fontSize="sm" color="gray.600">
                    Overdue Posts
                    <Select
                      size="xs"
                      ml={2}
                      w="auto"
                      value={overduePeriod}
                      onChange={(e) =>
                        setOverduePeriod(e.target.value as OverdueFilter)
                      }
                    >
                      <option value="24hours">24h</option>
                      <option value="3days">3d</option>
                      <option value="7days">7d</option>
                    </Select>
                  </StatLabel>
                  <StatNumber fontSize="3xl" color="red.500">
                    {getOverdueStats().total}
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow type={getOverdueStats().changeType} />
                    {getOverdueStats().change.toFixed(1)}% from previous period
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Main Content Grid */}
        <Grid templateColumns={["1fr", "1fr", "repeat(2, 1fr)"]} gap={8}>
          {/* Upcoming Posts */}
          <GridItem>
            <Card bg={bgColor} border="1px" borderColor={borderColor}>
              <CardBody>
                <Flex align="center" mb={4}>
                  <Heading size="md">Upcoming Posts</Heading>
                  <Spacer />
                  <Button
                    size="sm"
                    variant="ghost"
                    rightIcon={<ChevronRightIcon />}
                    onClick={() => navigate("/calendar")}
                  >
                    View All
                  </Button>
                </Flex>

                {upcomingPosts && upcomingPosts.length > 0 ? (
                  <List spacing={3}>
                    {upcomingPosts.map((post) => (
                      <ListItem key={post.id}>
                        <Flex
                          align="center"
                          p={3}
                          bg="gray.50"
                          borderRadius="md"
                        >
                          <Avatar size="sm" name={post.creator.name} mr={3} />
                          <Box flex="1">
                            <Text
                              fontWeight="medium"
                              fontSize="sm"
                              noOfLines={1}
                            >
                              {post.title || "Untitled Post"}
                            </Text>
                            <HStack spacing={2} mt={1}>
                              <CalendarIcon w={3} h={3} color="gray.500" />
                              <Text fontSize="xs" color="gray.500">
                                {format(
                                  new Date(post.scheduledDate),
                                  "MMM d, yyyy 'at' h:mm a"
                                )}
                              </Text>
                            </HStack>
                          </Box>
                          <Badge colorScheme="blue" fontSize="xs">
                            {post.socialMedias.length} platforms
                          </Badge>
                        </Flex>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box textAlign="center" py={8}>
                    <CalendarIcon w={12} h={12} color="gray.300" mb={4} />
                    <Text color="gray.500">No upcoming posts scheduled</Text>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      mt={4}
                      onClick={() => navigate("/content-planner")}
                    >
                      Create Content Plan
                    </Button>
                  </Box>
                )}
              </CardBody>
            </Card>
          </GridItem>

          {/* Recent Activity */}
          <GridItem>
            <Card bg={bgColor} border="1px" borderColor={borderColor}>
              <CardBody>
                <Heading size="md" mb={4}>
                  Recent Activity
                </Heading>

                <VStack spacing={4} align="stretch">
                  {/* Recent posts activity */}
                  {recentActivity.map((post) => (
                    <Box key={post.id}>
                      <Flex align="center">
                        <Box
                          w={2}
                          h={2}
                          bg={
                            post.status === "Posted" ? "green.500" : "blue.500"
                          }
                          borderRadius="full"
                          mr={3}
                        />
                        <Box flex="1">
                          <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                            {post.title || "Untitled Post"}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {post.status === "Posted"
                              ? "Published"
                              : "Scheduled"}{" "}
                            • {format(new Date(post.createdAt), "MMM d")}
                          </Text>
                        </Box>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          icon={<ViewIcon />}
                          aria-label="View post"
                          onClick={() => navigate(`/calendar`)}
                        />
                      </Flex>
                      <Divider mt={3} />
                    </Box>
                  ))}

                  {(!recentActivity || recentActivity.length === 0) && (
                    <Box textAlign="center" py={8}>
                      <TimeIcon w={12} h={12} color="gray.300" mb={4} />
                      <Text color="gray.500">No recent activity</Text>
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Quick Actions */}
        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <Heading size="md" mb={4}>
              Quick Actions
            </Heading>
            <HStack spacing={4} flexWrap="wrap">
              <Button
                leftIcon={<CalendarIcon />}
                colorScheme="blue"
                onClick={() => navigate("/calendar")}
              >
                View Calendar
              </Button>
              <Button
                leftIcon={<CheckCircleIcon />}
                colorScheme="green"
                onClick={() => navigate("/content-planner")}
              >
                Create Content Plan
              </Button>
              <Button
                leftIcon={<WarningIcon />}
                colorScheme="orange"
                variant="outline"
                onClick={() => navigate("/calendar")}
              >
                Check Overdue Posts
              </Button>
            </HStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export { Dashboard };
