import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  HStack,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Text,
  IconButton,
  VStack,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { SearchIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Twitter, Facebook, Linkedin, Instagram } from "lucide-react";
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
import { AssignApproverModal } from "../../components/modals/AssignApproverModal";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isListOpen, setIsListOpen] = useState(false);
  const [datePosts, setDatePosts] = useState<Post[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>("month");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [assignApproverModalOpen, setAssignApproverModalOpen] = useState(false);
  const [itemToAssign, setItemToAssign] = useState<any>(null);

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return <Twitter size={16} />;
      case "facebook":
        return <Facebook size={16} />;
      case "linkedin":
        return <Linkedin size={16} />;
      case "instagram":
        return <Instagram size={16} />;
      default:
        return null;
    }
  };

  const fetchPosts = useCallback(async () => {
    if (!activeTeam) return;
    try {
      const response = await postsApi.getAllPosts(1, 100, {
        teamId: activeTeam.id,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setPosts(response.result);
      setTotalPosts(response.count);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  }, [activeTeam, searchTerm, statusFilter, startDate, endDate]);

  const handleDeletePost = useCallback(async () => {
    if (!postToDelete) return;
    try {
      await postsApi.deletePost(postToDelete.id);
      fetchPosts();
      setDeleteModalOpen(false);
      setPostToDelete(null);
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  }, [postToDelete, fetchPosts]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const newEvents = posts.map((post) => ({
      title: post.title || post.content.substring(0, 50) + "...",
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
          <Button colorScheme="blue" onClick={() => setIsCreatePostOpen(true)}>
            Create Post
          </Button>
          <Button
            colorScheme="green"
            onClick={() => navigate("/content-planner/create")}
          >
            Generate Plan
          </Button>
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
                  const dayPosts = posts.filter((post) => {
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
                views={["month", "week", "day"]}
                style={{ height: "600px" }}
              />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box pb={8}>
              <Heading size="md" mb={4}>
                Scheduled Posts
              </Heading>
              <HStack spacing={4} mb={4}>
                <Select
                  placeholder="Filter by status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  w="200px"
                >
                  <option value="Draft">Draft</option>
                  <option value="Posted">Posted</option>
                </Select>
                <VStack spacing={1} display={{ base: "none", md: "flex" }}>
                  <Text fontSize="sm" fontWeight="bold">
                    Start Date
                  </Text>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    size="sm"
                  />
                </VStack>
                <VStack spacing={1} display={{ base: "none", md: "flex" }}>
                  <Text fontSize="sm" fontWeight="bold">
                    End Date
                  </Text>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    size="sm"
                  />
                </VStack>
                <InputGroup flex={1}>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search posts by title or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
                <Button
                  variant="link"
                  colorScheme="blue"
                  display={{ base: "none", md: "inline-flex" }}
                  onClick={() => {
                    setStatusFilter("");
                    setStartDate("");
                    setEndDate("");
                    setSearchTerm("");
                  }}
                >
                  Clear Filters
                </Button>
              </HStack>
              <Box display={{ base: "none", md: "block" }}>
                <Tabs variant="enclosed">
                  <TabList>
                    <Tab>Table View</Tab>
                    <Tab>Feed View</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <Table variant="simple">
                         <Thead>
                           <Tr>
                             <Th>Title</Th>
                             <Th>Content</Th>
                             <Th>Scheduled Date</Th>
                             <Th>Status</Th>
                             <Th>Approval</Th>
                             <Th>Actions</Th>
                           </Tr>
                         </Thead>
                        <Tbody>
                          {posts.map((post) => (
                            <Tr key={post.id}>
                              <Td
                                cursor="pointer"
                                _hover={{ bg: "gray.50" }}
                                onClick={() => {
                                  setSelectedPost(post);
                                  setIsDetailsOpen(true);
                                }}
                              >
                                {post.title || "No title"}
                              </Td>
                              <Td
                                cursor="pointer"
                                _hover={{ bg: "gray.50" }}
                                onClick={() => {
                                  setSelectedPost(post);
                                  setIsDetailsOpen(true);
                                }}
                              >
                                {post.content}
                              </Td>
                              <Td>
                                {format(new Date(post.scheduledDate), "PPP")}
                              </Td>
                              <Td>{post.status}</Td>
                              <Td>
                                {post.approvalStatus === "pending" && (
                                  <Badge colorScheme="yellow">Pending Approval</Badge>
                                )}
                                {post.approvalStatus === "approved" && (
                                  <Badge colorScheme="green">Approved</Badge>
                                )}
                                {post.approvalStatus === "rejected" && (
                                  <Badge colorScheme="red">Rejected</Badge>
                                )}
                                {(!post.approvalStatus || post.approvalStatus === "none") && (
                                  <Badge colorScheme="gray">No Approval</Badge>
                                )}
                              </Td>
                              <Td>
                                <HStack spacing={2}>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    colorScheme="blue"
                                    onClick={() => {
                                      setItemToAssign({
                                        id: post.id,
                                        type: "post",
                                        title: post.title || "Untitled Post",
                                        creator: post.creator,
                                      });
                                      setAssignApproverModalOpen(true);
                                    }}
                                  >
                                    Assign Approver
                                  </Button>
                                  <IconButton
                                    aria-label="Edit post"
                                    icon={<EditIcon />}
                                    size="sm"
                                    onClick={() => setEditingPost(post)}
                                  />
                                  <IconButton
                                    aria-label="Delete post"
                                    icon={<DeleteIcon />}
                                    size="sm"
                                    colorScheme="red"
                                    onClick={() => {
                                      setPostToDelete(post);
                                      setDeleteModalOpen(true);
                                    }}
                                  />
                                </HStack>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TabPanel>
                    <TabPanel>
                      <VStack spacing={4} align="stretch">
                        {posts.map((post) => (
                          <Box
                            key={post.id}
                            borderWidth={1}
                            borderRadius="md"
                            p={4}
                            _hover={{ shadow: "md" }}
                          >
                            <VStack align="start" spacing={2}>
                              {post.title && (
                                <HStack>
                                  <Heading size="md">{post.title}</Heading>
                                  <HStack spacing={1}>
                                    {post.socialMedias.map((sm) => {
                                      const icon = getPlatformIcon(sm.platform);
                                      return icon ? (
                                        <Box key={sm.id}>{icon}</Box>
                                      ) : null;
                                    })}
                                  </HStack>
                                </HStack>
                              )}
                              <Text>{post.content}</Text>
                              {post.image && (
                                <img
                                  src={post.image}
                                  alt="Post image"
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "300px",
                                    height: "auto",
                                    objectFit: "contain",
                                    borderRadius: "md",
                                  }}
                                />
                              )}
                              <HStack justify="space-between" w="full">
                                 <HStack>
                                   <Text fontSize="sm" color="gray.600">
                                     Scheduled:{" "}
                                     {format(
                                       new Date(post.scheduledDate),
                                       "PPP p"
                                     )}
                                   </Text>
                                   <Badge
                                     colorScheme={
                                       post.status === "Posted"
                                         ? "green"
                                         : "gray"
                                     }
                                   >
                                     {post.status}
                                   </Badge>
                                   {post.approvalStatus === "pending" && (
                                     <Badge colorScheme="yellow">Pending Approval</Badge>
                                   )}
                                   {post.approvalStatus === "approved" && (
                                     <Badge colorScheme="green">Approved</Badge>
                                   )}
                                   {post.approvalStatus === "rejected" && (
                                     <Badge colorScheme="red">Rejected</Badge>
                                   )}
                                 </HStack>
                                <HStack spacing={2}>
                                  <IconButton
                                    aria-label="Edit post"
                                    icon={<EditIcon />}
                                    size="sm"
                                    onClick={() => setEditingPost(post)}
                                  />
                                  <IconButton
                                    aria-label="Delete post"
                                    icon={<DeleteIcon />}
                                    size="sm"
                                    colorScheme="red"
                                    onClick={() => {
                                      setPostToDelete(post);
                                      setDeleteModalOpen(true);
                                    }}
                                  />
                                </HStack>
                              </HStack>
                            </VStack>
                          </Box>
                        ))}
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
              <Box display={{ base: "block", md: "none" }}>
                <VStack spacing={4} align="stretch">
                  {posts.map((post) => (
                    <Box
                      key={post.id}
                      borderWidth={1}
                      borderRadius="md"
                      p={4}
                      _hover={{ shadow: "md" }}
                    >
                      <VStack align="start" spacing={2}>
                        {post.title && (
                          <HStack>
                            <Heading size="md">{post.title}</Heading>
                            <HStack spacing={1}>
                              {post.socialMedias.map((sm) => {
                                const icon = getPlatformIcon(sm.platform);
                                return icon ? (
                                  <Box key={sm.id}>{icon}</Box>
                                ) : null;
                              })}
                            </HStack>
                          </HStack>
                        )}
                        <Text>{post.content}</Text>
                        {post.image && (
                          <img
                            src={post.image}
                            alt="Post image"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "300px",
                              height: "auto",
                              objectFit: "contain",
                              borderRadius: "md",
                            }}
                          />
                        )}
                        <HStack justify="space-between" w="full">
                          <HStack>
                            <Text fontSize="sm" color="gray.600">
                              Scheduled:{" "}
                              {format(new Date(post.scheduledDate), "PPP p")}
                            </Text>
                            <Badge
                              colorScheme={
                                post.status === "Posted" ? "green" : "gray"
                              }
                            >
                              {post.status}
                            </Badge>
                          </HStack>
                          <HStack spacing={2}>
                            <IconButton
                              aria-label="Edit post"
                              icon={<EditIcon />}
                              size="sm"
                              onClick={() => setEditingPost(post)}
                            />
                            <IconButton
                              aria-label="Delete post"
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              onClick={() => {
                                setPostToDelete(post);
                                setDeleteModalOpen(true);
                              }}
                            />
                          </HStack>
                        </HStack>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </Box>
              <Text mt={4} fontSize="sm" color="gray.600">
                Total posts: {totalPosts}
              </Text>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <CreatePostModal
        isOpen={isCreatePostOpen || !!editingPost}
        onClose={() => {
          setIsCreatePostOpen(false);
          setEditingPost(null);
        }}
        activeTeam={activeTeam}
        onPostCreated={fetchPosts}
        post={editingPost}
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
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this post? This action cannot be
            undone.
            {postToDelete && (
              <Text mt={2} fontWeight="bold">
                "
                {postToDelete.title ||
                  postToDelete.content.substring(0, 50) + "..."}
                "
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeletePost}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <AssignApproverModal
        isOpen={assignApproverModalOpen}
        onClose={() => setAssignApproverModalOpen(false)}
        item={itemToAssign}
        onAssigned={() => {
          fetchPosts();
          setAssignApproverModalOpen(false);
          setItemToAssign(null);
        }}
      />
    </Box>
  );
};
