import React, { useState, useEffect, useCallback } from "react";
import { Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Button, HStack, Flex, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useTeam } from "../../contexts/TeamContext";
import { postsApi } from "../../services/posts";
import { Post } from "../../types/schemas";
import { CreatePostModal } from "../../components/modals/CreatePostModal";
import { PostDetailsModal } from "../../components/modals/PostDetailsModal";
import { PostsListModal } from "../../components/modals/PostsListModal";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const CalendarPage = () => {
  const { activeTeam } = useTeam();
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isListOpen, setIsListOpen] = useState(false);
  const [datePosts, setDatePosts] = useState<Post[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>('month');

  const fetchPosts = useCallback(async () => {
    if (!activeTeam) return;
    try {
      const response = await postsApi.getAllPosts(1, 100, { teamId: activeTeam.id });
      setPosts(response.result);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  }, [activeTeam]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const newEvents = posts.map(post => ({
      title: post.title || post.content.substring(0, 50) + '...',
      start: new Date(post.scheduledDate),
      end: new Date(post.scheduledDate),
      resource: post,
    }));
    setEvents(newEvents);
  }, [posts]);

  return (
    <Box p={8} h="calc(100vh - 160px)">
      <Flex mb={4} align="center" justify="space-between">
        <Heading>Calendar</Heading>
        <HStack spacing={4}>
          <Button colorScheme="blue" onClick={() => setIsCreatePostOpen(true)}>Create Post</Button>
          <Button colorScheme="green" onClick={() => console.log('Generate plan')}>Generate Plan</Button>
        </HStack>
      </Flex>
      <Tabs h="full">
        <TabList>
          <Tab>Calendar</Tab>
          <Tab>List View</Tab>
        </TabList>
        <TabPanels h="full">
          <TabPanel h="full" p={4}>
            <Box h="full">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                date={currentDate}
                view={currentView}
                onNavigate={setCurrentDate}
                onView={setCurrentView}
                onSelectEvent={(event) => {
                  setSelectedPost(event.resource);
                  setIsDetailsOpen(true);
                }}
                onSelectSlot={(slotInfo) => {
                  const { start, end } = slotInfo;
                  const dayPosts = posts.filter(post => {
                    const postDate = new Date(post.scheduledDate);
                    return postDate >= start && postDate < end;
                  });
                  if (dayPosts.length > 1) {
                    setSelectedDate(start);
                    setDatePosts(dayPosts);
                    setIsListOpen(true);
                  }
                }}
                selectable
                views={['month', 'week', 'day']}
                style={{ height: "600px" }}
              />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box>
              <Heading size="md" mb={4}>Scheduled Posts</Heading>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Title</Th>
                    <Th>Content</Th>
                    <Th>Scheduled Date</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {posts.map(post => (
                    <Tr
                      key={post.id}
                      cursor="pointer"
                      _hover={{ bg: 'gray.50' }}
                      onClick={() => {
                        setSelectedPost(post);
                        setIsDetailsOpen(true);
                      }}
                    >
                      <Td>{post.title || 'No title'}</Td>
                      <Td>{post.content}</Td>
                      <Td>{format(new Date(post.scheduledDate), 'PPP')}</Td>
                      <Td>{post.status}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        activeTeam={activeTeam}
        onPostCreated={fetchPosts}
      />
      <PostDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        post={selectedPost}
      />
      <PostsListModal
        isOpen={isListOpen}
        onClose={() => setIsListOpen(false)}
        posts={datePosts}
        date={selectedDate}
        onSelectPost={(post) => {
          setSelectedPost(post);
          setIsDetailsOpen(true);
          setIsListOpen(false);
        }}
      />
    </Box>
  );
};