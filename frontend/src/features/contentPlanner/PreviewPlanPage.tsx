import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Button,
  Text,
  VStack,
  HStack,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Textarea,
  Input,
  Badge,
  Switch,
  FormControl,
  FormLabel,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useTeam } from "../../contexts/TeamContext";
import { plansApi } from "../../services/plans";
import { format } from "date-fns";

interface GeneratedPost {
  title: string;
  content: string;
  socialMedias: string[];
  scheduledDate: string;
  sendReminder?: boolean;
}

export const PreviewPlanPage = () => {
  const { activeTeam } = useTeam();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [planData, setPlanData] = useState<any>(null);
  const [action, setAction] = useState<'draft' | 'publish'>('publish');
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const state = location.state as any;
    if (state?.posts && state?.planData) {
      setPosts(state.posts);
      setPlanData(state.planData);
      setAction(state.action || 'publish');
      setDraftId(state.draftId || null);
    } else {
      // If no state, redirect back to create page
      navigate("/content-planner/create");
    }
  }, [location.state, navigate]);

  const updatePost = (index: number, field: keyof GeneratedPost, value: any) => {
    setPosts(prev => prev.map((post, i) =>
      i === index ? { ...post, [field]: value } : post
    ));
  };

  const removePost = (index: number) => {
    setPosts(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!activeTeam || !planData) return;

    setIsLoading(true);
    try {
      if (action === 'publish') {
        if (draftId) {
          // Publishing an existing draft
          await plansApi.publishPlan(draftId, { posts });

          toast({
            title: "Plan published successfully",
            description: `Published plan with ${posts.length} posts`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          // Creating a new published plan
          await plansApi.createPlan({
            ...planData,
            status: 'published',
            posts,
          });

          toast({
            title: "Plan created successfully",
            description: `Created plan with ${posts.length} posts`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        // Create draft plan without posts
        await plansApi.createPlan({
          ...planData,
          status: 'draft',
        });

        toast({
          title: "Draft saved successfully",
          description: "Your plan has been saved as a draft",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      navigate("/calendar");
    } catch (error: any) {
      toast({
        title: `Failed to ${action === 'publish' ? 'create' : 'save'} plan`,
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!posts.length || !planData) {
    return null;
  }

  return (
    <Box p={8} maxW="4xl" mx="auto">
      <VStack spacing={6} align="stretch">
        <Box>
           <Heading mb={2}>
             {action === 'publish' ? 'Preview & Schedule' : 'Preview Draft'}
           </Heading>
           <Text color="gray.600">
             {action === 'publish'
               ? 'Review and edit your AI-generated posts before scheduling them.'
               : 'Review your draft plan. You can publish it later to create posts.'
             }
           </Text>
         </Box>

        <VStack spacing={4} align="stretch">
          {posts.map((post, index) => (
            <Card key={index}>
              <CardHeader>
                <HStack justify="space-between">
                  <Box>
                    <Heading size="md">Post {index + 1}</Heading>
                    <Text color="gray.500">
                      {format(new Date(post.scheduledDate), 'MMMM d, yyyy @ h:mm a')}
                    </Text>
                  </Box>
                  <IconButton
                    aria-label="Delete post"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => removePost(index)}
                  />
                </HStack>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Title</FormLabel>
                    <Input
                      value={post.title}
                      onChange={(e) => updatePost(index, 'title', e.target.value)}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Content</FormLabel>
                    <Textarea
                      value={post.content}
                      onChange={(e) => updatePost(index, 'content', e.target.value)}
                      minH="100px"
                    />
                  </FormControl>

                  <HStack spacing={4}>
                    <Badge colorScheme="blue">Draft</Badge>
                    <HStack>
                      <Switch
                        id={`reminder-${index}`}
                        isChecked={post.sendReminder || false}
                        onChange={(e) => updatePost(index, 'sendReminder', e.target.checked)}
                      />
                      <FormLabel htmlFor={`reminder-${index}`} mb={0}>
                        Send Reminder
                      </FormLabel>
                    </HStack>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </VStack>

        <Card>
          <CardFooter>
            <HStack spacing={4} width="full" justify="flex-end">
              <Button variant="outline" onClick={() => navigate("/content-planner/create")}>
                Back
              </Button>
               <Button
                 colorScheme="blue"
                 onClick={handleSubmit}
                 isLoading={isLoading}
               >
                 {action === 'publish' ? 'Schedule All Posts' : 'Save as Draft'}
               </Button>
            </HStack>
          </CardFooter>
        </Card>
      </VStack>
    </Box>
  );
};