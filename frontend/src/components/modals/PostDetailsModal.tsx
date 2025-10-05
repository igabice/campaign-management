import React from 'react';
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
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { Post } from '../../types/schemas';

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
              <img src={post.image} alt="Post image" style={{ maxWidth: '100%', height: 'auto' }} />
            )}
            <HStack>
              <Text fontWeight="bold">Scheduled Date:</Text>
              <Text>{format(new Date(post.scheduledDate), 'PPP p')}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Status:</Text>
              <Badge colorScheme={post.status === 'Posted' ? 'green' : 'gray'}>
                {post.status}
              </Badge>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Send Reminder:</Text>
              <Text>{post.sendReminder ? 'Yes' : 'No'}</Text>
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
              <Text>{post.creator.name} ({post.creator.email})</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Team:</Text>
              <Text>{post.team.title}</Text>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};