import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  VStack,
  HStack,
  Badge,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { format } from "date-fns";
import { blogService } from "../../services/blog";
import { Blog } from "../../types/schemas";

export const BlogManagementPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteBlogId, setDeleteBlogId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const fetchBlogs = useCallback(async () => {
    try {
      // Get all blogs (both published and unpublished)
      const response = await blogService.getBlogs();
      setBlogs(response.result);
    } catch (error) {
      console.error("Failed to fetch blogs", error);
      toast({
        title: "Error",
        description: "Failed to load blogs",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async () => {
    if (!deleteBlogId) return;

    try {
      await blogService.deleteBlog(deleteBlogId);
      setBlogs(blogs.filter(blog => blog.id !== deleteBlogId));
      toast({
        title: "Success",
        description: "Blog deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDeleteBlogId(null);
      onClose();
    }
  };

  const openDeleteDialog = (blogId: string) => {
    setDeleteBlogId(blogId);
    onOpen();
  };

  if (loading) {
    return <Box p={8}>Loading...</Box>;
  }

  return (
    <Box p={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading>Blog Management</Heading>
          <Button as={RouterLink} to="/blog/create" colorScheme="blue">
            Create Blog Post
          </Button>
        </HStack>

        {blogs.length === 0 ? (
          <Text textAlign="center" color="gray.500">
            No blog posts found.
          </Text>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Status</Th>
                <Th>Author</Th>
                <Th>Created</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {blogs.map((blog) => (
                <Tr key={blog.id}>
                  <Td>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="medium">{blog.title}</Text>
                      {blog.tags && blog.tags.length > 0 && (
                        <HStack spacing={1}>
                          {blog.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} size="sm" colorScheme="blue" variant="subtle">
                              {tag}
                            </Badge>
                          ))}
                          {blog.tags.length > 3 && (
                            <Badge size="sm" variant="outline">
                              +{blog.tags.length - 3}
                            </Badge>
                          )}
                        </HStack>
                      )}
                    </VStack>
                  </Td>
                  <Td>
                    <Badge colorScheme={blog.published ? "green" : "gray"}>
                      {blog.published ? "Published" : "Draft"}
                    </Badge>
                  </Td>
                  <Td>{blog.creator.name}</Td>
                  <Td>{format(new Date(blog.createdAt), "MMM d, yyyy")}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        variant="outline"
                        as={RouterLink}
                        to={`/blog/${blog.slug}`}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        as={RouterLink}
                        to={`/blog/edit/${blog.id}`}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        onClick={() => openDeleteDialog(blog.id)}
                      >
                        Delete
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </VStack>

      <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Blog Post
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};