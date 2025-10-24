import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Badge,
  HStack,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Divider,
} from "@chakra-ui/react";
import { CheckCircleIcon, CloseIcon } from "@chakra-ui/icons";
import { postsApi } from "../services/posts";
import { plansApi } from "../services/plans";

interface ApprovalItem {
  id: string;
  type: "post" | "plan";
  title: string;
  content?: string;
  description?: string;
  creator: {
    name: string | null;
    email: string;
  };
  team: {
    title: string;
  };
  createdAt: string;
}

export const ApprovalCenter: React.FC = () => {
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      // Fetch posts and plans that need approval
      const [postsResponse, plansResponse] = await Promise.all([
        postsApi.getPosts(1, 100, { approvalStatus: "pending" }),
        plansApi.getAllPlans(1, 100, { approvalStatus: "pending" }),
      ]);

      const posts = postsResponse.result || [];
      const plans = plansResponse.result || [];

      // Filter to only show items where current user is the approver
      const approvalItems: ApprovalItem[] = [
        ...posts.map((post: any) => ({
          id: post.id,
          type: "post" as const,
          title: post.title || "Untitled Post",
          content: post.content,
          creator: post.creator,
          team: post.team,
          createdAt: post.createdAt,
        })),
        ...plans.map((plan: any) => ({
          id: plan.id,
          type: "plan" as const,
          title: plan.title,
          description: plan.description,
          creator: plan.creator,
          team: plan.team,
          createdAt: plan.createdAt,
        })),
      ];

      setPendingApprovals(approvalItems);
    } catch (err) {
      setError("Failed to load pending approvals");
      console.error("Error fetching approvals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (item: ApprovalItem) => {
    setActionLoading(true);
    try {
      if (item.type === "post") {
        await postsApi.approveOrRejectPost(item.id, { action: "approve", notes: approvalNotes });
      } else {
        await plansApi.approveOrRejectPlan(item.id, { action: "approve", notes: approvalNotes });
      }

      toast({
        title: "Approved",
        description: `${item.type === "post" ? "Post" : "Content plan"} has been approved`,
        status: "success",
        duration: 3000,
      });

      onClose();
      fetchPendingApprovals();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve",
        status: "error",
        duration: 3000,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (item: ApprovalItem) => {
    if (!approvalNotes.trim()) {
      toast({
        title: "Notes required",
        description: "Please provide notes explaining the rejection",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    setActionLoading(true);
    try {
      if (item.type === "post") {
        await postsApi.approveOrRejectPost(item.id, { action: "reject", notes: approvalNotes });
      } else {
        await plansApi.approveOrRejectPlan(item.id, { action: "reject", notes: approvalNotes });
      }

      toast({
        title: "Rejected",
        description: `${item.type === "post" ? "Post" : "Content plan"} has been rejected`,
        status: "info",
        duration: 3000,
      });

      onClose();
      fetchPendingApprovals();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject",
        status: "error",
        duration: 3000,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const openApprovalModal = (item: ApprovalItem) => {
    setSelectedItem(item);
    setApprovalNotes("");
    onOpen();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading pending approvals...</Text>
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

  return (
    <Box p={6} maxW="1000px" mx="auto">
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Approval Center</Heading>
          <Text color="gray.600">
            Review and approve content that requires your approval
          </Text>
        </Box>

        {pendingApprovals.length === 0 ? (
          <Box textAlign="center" py={12}>
            <CheckCircleIcon w={12} h={12} color="green.400" mb={4} />
            <Text fontSize="lg" color="gray.600">
              No pending approvals
            </Text>
            <Text color="gray.500">
              All content has been reviewed or no items require your approval
            </Text>
          </Box>
        ) : (
          <VStack spacing={4} align="stretch">
            {pendingApprovals.map((item) => (
              <Card key={item.id} borderWidth={1}>
                <CardHeader>
                  <HStack justify="space-between" align="start">
                    <Box>
                      <HStack spacing={2} mb={1}>
                        <Badge colorScheme={item.type === "post" ? "blue" : "purple"}>
                          {item.type === "post" ? "Post" : "Content Plan"}
                        </Badge>
                        <Text fontSize="sm" color="gray.500">
                          {item.team.title}
                        </Text>
                      </HStack>
                      <Heading size="md">{item.title}</Heading>
                      <Text fontSize="sm" color="gray.600">
                        Created by {item.creator.name || item.creator.email} •{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Text>
                    </Box>
                  </HStack>
                </CardHeader>

                <CardBody>
                  {item.type === "post" ? (
                    <Box>
                      <Text fontSize="sm" color="gray.700" noOfLines={3}>
                        {item.content}
                      </Text>
                    </Box>
                  ) : (
                    <Box>
                      {item.description && (
                        <Text fontSize="sm" color="gray.700" noOfLines={2}>
                          {item.description}
                        </Text>
                      )}
                    </Box>
                  )}
                </CardBody>

                <CardFooter>
                  <HStack spacing={3}>
                    <Button
                      colorScheme="green"
                      size="sm"
                      onClick={() => openApprovalModal(item)}
                    >
                      Review & Approve
                    </Button>
                  </HStack>
                </CardFooter>
              </Card>
            ))}
          </VStack>
        )}
      </VStack>

      {/* Approval Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Review {selectedItem?.type === "post" ? "Post" : "Content Plan"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedItem && (
              <VStack spacing={4} align="stretch">
                <Box>
                  <Heading size="md" mb={2}>{selectedItem.title}</Heading>
                  <HStack spacing={4} mb={4}>
                    <Text fontSize="sm" color="gray.600">
                      Created by: {selectedItem.creator.name || selectedItem.creator.email}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Team: {selectedItem.team.title}
                    </Text>
                  </HStack>
                </Box>

                <Divider />

                {selectedItem.type === "post" ? (
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" mb={2}>Content:</Text>
                    <Text fontSize="sm" whiteSpace="pre-wrap" p={3} bg="gray.50" borderRadius="md">
                      {selectedItem.content}
                    </Text>
                  </Box>
                ) : (
                  <Box>
                    {selectedItem.description && (
                      <>
                        <Text fontSize="sm" fontWeight="semibold" mb={2}>Description:</Text>
                        <Text fontSize="sm" p={3} bg="gray.50" borderRadius="md">
                          {selectedItem.description}
                        </Text>
                      </>
                    )}
                  </Box>
                )}

                <Box>
                  <Text fontSize="sm" fontWeight="semibold" mb={2}>
                    Approval Notes (Optional):
                  </Text>
                  <Textarea
                    placeholder="Add any notes or feedback..."
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    size="sm"
                  />
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button
                variant="outline"
                colorScheme="red"
                onClick={() => selectedItem && handleReject(selectedItem)}
                isLoading={actionLoading}
                leftIcon={<CloseIcon />}
              >
                Reject
              </Button>
              <Button
                colorScheme="green"
                onClick={() => selectedItem && handleApprove(selectedItem)}
                isLoading={actionLoading}
                leftIcon={<CheckCircleIcon />}
              >
                Approve
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};