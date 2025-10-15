import React, { useState, useEffect, useCallback } from "react";
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
  Textarea,
  Checkbox,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CustomImageUpload } from "../../components/CustomImageUpload";
import { postsApi } from "../../services/posts";
import { socialMediaApi } from "../../services/socialMedia";
import { Team } from "../../types/commons";
import { Post } from "../../types/schemas";

const createPostSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  socialMedias: z
    .array(z.string().uuid("Invalid social media ID"))
    .min(1, "At least one social media account is required"),
  image: z.string().optional(),
  scheduledDate: z.string().min(1, "Scheduled date is required"),
  sendReminder: z.boolean(),
  teamId: z.string().uuid("Invalid team ID"),
});

type CreatePostFormData = z.infer<typeof createPostSchema>;

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTeam: Team | null;
  onPostCreated: () => void;
  post?: Post | null;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  activeTeam,
  onPostCreated,
  post,
}) => {
  const isEdit = !!post;
  const [socialMedias, setSocialMedias] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      sendReminder: false,
      socialMedias: [],
    },
  });

  const watchedSocialMedias = watch("socialMedias");

  const fetchSocialMedias = useCallback(async () => {
    if (!activeTeam) return;
    try {
      const response = await socialMediaApi.getAllSocialMedia(1, 100, {
        teamId: activeTeam.id,
        status: "active",
      });
      setSocialMedias(response.result);
    } catch (error) {
      console.error("Failed to fetch social medias", error);
    }
  }, [activeTeam]);

  useEffect(() => {
    if (isOpen && activeTeam) {
      fetchSocialMedias();
      setValue("teamId", activeTeam.id);
      if (isEdit && post) {
        setValue("title", post.title || "");
        setValue("content", post.content);
        setValue("image", post.image || "");
        setValue("scheduledDate", new Date(post.scheduledDate).toISOString().slice(0, 16));
        setValue("sendReminder", post.sendReminder || false);
        setValue("socialMedias", post.socialMedias.map(sm => sm.id));
      } else {
        reset();
      }
    }
  }, [isOpen, activeTeam, setValue, fetchSocialMedias, isEdit, post, reset]);

  const onSubmit = async (data: CreatePostFormData) => {
    setIsLoading(true);
    try {
      const postData = {
        ...data,
        scheduledDate:
          data.scheduledDate.includes(":") &&
          data.scheduledDate.split(":").length === 2
            ? data.scheduledDate + ":00"
            : data.scheduledDate,
      };
      if (isEdit && post) {
        await postsApi.updatePost(post.id, postData);
        toast({
          title: "Post updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await postsApi.createPost(postData);
        toast({
          title: "Post created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      onPostCreated();
      onClose();
      reset();
    } catch (error: any) {
      toast({
        title: `Failed to ${isEdit ? 'update' : 'create'} post`,
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialMediaChange = (id: string, checked: boolean) => {
    const current = watchedSocialMedias || [];
    if (checked) {
      setValue("socialMedias", [...current, id]);
    } else {
      setValue(
        "socialMedias",
        current.filter((sm) => sm !== id)
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEdit ? 'Edit Post' : 'Create New Post'}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isInvalid={!!errors.title}>
                <FormLabel>Title (Optional)</FormLabel>
                <Input {...register("title")} placeholder="Post title" />
              </FormControl>

              <FormControl isInvalid={!!errors.content}>
                <FormLabel>Content</FormLabel>
                <Textarea {...register("content")} placeholder="Post content" />
                {errors.content && (
                  <Text color="red.500">{errors.content.message}</Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.socialMedias}>
                <FormLabel>Social Media Accounts</FormLabel>
                <VStack align="start" spacing={2}>
                  {socialMedias.map((sm) => (
                    <Checkbox
                      key={sm.id}
                      isChecked={watchedSocialMedias?.includes(sm.id)}
                      onChange={(e) =>
                        handleSocialMediaChange(sm.id, e.target.checked)
                      }
                    >
                      {sm.accountName} ({sm.platform})
                    </Checkbox>
                  ))}
                </VStack>
                {errors.socialMedias && (
                  <Text color="red.500">{errors.socialMedias.message}</Text>
                )}
              </FormControl>

               <FormControl isInvalid={!!errors.image}>
                 <FormLabel>Image (Optional)</FormLabel>
                 <CustomImageUpload
                   value={watch("image") || ""}
                   onChange={(value) => setValue("image", value)}
                 />
               </FormControl>

              <FormControl isInvalid={!!errors.scheduledDate}>
                <FormLabel>Scheduled Date</FormLabel>
                <Input {...register("scheduledDate")} type="datetime-local" />
                {errors.scheduledDate && (
                  <Text color="red.500">{errors.scheduledDate.message}</Text>
                )}
              </FormControl>

              <FormControl>
                <Checkbox {...register("sendReminder")}>Send reminder</Checkbox>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
             <Button colorScheme="blue" type="submit" isLoading={isLoading}>
               {isEdit ? 'Update Post' : 'Create Post'}
             </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
