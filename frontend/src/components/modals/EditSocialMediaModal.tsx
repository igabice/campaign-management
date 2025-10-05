import React, { useEffect } from "react";
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

interface SocialMedia {
  id: string;
  accountName: string;
  platform: string;
  profileLink: string;
  image?: string;
  status: string;
}

interface EditSocialMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  socialMedia: SocialMedia | null;
  onUpdated: () => void;
}

interface FormData {
  accountName: string;
  platform: string;
  profileLink: string;
  image: string;
}

export const EditSocialMediaModal: React.FC<EditSocialMediaModalProps> = ({
  isOpen,
  onClose,
  socialMedia,
  onUpdated,
}) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>();
  const toast = useToast();

  useEffect(() => {
    if (socialMedia) {
      reset({
        accountName: socialMedia.accountName,
        platform: socialMedia.platform,
        profileLink: socialMedia.profileLink,
        image: socialMedia.image || "",
      });
    }
  }, [socialMedia, reset]);

  const onSubmit = async (data: FormData) => {
    if (!socialMedia) return;
    try {
      await socialMediaApi.updateSocialMedia(socialMedia.id, {
        accountName: data.accountName,
        platform: data.platform,
        profileLink: data.profileLink,
        image: data.image || undefined,
      });
      onClose();
      onUpdated();
      toast({
        title: "Social media account updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to update social media account",
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
        <ModalHeader>Edit Social Media Account</ModalHeader>
        <ModalCloseButton />
        <ModalBody as="form" id="edit-social-media-form" onSubmit={handleSubmit(onSubmit)}>
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
            form="edit-social-media-form"
            isLoading={isSubmitting}
          >
            Update
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};