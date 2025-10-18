import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Spinner,
  useToast,
  Badge,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { format } from 'date-fns';
import { blogService } from '../../services/blog';
import { Blog } from '../../types/schemas';

import { authService } from '../../services/auth';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();


  const fetchBlog = useCallback(async () => {
    if (!slug) return;

    try {
      const data = await blogService.getBlogBySlug(slug);
      setBlog(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Blog post not found',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  }, [slug, toast, navigate]);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
    checkAdminStatus();
  }, [slug, fetchBlog]);

  const checkAdminStatus = async () => {
    const adminStatus = await authService.checkAdminStatus();
    setIsAdmin(adminStatus);
  };

  const handlePublishToggle = async () => {
    if (!blog) return;

    try {
      await blogService.updateBlog(blog.id, { published: !blog.published });
      setBlog({ ...blog, published: !blog.published });
      toast({
        title: 'Success',
        description: `Blog post ${!blog.published ? 'published' : 'unpublished'}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update blog post',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    if (!blog) return;

    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      await blogService.deleteBlog(blog.id);
      toast({
        title: 'Success',
        description: 'Blog post deleted',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/blog');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete blog post',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!blog) {
    return (
      <Container maxW="4xl" py={8}>
        <Text textAlign="center">Blog post not found.</Text>
      </Container>
    );
  }

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={6} align="stretch">
           <VStack align="start" spacing={4}>
             {blog.image && (
               <Box>
                 <img src={blog.image} alt={blog.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }} />
               </Box>
             )}
             <Heading size="xl">{blog.title}</Heading>
             <HStack spacing={4}>
               <Text color="gray.600">By {blog.creator.name}</Text>
               <Text color="gray.600">{format(new Date(blog.createdAt), 'PPP')}</Text>
               <Badge colorScheme={blog.published ? 'green' : 'gray'}>
                 {blog.published ? 'Published' : 'Draft'}
               </Badge>
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
           </VStack>

        {isAdmin && (
          <HStack>
            <Button onClick={handlePublishToggle} colorScheme={blog.published ? 'red' : 'green'}>
              {blog.published ? 'Unpublish' : 'Publish'}
            </Button>
            <Button as="a" href={`/blog/edit/${blog.id}`} colorScheme="blue">
              Edit
            </Button>
            <Button onClick={handleDelete} colorScheme="red" variant="outline">
              Delete
            </Button>
          </HStack>
        )}

        <Box
          dangerouslySetInnerHTML={{ __html: blog.content }}
          sx={{
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              marginTop: '1.5em',
              marginBottom: '0.5em',
            },
            '& p': {
              marginBottom: '1em',
              lineHeight: '1.6',
            },
            '& ul, & ol': {
              marginBottom: '1em',
              paddingLeft: '2em',
            },
            '& blockquote': {
              borderLeft: '4px solid',
              borderColor: 'gray.300',
              paddingLeft: '1em',
              margin: '1em 0',
              fontStyle: 'italic',
            },
          }}
        />
      </VStack>
    </Container>
  );
};