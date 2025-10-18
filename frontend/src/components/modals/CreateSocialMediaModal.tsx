import React from "react";
import { useForm } from "react-hook-form";
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
  Select,
  Button,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { socialMediaApi } from "../../services/socialMedia";
import { useTeam } from "../../contexts/TeamContext";
import { useAuth } from "../../features/auth/AuthContext";
import { useNavigate } from "react-router-dom";

interface CreateSocialMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface FormData {
  accountName: string;
  platform: string;
  profileLink: string;
  image: string;
}

export const CreateSocialMediaModal: React.FC<CreateSocialMediaModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const { activeTeam } = useTeam();
  const { session } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>();
  const toast = useToast();

  const onSubmit = async (data: FormData) => {
    if (!session) {
      toast({
        title: "Session expired",
        description: "Please log in again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
      return;
    }
    if (!activeTeam) return;
    try {
      await socialMediaApi.createSocialMedia({
        accountName: data.accountName,
        teamId: activeTeam.id,
        platform: data.platform,
        profileLink: data.profileLink,
        image: data.image || undefined,
      });
      reset();
      onClose();
      onCreated();
      toast({
        title: "Social media account created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to create social media account",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Social Media Account</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormControl mb={4} isInvalid={!!errors.accountName}>
              <FormLabel>Account Name</FormLabel>
              <Input
                {...register("accountName", { required: "Account name is required" })}
                placeholder="Enter account name"
              />
              <FormErrorMessage>{errors.accountName?.message}</FormErrorMessage>
            </FormControl>
            <FormControl mb={4} isInvalid={!!errors.platform}>
              <FormLabel>Platform</FormLabel>
              <Select
                {...register("platform", { required: "Platform is required" })}
                placeholder="Select platform"
              >
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
                <option value="tiktok">TikTok</option>
                <option value="linkedin">LinkedIn</option>
              </Select>
              <FormErrorMessage>{errors.platform?.message}</FormErrorMessage>
            </FormControl>
            <FormControl mb={4} isInvalid={!!errors.profileLink}>
              <FormLabel>Profile Link</FormLabel>
              <Input
                {...register("profileLink", {
                  required: "Profile link is required",
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: "Invalid URL"
                  }
                })}
                placeholder="Enter profile link"
              />
              <FormErrorMessage>{errors.profileLink?.message}</FormErrorMessage>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Image URL (optional)</FormLabel>
              <Input
                {...register("image")}
                placeholder="Enter image URL"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              type="submit"
              isLoading={isSubmitting}
            >
              Create
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};