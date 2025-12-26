import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Button,
  HStack,
  Spinner,
  useToast,
  Grid,
  Divider,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { articlesService, Article } from "../../services/articles";
import { useNavigate } from "react-router-dom";

const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const loadArticles = useCallback(async (pageNum = 1, append = false) => {
    try {
      const response = await articlesService.getArticles(pageNum, 12);
      if (append) {
        setArticles(prev => [...prev, ...response.results]);
      } else {
        setArticles(response.results);
      }
      setHasMore(response.page < response.totalPages);
      setPage(pageNum);
    } catch (error: any) {
      console.error("Error loading articles:", error);
      toast({
        title: "Error",
        description: `Failed to load articles: ${error.message}`,
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const handleDeleteArticle = async (articleId: string) => {
    if (!window.confirm("Are you sure you want to delete this article?")) {
      return;
    }

    try {
      await articlesService.deleteArticle(articleId);
      setArticles(prev => prev.filter(article => article.id !== articleId));
      toast({
        title: "Success",
        description: "Article deleted successfully",
        status: "success",
        duration: 3000,
      });
    } catch (error: any) {
      console.error("Error deleting article:", error);
      toast({
        title: "Error",
        description: `Failed to delete article: ${error.message}`,
        status: "error",
        duration: 5000,
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="400px"
      >
        <Spinner size="xl" color="yellow.500" />
      </Box>
    );
  }

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="xl" mb={2}>
            Generated Articles
          </Heading>
          <Text color="gray.600">
            AI-generated articles based on your topics and preferences
          </Text>
        </Box>

        {articles.length === 0 ? (
          <Box textAlign="center" py={20}>
            <Text fontSize="lg" color="gray.500">
              No articles generated yet. Articles will be automatically generated based on your topics.
            </Text>
          </Box>
        ) : (
          <>
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              }}
              gap={6}
            >
              {articles.map((article) => (
                <Card key={article.id} variant="outline" _hover={{ shadow: "md" }}>
                  <CardHeader pb={2}>
                    <VStack align="start" spacing={2}>
                      <Heading size="md" noOfLines={2}>
                        {article.title}
                      </Heading>
                      <HStack>
                        <Badge colorScheme="blue" fontSize="xs">
                          {article.topic}
                        </Badge>
                        <Text fontSize="sm" color="gray.500">
                          {formatDate(article.createdAt)}
                        </Text>
                      </HStack>
                    </VStack>
                  </CardHeader>
                  <CardBody pt={0}>
                    <VStack align="start" spacing={3}>
                      {article.hook && (
                        <Box>
                          <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={1}>
                            Hook:
                          </Text>
                          <Text fontSize="sm" color="gray.600" noOfLines={2}>
                            {article.hook}
                          </Text>
                        </Box>
                      )}

                      <Box>
                        <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={1}>
                          Content:
                        </Text>
                        <Text fontSize="sm" color="gray.600" noOfLines={3}>
                          {article.body}
                        </Text>
                      </Box>

                      {article.callToAction && (
                        <Box>
                          <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={1}>
                            Call to Action:
                          </Text>
                          <Text fontSize="sm" color="blue.600" fontWeight="medium">
                            {article.callToAction}
                          </Text>
                        </Box>
                      )}

                      <Divider />

                      <HStack justify="space-between" w="full">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/articles/${article.id}`)}
                        >
                          Read More
                        </Button>

                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<ChevronDownIcon />}
                            variant="ghost"
                            size="sm"
                          />
                          <MenuList>
                            <MenuItem icon={<EditIcon />} onClick={() => navigate(`/articles/${article.id}/edit`)}>
                              Edit
                            </MenuItem>
                            <MenuItem
                              icon={<DeleteIcon />}
                              color="red.500"
                              onClick={() => handleDeleteArticle(article.id)}
                            >
                              Delete
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </Grid>

            {hasMore && (
              <Box textAlign="center">
                <Button
                  colorScheme="yellow"
                  onClick={() => loadArticles(page + 1, true)}
                >
                  Load More Articles
                </Button>
              </Box>
            )}
          </>
        )}
      </VStack>
    </Container>
  );
};

export default ArticlesPage;