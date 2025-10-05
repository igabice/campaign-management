import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  Text,
  Checkbox,
  Divider,
  useToast,
  Card,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useTeam } from "../../contexts/TeamContext";
import { socialMediaApi } from "../../services/socialMedia";
import { aiApi } from "../../services/ai";
import { plansApi } from "../../services/plans";
import { FullPageLoader } from "../../components/FullPageLoader";
import { addDays, parseISO, getDay } from "date-fns";

const availableDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

type ScheduleItem = { day: string; times: string[] };





export const CreatePlanPage = () => {
  const { activeTeam } = useTeam();
  const [socialMedias, setSocialMedias] = useState<any[]>([]);
  const [selectedSocialMedias, setSelectedSocialMedias] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(availableDays.map(day => ({ day, times: [] })));
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();
  const toast = useToast();





  const fetchSocialMedias = useCallback(async () => {
    if (!activeTeam) return;
    try {
      const response = await socialMediaApi.getAllSocialMedia(1, 100, { teamId: activeTeam.id, status: 'active' });
      setSocialMedias(response.result);
    } catch (error) {
      console.error("Failed to fetch social medias", error);
    }
  }, [activeTeam]);

  useEffect(() => {
    if (activeTeam) {
      fetchSocialMedias();
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    }
  }, [activeTeam, fetchSocialMedias]);





  const generateScheduledPosts = (aiPosts: any[]) => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const scheduledSlots: { date: Date; time: string }[] = [];

    // Generate all possible slots between start and end dates
    for (let current = new Date(start); current <= end; current = addDays(current, 1)) {
      const dayName = availableDays[getDay(current)];
      const daySchedule = schedule.find(s => s.day === dayName);
      if (daySchedule) {
        daySchedule.times.forEach(time => {
          scheduledSlots.push({ date: new Date(current), time });
        });
      }
    }

    // Sort slots by date
    scheduledSlots.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Assign posts to slots
    return aiPosts.slice(0, scheduledSlots.length).map((post, index) => {
      const slot = scheduledSlots[index];
      const scheduledDate = new Date(slot.date);
      const [hours, minutes] = slot.time.split(':');
      scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      return {
        title: post.title,
        content: post.content,
        socialMedias: selectedSocialMedias,
        scheduledDate: scheduledDate.toISOString(),
        sendReminder: false,
      };
    });
  };

  const handleGenerateWithAI = async (action: 'draft' | 'publish') => {
    if (selectedSocialMedias.length === 0) {
      toast({
        title: "No social media selected",
        description: "Please select at least one social media account",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await aiApi.generateContentPlan({
        topicPreferences: [], // TODO: add user preferences
        postFrequency: `${schedule.reduce((sum, d) => sum + d.times.length, 0)} posts per week`,
        title,
        description,
        tone: 'Professional',
      });
      if (result.posts && result.posts.length > 0) {
        const scheduledPosts = generateScheduledPosts(result.posts);

        if (action === 'publish') {
          // Create and publish the plan directly
          await plansApi.createPlan({
            ...{
              title,
              description,
              startDate,
              endDate,
              tone: 'Professional',
              teamId: activeTeam!.id,
            },
            status: 'published',
            posts: scheduledPosts,
          });

          toast({
            title: "Plan created successfully",
            description: `Created plan with ${scheduledPosts.length} posts`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          navigate("/calendar");
        } else {
          // Navigate to preview page for draft
          navigate("/content-planner/preview", {
            state: {
              posts: scheduledPosts,
              planData: {
                title,
                description,
                startDate,
                endDate,
                tone: 'Professional',
                teamId: activeTeam!.id,
              },
              action: 'draft'
            }
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Could not generate content. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      console.error("AI generation error:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred during content generation.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <Box p={8} maxW="4xl" mx="auto">
      {isLoading && <FullPageLoader message="Generating content with AI..." />}
      <Heading mb={6}>Create Content Plan</Heading>
      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Weekly Tech Roundup" />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the content you want to generate..." />
            </FormControl>

            <FormControl>
              <FormLabel>Start Date</FormLabel>
              <Input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" />
            </FormControl>
            <FormControl>
              <FormLabel>End Date</FormLabel>
              <Input value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" />
            </FormControl>

            <FormControl>
              <FormLabel>Social Media Accounts</FormLabel>
              <VStack align="start" spacing={2}>
                {socialMedias.map((sm) => (
                  <Checkbox
                    key={sm.id}
                    isChecked={selectedSocialMedias.includes(sm.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSocialMedias(prev => [...prev, sm.id]);
                      } else {
                        setSelectedSocialMedias(prev => prev.filter(id => id !== sm.id));
                      }
                    }}
                  >
                    {sm.accountName} ({sm.platform})
                  </Checkbox>
                ))}
              </VStack>
            </FormControl>

            <Divider />

            <Heading size="md">Scheduling</Heading>

            <VStack align="stretch" spacing={4}>
              <Text fontWeight="bold">Days & Times</Text>
              <Text>Select the days and times you want to schedule posts for.</Text>
              {schedule.map((daySchedule) => (
                <Box key={daySchedule.day} p={4} borderWidth={1} borderRadius="md">
                  <HStack justify="space-between">
                    <Text fontWeight="bold">{daySchedule.day}</Text>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSchedule(prev => prev.map(d =>
                          d.day === daySchedule.day
                            ? { ...d, times: [...d.times, '09:00'] }
                            : d
                        ));
                      }}
                    >
                      Add Time
                    </Button>
                  </HStack>
                  {daySchedule.times.length > 0 && (
                    <VStack align="stretch" spacing={2} mt={4}>
                      {daySchedule.times.map((time, timeIndex) => (
                        <HStack key={timeIndex}>
                          <Input
                            type="time"
                            value={time}
                            onChange={(e) => {
                              const newTime = e.target.value;
                              setSchedule(prev => prev.map(d =>
                                d.day === daySchedule.day
                                  ? {
                                      ...d,
                                      times: d.times.map((t, i) => i === timeIndex ? newTime : t)
                                    }
                                  : d
                              ));
                            }}
                          />
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => {
                              setSchedule(prev => prev.map(d =>
                                d.day === daySchedule.day
                                  ? { ...d, times: d.times.filter((_, i) => i !== timeIndex) }
                                  : d
                              ));
                            }}
                          >
                            Remove
                          </Button>
                        </HStack>
                      ))}
                    </VStack>
                  )}
                </Box>
              ))}
            </VStack>
          </VStack>
        </CardBody>
        <CardFooter>
           <HStack spacing={4}>
             <Button onClick={() => handleGenerateWithAI('draft')} variant="outline" isLoading={isLoading}>
               Save as Draft
             </Button>
             <Button onClick={() => handleGenerateWithAI('publish')} colorScheme="blue" isLoading={isLoading}>
               Create & Publish
             </Button>
           </HStack>
         </CardFooter>
      </Card>
    </Box>
  );
};