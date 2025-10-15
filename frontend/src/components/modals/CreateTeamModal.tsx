import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { teamsApi } from "../../services/teams";
import { SubscriptionRequiredModal } from "./SubscriptionRequiredModal";

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeamCreated: (team: any) => void;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
  onTeamCreated,
}) => {
  const [newTeamName, setNewTeamName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const toast = useToast();

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return;
    setIsCreating(true);
    try {
      const newTeam = await teamsApi.createTeam({ title: newTeamName });
      onTeamCreated(newTeam);
      setNewTeamName("");
      onClose();
      toast({
        title: "Team created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      if (
        error.response?.status === 403 &&
        error.response?.data?.message?.includes("limit exceeded")
      ) {
        onClose(); // Close the form modal
        setShowUpgradeModal(true);
      } else {
        toast({
          title: "Failed to create team",
          description: error.response?.data?.message || "An error occurred",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Team</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Team Name</FormLabel>
              <Input
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Enter team name"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreateTeam}
              isDisabled={!newTeamName.trim() || isCreating}
              isLoading={isCreating}
            >
              Create
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <SubscriptionRequiredModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </>
  );
};
