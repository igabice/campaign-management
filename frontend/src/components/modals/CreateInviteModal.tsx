import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { invitesApi } from "../../services/invites";
import { SubscriptionRequiredModal } from "./SubscriptionRequiredModal";

interface CreateInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  onCreated: () => void;
}

export const CreateInviteModal: React.FC<CreateInviteModalProps> = ({
  isOpen,
  onClose,
  teamId,
  onCreated,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{
    email: string;
  }>();
  const toast = useToast();
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);

  const onSubmit = async (data: { email: string }) => {
    try {
      await invitesApi.createInvite({
        email: data.email,
        teamId,
      });
      toast({
        title: "Invite sent successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onCreated();
      onClose();
      reset();
    } catch (error: any) {
      if (
        error.response?.status === 403 &&
        error.response?.data?.message?.includes("limit exceeded")
      ) {
        onClose(); // Close the form modal
        setShowUpgradeModal(true);
      } else {
        toast({
          title: "Failed to send invite",
          description: error.response?.data?.message || "An error occurred",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send Team Invite</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <span style={{ color: "red", fontSize: "14px" }}>
                    {errors.email.message}
                  </span>
                )}
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={handleClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
                Send Invite
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <SubscriptionRequiredModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </>
  );
};
