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
  Button,
  HStack,
  Spinner,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useParams, useNavigate } from "react-router-dom";
import { articlesService, Article, UpdateArticleInput } from "../../services/articles";

const ArticleEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UpdateArticleInput>({
    title: "",
    body: "",
    hook: "",
    callToAction: "",
    onScreenText: "",
    topic: "",
  });

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;

      try {
        const articleData = await articlesService.getArticle(id);
        setArticle(articleData);
        setFormData({
          title: articleData.title,
          body: articleData.body,
          hook: articleData.hook || "",
          callToAction: articleData.callToAction || "",
          onScreenText: articleData.onScreenText || "",
          topic: articleData.topic,
        });
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article) return;

    setSaving(true);
    try {
      await articlesService.updateArticle(article.id, formData);
      toast({
        title: "Success",
        description: "Article updated successfully",
        status: "success",
        duration: 3000,
      });
      navigate(`/articles/${article.id}`);
    } catch (error: any) {
      console.error("Error updating article:", error);
      toast({
        title: "Error",
        description: `Failed to update article: ${error.message}`,
        status: "error",
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
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
            onClick={() => navigate(`/articles/${article.id}`)}
          >
            Back to Article
          </Button>
          <Heading size="xl">Edit Article</Heading>
        </Box>

        <Card>
          <CardHeader>
            <Text color="gray.600">
              Update the article details below. All fields are optional except title and topic.
            </Text>
          </CardHeader>

          <CardBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter article title"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Topic</FormLabel>
                  <Input
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    placeholder="Enter article topic"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Hook</FormLabel>
                  <Textarea
                    name="hook"
                    value={formData.hook}
                    onChange={handleInputChange}
                    placeholder="Enter article hook (optional)"
                    rows={3}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Content</FormLabel>
                  <Textarea
                    name="body"
                    value={formData.body}
                    onChange={handleInputChange}
                    placeholder="Enter article content"
                    rows={10}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Call to Action</FormLabel>
                  <Input
                    name="callToAction"
                    value={formData.callToAction}
                    onChange={handleInputChange}
                    placeholder="Enter call to action (optional)"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>On-Screen Text</FormLabel>
                  <Textarea
                    name="onScreenText"
                    value={formData.onScreenText}
                    onChange={handleInputChange}
                    placeholder="Enter on-screen text (optional)"
                    rows={3}
                  />
                </FormControl>

                <HStack spacing={4} justify="end">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/articles/${article.id}`)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="yellow"
                    isLoading={saving}
                    loadingText="Saving..."
                  >
                    Save Changes
                  </Button>
                </HStack>
              </VStack>
            </form>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default ArticleEditPage;