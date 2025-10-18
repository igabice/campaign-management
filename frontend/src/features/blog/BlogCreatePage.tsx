import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Checkbox,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { blogService } from "../../services/blog";
import { authService } from "../../services/auth";
import { CustomImageUpload } from "../../components/CustomImageUpload";

export const BlogCreatePage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const isAdmin = await authService.checkAdminStatus();
      if (!isAdmin) {
        toast({
          title: "Access Denied",
          description:
            "You do not have permission to create blog posts. Admin access required.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate("/blog");
      } else {
        setCheckingAdmin(false);
      }
    };
    checkAdmin();
  }, [toast, navigate]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Auto-generate slug from title
    const generatedSlug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setSlug(generatedSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!slug.trim()) {
      toast({
        title: "Error",
        description: "Slug is required",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    if (!content || content === "<p></p>") {
      toast({
        title: "Error",
        description: "Content is required",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    setLoading(true);
    try {
      await blogService.createBlog({
        title: title.trim(),
        content,
        slug: slug.trim(),
        tags: tagsArray,
        image,
        published,
      });

      toast({
        title: "Success",
        description: "Blog post created successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate("/blog");
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast({
          title: "Access Denied",
          description:
            "You do not have permission to create blog posts. Admin access required.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate("/blog");
        return;
      }
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create blog post",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingAdmin) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="400px"
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text>Loading...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="xl">Create Blog Post</Heading>

        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                value={title}
                onChange={handleTitleChange}
                placeholder="Enter blog post title"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Slug</FormLabel>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="url-friendly-slug"
              />
              <Text fontSize="sm" color="gray.500">
                This will be used in the URL: /blog/{slug}
              </Text>
            </FormControl>

            <FormControl>
              <FormLabel>Featured Image</FormLabel>
              <CustomImageUpload value={image} onChange={setImage} />
            </FormControl>

            <FormControl>
              <FormLabel>Tags</FormLabel>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="tag1, tag2, tag3"
              />
              <Text fontSize="sm" color="gray.500">
                Enter tags separated by commas
              </Text>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Content</FormLabel>
              <Box border="1px" borderColor="gray.200" borderRadius="md">
                <Editor
                  editorState={editorState}
                  onEditorStateChange={setEditorState}
                  toolbar={{
                    options: [
                      "inline",
                      "blockType",
                      "fontSize",
                      "list",
                      "textAlign",
                      "colorPicker",
                      "link",
                      "embedded",
                      "emoji",
                      "image",
                      "history",
                    ],
                    inline: {
                      options: ["bold", "italic", "underline", "strikethrough"],
                    },
                    blockType: {
                      options: [
                        "Normal",
                        "H1",
                        "H2",
                        "H3",
                        "H4",
                        "H5",
                        "H6",
                        "Blockquote",
                      ],
                    },
                    list: { options: ["unordered", "ordered"] },
                  }}
                  editorStyle={{
                    minHeight: "400px",
                    padding: "10px",
                  }}
                />
              </Box>
            </FormControl>

            <FormControl>
              <Checkbox
                isChecked={published}
                onChange={(e) => setPublished(e.target.checked)}
              >
                Publish immediately
              </Checkbox>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              isLoading={loading}
              loadingText="Creating..."
            >
              Create Blog Post
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};
