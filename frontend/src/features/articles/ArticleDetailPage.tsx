import React, { useEffect, useState } from "react";
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
  Divider,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon, EditIcon, DeleteIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { useParams, useNavigate } from "react-router-dom";
import { articlesService, Article } from "../../services/articles";

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;

      try {
        const articleData = await articlesService.getArticle(id);
        setArticle(articleData);
      } catch (error: any) {
        console.error("Error fetching article:", error);
        toast({
          title: "Error",
          description: `Failed to load article: ${error.message}`,
          status: "error",
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, toast]);

  const handleDeleteArticle = async () => {
    if (!article || !window.confirm("Are you sure you want to delete this article?")) {
      return;
    }

    try {
      await articlesService.deleteArticle(article.id);
      toast({
        title: "Success",
        description: "Article deleted successfully",
        status: "success",
        duration: 3000,
      });
      navigate("/articles");
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
      month: "long",
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

  if (!article) {
    return (
      <Container maxW="4xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading size="xl" mb={4}>
              Article Not Found
            </Heading>
            <Text color="gray.600" mb={6}>
              The article you're looking for doesn't exist or has been removed.
            </Text>
            <Button
              leftIcon={<ArrowBackIcon />}
              colorScheme="yellow"
              onClick={() => navigate("/articles")}
            >
              Back to Articles
            </Button>
          </Box>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Button
            leftIcon={<ArrowBackIcon />}
            variant="ghost"
            mb={4}
            onClick={() => navigate("/articles")}
          >
            Back to Articles
          </Button>
        </Box>

        <Card>
          <CardHeader>
            <VStack align="start" spacing={4}>
              <Heading size="xl">{article.title}</Heading>
              <HStack spacing={4}>
                <Badge colorScheme="blue" fontSize="sm">
                  {article.topic}
                </Badge>
                <Text fontSize="sm" color="gray.500">
                  {formatDate(article.createdAt)}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  By {article.user.name}
                </Text>
              </HStack>
            </VStack>
          </CardHeader>

          <CardBody>
            <VStack align="start" spacing={6}>
              {article.hook && (
                <Box>
                  <Heading size="md" mb={3} color="gray.700">
                    Hook
                  </Heading>
                  <Text fontSize="lg" color="gray.600" fontStyle="italic">
                    {article.hook}
                  </Text>
                </Box>
              )}

              <Box>
                <Heading size="md" mb={3} color="gray.700">
                  Content
                </Heading>
                <Text fontSize="md" lineHeight="1.8" whiteSpace="pre-wrap">
                  {article.body}
                </Text>
              </Box>

              {article.callToAction && (
                <Box>
                  <Heading size="md" mb={3} color="gray.700">
                    Call to Action
                  </Heading>
                  <Text fontSize="lg" color="blue.600" fontWeight="semibold">
                    {article.callToAction}
                  </Text>
                </Box>
              )}

              {article.onScreenText && (
                <Box>
                  <Heading size="md" mb={3} color="gray.700">
                    On-Screen Text
                  </Heading>
                  <Text fontSize="md" color="gray.600">
                    {article.onScreenText}
                  </Text>
                </Box>
              )}

              <Divider />

              <HStack justify="space-between" w="full">
                <Button
                  colorScheme="yellow"
                  onClick={() => navigate(`/articles/${article.id}/edit`)}
                >
                  Edit Article
                </Button>

                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<ChevronDownIcon />}
                    variant="outline"
                  />
                  <MenuList>
                    <MenuItem
                      icon={<EditIcon />}
                      onClick={() => navigate(`/articles/${article.id}/edit`)}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      icon={<DeleteIcon />}
                      color="red.500"
                      onClick={handleDeleteArticle}
                    >
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default ArticleDetailPage;