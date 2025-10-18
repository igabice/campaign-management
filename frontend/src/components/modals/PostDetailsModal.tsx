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
  Text,
  VStack,
  HStack,
  Badge,
  Divider,
  IconButton,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { Twitter, Facebook, Linkedin, Instagram } from "lucide-react";
import { Post } from "../../types/schemas";

interface PostDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
}

export const PostDetailsModal: React.FC<PostDetailsModalProps> = ({
  isOpen,
  onClose,
  post,
}) => {
  if (!post) return null;

  const getShareUrl = (platform: string, content: string) => {
    const encodedContent = encodeURIComponent(content);
    switch (platform.toLowerCase()) {
      case "twitter":
        return `https://twitter.com/intent/tweet?text=${encodedContent}`;
      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          window.location.href
        )}&quote=${encodedContent}`;
      case "linkedin":
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          window.location.href
        )}`;
      case "instagram":
        // Instagram doesn't have a direct web share URL, so perhaps open profile or something, but for now, just alert
        return null;
      default:
        return null;
    }
  };

  const handleShare = (platform: string) => {
    let shareContent = post.content;
    if (post.image) {
      shareContent += ` ${post.image}`;
    }
    const url = getShareUrl(platform, shareContent);
    if (url) {
      window.open(url, "_blank");
    } else {
      alert(`Sharing to ${platform} is not supported via web.`);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return <Twitter size={16} />;
      case "facebook":
        return <Facebook size={16} />;
      case "linkedin":
        return <Linkedin size={16} />;
      case "instagram":
        return <Instagram size={16} />;
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Post Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            {post.title && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  {post.title}
                </Text>
                <Divider />
              </>
            )}
            <Text>{post.content}</Text>
            {post.image && (
              <img
                src={post.image}
                alt="Post image"
                style={{
                  maxWidth: "100%",
                  maxHeight: "400px",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            )}
            <HStack>
              <Text fontWeight="bold">Scheduled Date:</Text>
              <Text>{format(new Date(post.scheduledDate), "PPP p")}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Status:</Text>
              <Badge colorScheme={post.status === "Posted" ? "green" : "gray"}>
                {post.status}
              </Badge>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Send Reminder:</Text>
              <Text>{post.sendReminder ? "Yes" : "No"}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Social Media Accounts:</Text>
              <VStack align="start">
                {post.socialMedias.map((sm) => (
                  <Text key={sm.id}>
                    {sm.accountName} ({sm.platform})
                  </Text>
                ))}
              </VStack>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Created By:</Text>
              <Text>
                {post.creator.name} ({post.creator.email})
              </Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Team:</Text>
              <Text>{post.team.title}</Text>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={2} justify="space-between" w="full">
            <HStack spacing={2}>
              <Text fontSize="sm" fontWeight="bold">
                Share to:
              </Text>
              {post.socialMedias.map((sm) => {
                const icon = getPlatformIcon(sm.platform);
                return icon ? (
                  <IconButton
                    key={sm.id}
                    aria-label={`Share to ${sm.platform}`}
                    icon={icon}
                    onClick={() => handleShare(sm.platform)}
                    size="sm"
                    colorScheme="blue"
                    variant="outline"
                  />
                ) : null;
              })}
            </HStack>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
