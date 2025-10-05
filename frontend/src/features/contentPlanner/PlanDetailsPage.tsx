import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  IconButton,
  useToast,
  Spinner,
  Grid,
  GridItem,
  Avatar,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { plansApi } from "../../services/plans";
import { format } from "date-fns";
import { EditIcon, DeleteIcon, CalendarIcon } from "@chakra-ui/icons";
import { Plan } from "../../types/schemas";

export const PlanDetailsPage = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPlanDetails = useCallback(async () => {
    try {
      const response = await plansApi.getPlanById(planId!);
      setPlan(response);
    } catch (error: any) {
      toast({
        title: "Failed to load plan details",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate("/content-planner");
    } finally {
      setIsLoading(false);
    }
  }, [planId, toast, navigate]);

  useEffect(() => {
    if (planId) {
      fetchPlanDetails();
    }
  }, [planId, fetchPlanDetails]);

  const handleDelete = async () => {
    if (!plan) return;

    if (!window.confirm(`Are you sure you want to delete the plan "${plan.title}"? This will also delete all associated posts.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await plansApi.deletePlan(plan.id);
      toast({
        title: "Plan deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/content-planner");
    } catch (error: any) {
      toast({
        title: "Failed to delete plan",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return "gray";
      case "posted":
        return "green";
      default:
        return "gray";
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text>Loading plan details...</Text>
        </VStack>
      </Box>
    );
  }

  if (!plan) {
    return (
      <Box textAlign="center" py={8}>
        <Text fontSize="lg">Plan not found</Text>
        <Button mt={4} onClick={() => navigate("/content-planner")}>
          Back to Content Planner
        </Button>
      </Box>
    );
  }

  return (
    <Box p={8} maxW="6xl" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* Plan Header */}
        <Card>
          <CardHeader>
            <HStack justify="space-between" align="start">
              <VStack align="start" spacing={2}>
                <Heading size="lg">{plan.title}</Heading>
                {plan.description && (
                  <Text color="gray.600">{plan.description}</Text>
                )}
                <HStack spacing={4}>
                  <Text fontSize="sm" color="gray.500">
                    Created by {plan.creator.name} on {format(new Date(plan.createdAt), 'MMM d, yyyy')}
                  </Text>
                  {plan.tone && (
                    <Badge colorScheme="purple">{plan.tone}</Badge>
                  )}
                </HStack>
              </VStack>
              <HStack>
                <IconButton
                  aria-label="Edit plan"
                  icon={<EditIcon />}
                  variant="outline"
                  onClick={() => {
                    // TODO: Implement edit functionality
                    toast({
                      title: "Edit functionality coming soon",
                      status: "info",
                      duration: 2000,
                      isClosable: true,
                    });
                  }}
                />
                <IconButton
                  aria-label="Delete plan"
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  variant="outline"
                  onClick={handleDelete}
                  isLoading={isDeleting}
                />
              </HStack>
            </HStack>
          </CardHeader>
        </Card>

        {/* Plan Dates */}
        <Card>
          <CardBody>
            <HStack spacing={8}>
              <VStack align="start">
                <Text fontWeight="bold" fontSize="sm" color="gray.600">
                  START DATE
                </Text>
                <HStack>
                  <CalendarIcon color="green.500" />
                  <Text>{format(new Date(plan.startDate), 'MMMM d, yyyy')}</Text>
                </HStack>
              </VStack>
              <VStack align="start">
                <Text fontWeight="bold" fontSize="sm" color="gray.600">
                  END DATE
                </Text>
                <HStack>
                  <CalendarIcon color="red.500" />
                  <Text>{format(new Date(plan.endDate), 'MMMM d, yyyy')}</Text>
                </HStack>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        {/* Posts Section */}
        <Card>
          <CardHeader>
            <HStack justify="space-between">
              <Heading size="md">Generated Posts ({plan.posts.length})</Heading>
              <Button
                colorScheme="blue"
                size="sm"
                onClick={() => navigate("/calendar")}
              >
                View in Calendar
              </Button>
            </HStack>
          </CardHeader>
          <CardBody>
            {plan.posts.length === 0 ? (
              <Text color="gray.500" textAlign="center" py={8}>
                No posts have been generated for this plan yet.
              </Text>
            ) : (
              <VStack spacing={4} align="stretch">
                {plan.posts.map((post, index) => (
                  <Card key={post.id} size="sm">
                    <CardBody>
                      <Grid templateColumns="1fr auto" gap={4}>
                        <GridItem>
                          <VStack align="start" spacing={2}>
                            <HStack>
                              <Text fontWeight="bold">
                                Post {index + 1}
                                {post.title && `: ${post.title}`}
                              </Text>
                              <Badge colorScheme={getStatusColor(post.status)}>
                                {post.status}
                              </Badge>
                            </HStack>

                            <Text fontSize="sm" color="gray.600" noOfLines={2}>
                              {post.content}
                            </Text>

                            <HStack spacing={4}>
                              <Text fontSize="xs" color="gray.500">
                                Scheduled: {format(new Date(post.scheduledDate), 'MMM d, yyyy @ h:mm a')}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                By: {post.creator.name}
                              </Text>
                            </HStack>
                          </VStack>
                        </GridItem>

                        <GridItem>
                          <VStack align="end" spacing={2}>
                            <Wrap spacing={1}>
                              {post.socialMedias.map((sm) => (
                                <WrapItem key={sm.id}>
                                  <Badge variant="outline" fontSize="xs">
                                    {sm.platform}
                                  </Badge>
                                </WrapItem>
                              ))}
                            </Wrap>
                            {post.image && (
                              <Avatar
                                size="sm"
                                src={post.image}
                                name="Post image"
                                cursor="pointer"
                                onClick={() => window.open(post.image, '_blank')}
                              />
                            )}
                          </VStack>
                        </GridItem>
                      </Grid>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            )}
          </CardBody>
        </Card>

        {/* Back Button */}
        <Box textAlign="center">
          <Button onClick={() => navigate("/content-planner")}>
            Back to Content Planner
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};