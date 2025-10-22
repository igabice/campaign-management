import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  VStack,
  HStack,
  Badge,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useTeam } from "../../contexts/TeamContext";
import { plansApi } from "../../services/plans";
import { Plan } from "../../types/schemas";
import { format } from "date-fns";

export const ContentPlannerPage = () => {
  const { activeTeam } = useTeam();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  const fetchPlans = useCallback(async () => {
    if (!activeTeam) return;
    try {
      const response = await plansApi.getAllPlans(1, 100, { teamId: activeTeam.id });
      setPlans(response.result);
    } catch (error) {
      console.error("Failed to fetch plans", error);
      toast({
        title: "Error",
        description: "Failed to load plans",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [activeTeam, toast]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleDelete = async (id: string) => {
    try {
      await plansApi.deletePlan(id);
      setPlans(plans.filter(p => p.id !== id));
      toast({
        title: "Success",
        description: "Plan deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete plan",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return <Box p={8}>Loading...</Box>;
  }

  return (
    <Box p={8}>
      <HStack justify="space-between" mb={6}>
        <Heading>Content Planner</Heading>
        <Button colorScheme="blue" onClick={() => navigate("/content-planner/create")}>
          Create Plan
        </Button>
      </HStack>

      {plans.length === 0 ? (
        <Alert status="info" borderRadius="md" bg="gray.50" borderColor="gray.200">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <AlertTitle>No content plans yet!</AlertTitle>
            <AlertDescription>
              Create your first content plan to start scheduling posts with a strategic approach.
            </AlertDescription>
            <Button
              size="sm"
              colorScheme="blue"
              mt={2}
              onClick={() => navigate("/content-planner/create")}
            >
              Create Your First Plan
            </Button>
          </VStack>
        </Alert>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Description</Th>
              <Th>Start Date</Th>
              <Th>End Date</Th>
              <Th>Tone</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {plans.map((plan) => (
              <Tr key={plan.id}>
                <Td>{plan.title}</Td>
                <Td>
                  <Text noOfLines={2}>{plan.description}</Text>
                </Td>
                <Td>{format(new Date(plan.startDate), "PPP")}</Td>
                <Td>{format(new Date(plan.endDate), "PPP")}</Td>
                <Td>
                  {plan.tone && <Badge>{plan.tone}</Badge>}
                </Td>
                <Td>
                  <HStack>
                    <Button size="sm" variant="outline" onClick={() => navigate(`/content-planner/${plan.id}`)}>
                      View
                    </Button>
                     <Button size="sm" variant="outline" onClick={() => navigate(`/content-planner/draft/${plan.id}`)}>
                       Edit
                     </Button>
                    <Button size="sm" colorScheme="red" variant="outline" onClick={() => handleDelete(plan.id)}>
                      Delete
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};