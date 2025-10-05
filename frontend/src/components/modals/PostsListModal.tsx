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
  VStack,
  HStack,
  Text,
  Box,
  Badge,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { Post } from '../../types/schemas';

interface PostsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
  date: Date | null;
  onSelectPost: (post: Post) => void;
}

export const PostsListModal: React.FC<PostsListModalProps> = ({
  isOpen,
  onClose,
  posts,
  date,
  onSelectPost,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Posts for {date ? format(date, 'PPP') : ''}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            {posts.map((post) => (
              <Box
                key={post.id}
                p={4}
                borderWidth={1}
                borderRadius="md"
                cursor="pointer"
                onClick={() => onSelectPost(post)}
                _hover={{ bg: 'gray.50' }}
              >
                <HStack justify="space-between">
                  <VStack align="start" flex={1}>
                    {post.title && <Text fontWeight="bold">{post.title}</Text>}
                    <Text noOfLines={2}>{post.content}</Text>
                    <HStack>
                      <Text fontSize="sm" color="gray.600">
                        {format(new Date(post.scheduledDate), 'p')}
                      </Text>
                      <Badge colorScheme={post.status === 'Posted' ? 'green' : 'gray'}>
                        {post.status}
                      </Badge>
                    </HStack>
                  </VStack>
                  <Button size="sm" colorScheme="blue" onClick={(e) => { e.stopPropagation(); onSelectPost(post); }}>
                    View Details
                  </Button>
                </HStack>
              </Box>
            ))}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};