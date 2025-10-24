import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Select,
  Text,
  VStack,
  HStack,
  Badge,
  Box,
  useToast,
} from "@chakra-ui/react";
import { postsApi } from "../../services/posts";
import { plansApi } from "../../services/plans";
import { teamsApi } from "../../services/teams";
import { useTeam } from "../../contexts/TeamContext";

interface AssignApproverModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    type: "post" | "plan";
    title: string;
    creator: { name: string | null; email: string };
  } | null;
  onAssigned?: () => void;
}

export const AssignApproverModal: React.FC<AssignApproverModalProps> = ({
  isOpen,
  onClose,
  item,
  onAssigned,
}) => {
  const { activeTeam } = useTeam();
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [selectedApprover, setSelectedApprover] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen && activeTeam) {
      fetchTeamMembers();
    }
  }, [isOpen, activeTeam]);

  const fetchTeamMembers = async () => {
    if (!activeTeam) return;
    try {
      const members = await teamsApi.getTeamMembers(activeTeam.id);
      setTeamMembers(members.filter((member) => member.status === "active"));
    } catch (error) {
      console.error("Failed to fetch team members", error);
    }
  };

  const handleAssign = async () => {
    if (!item || !selectedApprover) return;

    setLoading(true);
    try {
      if (item.type === "post") {
        await postsApi.assignApprover(item.id, { approverId: selectedApprover });
      } else {
        await plansApi.assignApprover(item.id, { approverId: selectedApprover });
      }

      toast({
        title: "Approver assigned",
        description: `${item.type === "post" ? "Post" : "Content plan"} has been sent for approval`,
        status: "success",
        duration: 3000,
      });

      onAssigned?.();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to assign approver",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedApprover("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Assign Approver for {item?.type === "post" ? "Post" : "Content Plan"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {item && (
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontWeight="semibold" mb={2}>
                  {item.title}
                </Text>
                <HStack spacing={4}>
                  <Text fontSize="sm" color="gray.600">
                    Created by: {item.creator.name || item.creator.email}
                  </Text>
                  <Badge colorScheme={item.type === "post" ? "blue" : "purple"}>
                    {item.type === "post" ? "Post" : "Content Plan"}
                  </Badge>
                </HStack>
              </Box>

              <FormControl>
                <FormLabel>Select Approver</FormLabel>
                <Select
                  value={selectedApprover}
                  onChange={(e) => setSelectedApprover(e.target.value)}
                  placeholder="Choose a team member to approve this content"
                >
                  {teamMembers.map((member) => (
                    <option key={member.user.id} value={member.user.id}>
                      {member.user.name || member.user.email}
                    </option>
                  ))}
                </Select>
                <Text fontSize="sm" color="gray.600" mt={2}>
                  The selected person will receive a notification and can approve or reject this content.
                </Text>
              </FormControl>
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleAssign}
              isLoading={loading}
              isDisabled={!selectedApprover}
            >
              Assign Approver
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};