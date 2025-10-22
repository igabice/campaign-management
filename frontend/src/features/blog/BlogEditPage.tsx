import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Checkbox,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { blogService } from "../../services/blog";
import { authService } from "../../services/auth";
import { CustomImageUpload } from "../../components/CustomImageUpload";

export const BlogEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const isAdmin = await authService.checkAdminStatus();
      if (!isAdmin) {
        toast({
          title: "Access Denied",
          description:
            "You do not have permission to edit blog posts. Admin access required.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate("/blog");
        return;
      }

      if (id) {
        // Editing existing blog
        setIsEdit(true);
        try {
          const blog = await blogService.getBlog(id);
          setTitle(blog.title);
          setSlug(blog.slug);
          setTags(blog.tags.join(", "));
          setImage(blog.image || "");
          setPublished(blog.published);

          // Convert HTML content to editor state
          const blocksFromHtml = htmlToDraft(blog.content);
          const { contentBlocks, entityMap } = blocksFromHtml;
          const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
          setEditorState(EditorState.createWithContent(contentState));
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load blog post",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          navigate("/blog-management");
        }
      }

      setCheckingAdmin(false);
    };

    checkAdmin();
  }, [id, toast, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !slug.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and slug are required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      const blogData = {
        title: title.trim(),
        content,
        slug: slug.trim(),
        tags: tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        image: image || undefined,
        published,
      };

      if (isEdit && id) {
        await blogService.updateBlog(id, blogData);
        toast({
          title: "Success",
          description: "Blog post updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await blogService.createBlog(blogData);
        toast({
          title: "Success",
          description: "Blog post created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      navigate("/blog-management");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} blog post`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = () => {
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setSlug(generatedSlug);
  };

  if (checkingAdmin) {
    return (
      <Container maxW="4xl" py={8} textAlign="center">
        <Spinner size="xl" />
      </Container>
    );
  }

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="xl">{isEdit ? "Edit Blog Post" : "Create Blog Post"}</Heading>

        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog post title"
                size="lg"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Slug</FormLabel>
              <HStack>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="blog-post-slug"
                />
                <Button onClick={generateSlug} size="md">
                  Generate
                </Button>
              </HStack>
              <Text fontSize="sm" color="gray.600">
                This will be used in the URL: /blog/{slug}
              </Text>
            </FormControl>

            <FormControl>
              <FormLabel>Tags (comma-separated)</FormLabel>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="technology, web development, react"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Featured Image</FormLabel>
              <CustomImageUpload
                value={image}
                onChange={setImage}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Content</FormLabel>
              <Box border="1px" borderColor="gray.200" borderRadius="md" minH="400px">
                <Editor
                  editorState={editorState}
                  onEditorStateChange={setEditorState}
                  toolbar={{
                    options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'image', 'history'],
                    inline: { inDropdown: true },
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    link: { inDropdown: true },
                    history: { inDropdown: true },
                  }}
                  placeholder="Write your blog post content here..."
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

            <HStack spacing={4}>
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                isLoading={loading}
                loadingText={isEdit ? "Updating..." : "Creating..."}
              >
                {isEdit ? "Update Blog Post" : "Create Blog Post"}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/blog-management")}
              >
                Cancel
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};