import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Card,
  CardBody,
  Badge,
  Spinner,
  useToast,
  Link,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useCallback } from "react";
import { format } from "date-fns";
import { blogService } from "../../services/blog";
import { Blog } from "../../types/schemas";

export const BlogListPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchBlogs = useCallback(async () => {
    try {
      const response = await blogService.getBlogs({ published: true });
      setBlogs(response.result);
    } catch (error) {
      console.log({
        title: "Error",
        description: "Failed to load blogs",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="xl">Blog</Heading>
        </HStack>

        {blogs.length === 0 ? (
          <Text textAlign="center" color="gray.500">
            No blog posts published yet.
          </Text>
        ) : (
          <VStack spacing={6} align="stretch">
            {blogs.map((blog) => (
              <Card key={blog.id} _hover={{ shadow: "md" }}>
                <CardBody>
                  <VStack align="start" spacing={3}>
                    {blog.image && (
                      <Box>
                        <img
                          src={blog.image}
                          alt={blog.title}
                          style={{
                            width: "100%",
                            maxHeight: "200px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      </Box>
                    )}
                    <HStack>
                      <Heading size="md">
                        <Link
                          as={RouterLink}
                          to={`/blog/${blog.slug}`}
                          _hover={{ color: "blue.500" }}
                        >
                          {blog.title}
                        </Link>
                      </Heading>
                      {blog.published && (
                        <Badge colorScheme="green">Published</Badge>
                      )}
                    </HStack>
                    {blog.tags && blog.tags.length > 0 && (
                      <HStack spacing={2} flexWrap="wrap">
                        {blog.tags.map((tag) => (
                          <Badge key={tag} colorScheme="blue" variant="subtle">
                            {tag}
                          </Badge>
                        ))}
                      </HStack>
                    )}
                    <Text color="gray.600" noOfLines={3}>
                      {blog.content.replace(/<[^>]*>/g, "").substring(0, 200)}
                      ...
                    </Text>
                    <HStack spacing={4} color="gray.500" fontSize="sm">
                      <Text>By {blog.creator.name}</Text>
                      <Text>{format(new Date(blog.createdAt), "PPP")}</Text>
                    </HStack>
                    <HStack spacing={2} mt={2}>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        as={RouterLink}
                        to={`/blog/edit/${blog.id}`}
                      >
                        Edit
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        )}
      </VStack>
    </Container>
  );
};
