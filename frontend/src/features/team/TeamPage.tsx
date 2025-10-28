import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  VStack,
  HStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Avatar,
  Image,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon, EditIcon } from "@chakra-ui/icons";
import { useTeam } from "../../contexts/TeamContext";
import { socialMediaApi } from "../../services/socialMedia";
import { teamsApi } from "../../services/teams";
import { invitesApi } from "../../services/invites";
import { CreateSocialMediaModal } from "../../components/modals/CreateSocialMediaModal";
import { EditSocialMediaModal } from "../../components/modals/EditSocialMediaModal";
import { CreateInviteModal } from "../../components/modals/CreateInviteModal";
import { ConnectFacebookModal } from "../../components/modals/ConnectFacebookModal";

interface SocialMedia {
  id: string;
  accountName: string;
  platform: string;
  profileLink: string;
  image?: string;
  status: string;
  // Facebook-specific fields
  pageId?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiry?: string;
}

interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  status: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

interface TeamInvite {
  id: string;
  email: string;
  status: string;
  inviterId: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
  inviter: {
    id: string;
    name: string;
    email: string;
  };
  team: {
    id: string;
    title: string;
  };
}

export const TeamPage = () => {
  const { activeTeam } = useTeam();
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamInvites, setTeamInvites] = useState<TeamInvite[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateInviteModalOpen, setIsCreateInviteModalOpen] = useState(false);
  const [isConnectFacebookModalOpen, setIsConnectFacebookModalOpen] = useState(false);
  const [editSocialMedia, setEditSocialMedia] = useState<SocialMedia | null>(null);
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isCancelInviteOpen, onOpen: onCancelInviteOpen, onClose: onCancelInviteClose } = useDisclosure();
  const { isOpen: isResendInviteOpen, onOpen: onResendInviteOpen, onClose: onResendInviteClose } = useDisclosure();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [cancelInviteId, setCancelInviteId] = useState<string | null>(null);
  const [resendInviteId, setResendInviteId] = useState<string | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const cancelInviteRef = useRef<HTMLButtonElement>(null);
  const resendInviteRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const fetchSocialMedia = useCallback(async () => {
    if (!activeTeam) return;
    try {
      const data = await socialMediaApi.getAllSocialMedia(1, 20, { teamId: activeTeam.id });
      setSocialMedia(data.result);
    } catch (error) {
      console.error("Failed to fetch social media", error);
    }
  }, [activeTeam]);

  const fetchTeamMembers = useCallback(async () => {
    if (!activeTeam) return;
    try {
      const data = await teamsApi.getTeamMembers(activeTeam.id);
      setTeamMembers(data);
    } catch (error) {
      console.error("Failed to fetch team members", error);
    }
  }, [activeTeam]);

  const fetchTeamInvites = useCallback(async () => {
    if (!activeTeam) return;
    try {
      const data = await teamsApi.getTeamInvites(activeTeam.id);
      setTeamInvites(data);
    } catch (error) {
      console.error("Failed to fetch team invites", error);
    }
  }, [activeTeam]);

  useEffect(() => {
    if (activeTeam) {
      fetchSocialMedia();
      fetchTeamMembers();
      fetchTeamInvites();
    }
  }, [activeTeam, fetchSocialMedia, fetchTeamMembers, fetchTeamInvites]);

  const handleEditClick = (sm: SocialMedia) => {
    setEditSocialMedia(sm);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    onDeleteOpen();
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await socialMediaApi.updateSocialMedia(deleteId, { status: "deleted" });
      setSocialMedia(socialMedia.map((sm) =>
        sm.id === deleteId ? { ...sm, status: "deleted" } : sm
      ));
      toast({
        title: "Social media marked as deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to delete social media",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onDeleteClose();
      setDeleteId(null);
    }
  };

  const handleCancelInviteClick = (inviteId: string) => {
    setCancelInviteId(inviteId);
    onCancelInviteOpen();
  };

  const handleConfirmCancelInvite = async () => {
    if (!cancelInviteId) return;
    try {
      await invitesApi.deleteInvite(cancelInviteId);
      setTeamInvites(teamInvites.filter(invite => invite.id !== cancelInviteId));
      toast({
        title: "Invite cancelled",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to cancel invite",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onCancelInviteClose();
      setCancelInviteId(null);
    }
  };

  const handleResendInviteClick = (inviteId: string) => {
    setResendInviteId(inviteId);
    onResendInviteOpen();
  };

  const handleConfirmResendInvite = async () => {
    if (!resendInviteId) return;
    try {
      await invitesApi.resendInvite(resendInviteId);
      toast({
        title: "Invite email resent",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Failed to resend invite",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onResendInviteClose();
      setResendInviteId(null);
    }
  };

  if (!activeTeam) {
    return (
      <Box p={8}>
        <Text>Please select a team first.</Text>
      </Box>
    );
  }

  return (
    <Box p={8}>
      <Heading mb={4}>{activeTeam.title} - Team Management</Heading>
      <Tabs>
        <TabList>
          <Tab>Social Media</Tab>
          <Tab>Members</Tab>
          <Tab>Invites</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                  <Heading size="md">Social Media Accounts</Heading>
                  <HStack>
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => setIsConnectFacebookModalOpen(true)}
                    >
                      Connect Facebook
                    </Button>
                    <Button
                      leftIcon={<AddIcon />}
                      colorScheme="blue"
                      onClick={() => setIsCreateModalOpen(true)}
                    >
                      Add Account
                    </Button>
                  </HStack>
                </HStack>
               <Table variant="simple">
                 <Thead>
                   <Tr>
                     <Th>Account</Th>
                     <Th>Platform</Th>
                     <Th>Profile Link</Th>
                     <Th>Status</Th>
                     <Th>Actions</Th>
                   </Tr>
                 </Thead>
                 <Tbody>
                   {socialMedia.map((sm) => (
                     <Tr key={sm.id}>
                       <Td>
                         <HStack>
                           {sm.image ? (
                             <Image
                               src={sm.image}
                               alt={`${sm.accountName} profile`}
                               boxSize="32px"
                               borderRadius="full"
                               objectFit="cover"
                             />
                           ) : (
                             <Avatar size="sm" name={sm.accountName} />
                           )}
                           <Text>{sm.accountName}</Text>
                         </HStack>
                       </Td>
                       <Td>
                         <Badge colorScheme="blue">{sm.platform}</Badge>
                       </Td>
                       <Td>
                         <a href={sm.profileLink} target="_blank" rel="noopener noreferrer">
                           {sm.profileLink}
                         </a>
                       </Td>
                       <Td>
                         <Badge colorScheme={sm.status === "active" ? "green" : "red"}>
                           {sm.status}
                         </Badge>
                       </Td>
                       <Td>
                         <IconButton
                           aria-label="Edit"
                           icon={<EditIcon />}
                           colorScheme="blue"
                           size="sm"
                           mr={2}
                           onClick={() => handleEditClick(sm)}
                         />
                         <IconButton
                           aria-label="Delete"
                           icon={<DeleteIcon />}
                           colorScheme="red"
                           size="sm"
                           onClick={() => handleDeleteClick(sm.id)}
                         />
                       </Td>
                     </Tr>
                   ))}
                 </Tbody>
               </Table>
            </VStack>
          </TabPanel>
           <TabPanel>
             <VStack align="stretch" spacing={4}>
               <Heading size="md">Team Members</Heading>
               <Table variant="simple">
                 <Thead>
                   <Tr>
                     <Th>Name</Th>
                     <Th>Email</Th>
                     <Th>Role</Th>
                     <Th>Joined</Th>
                   </Tr>
                 </Thead>
                 <Tbody>
                   {teamMembers.map((member) => (
                     <Tr key={member.id}>
                       <Td>
                         <HStack>
                           {member.user.image && (
                             <Avatar size="sm" src={member.user.image} name={member.user.name} />
                           )}
                           <Text>{member.user.name || "Unknown"}</Text>
                         </HStack>
                       </Td>
                       <Td>{member.user.email}</Td>
                       <Td>
                         <Badge colorScheme={member.role === "owner" ? "purple" : "blue"}>
                           {member.role}
                         </Badge>
                       </Td>
                       <Td>{new Date(member.createdAt).toLocaleDateString()}</Td>
                     </Tr>
                   ))}
                 </Tbody>
               </Table>
             </VStack>
           </TabPanel>
           <TabPanel>
             <VStack align="stretch" spacing={4}>
               <HStack justify="space-between">
                 <Heading size="md">Team Invites</Heading>
                 <Button
                   leftIcon={<AddIcon />}
                   colorScheme="blue"
                   onClick={() => setIsCreateInviteModalOpen(true)}
                 >
                   Send Invite
                 </Button>
               </HStack>
               <Table variant="simple">
                 <Thead>
                   <Tr>
                     <Th>Email</Th>
                     <Th>Invited By</Th>
                     <Th>Status</Th>
                     <Th>Sent</Th>
                     <Th>Actions</Th>
                   </Tr>
                 </Thead>
                 <Tbody>
                   {teamInvites.map((invite) => (
                     <Tr key={invite.id}>
                       <Td>{invite.email}</Td>
                       <Td>{invite.inviter.name || invite.inviter.email}</Td>
                       <Td>
                         <Badge colorScheme={
                           invite.status === "pending" ? "yellow" :
                           invite.status === "accepted" ? "green" :
                           invite.status === "declined" ? "red" : "gray"
                         }>
                           {invite.status}
                         </Badge>
                       </Td>
                       <Td>{new Date(invite.createdAt).toLocaleDateString()}</Td>
                        <Td>
                          {invite.status === "pending" && (
                            <HStack spacing={2}>
                              <IconButton
                                aria-label="Resend invite"
                                icon={<AddIcon />}
                                colorScheme="blue"
                                size="sm"
                                onClick={() => handleResendInviteClick(invite.id)}
                              />
                              <IconButton
                                aria-label="Cancel invite"
                                icon={<DeleteIcon />}
                                colorScheme="red"
                                size="sm"
                                onClick={() => handleCancelInviteClick(invite.id)}
                              />
                            </HStack>
                          )}
                        </Td>
                     </Tr>
                   ))}
                 </Tbody>
               </Table>
             </VStack>
           </TabPanel>
        </TabPanels>
      </Tabs>

      <CreateSocialMediaModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={() => fetchSocialMedia()}
      />

      <EditSocialMediaModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        socialMedia={editSocialMedia}
        onUpdated={() => fetchSocialMedia()}
      />

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Social Media
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This will mark the social media account as deleted.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <CreateInviteModal
        isOpen={isCreateInviteModalOpen}
        onClose={() => setIsCreateInviteModalOpen(false)}
        teamId={activeTeam?.id || ""}
        onCreated={() => fetchTeamInvites()}
      />

      <ConnectFacebookModal
        isOpen={isConnectFacebookModalOpen}
        onClose={() => setIsConnectFacebookModalOpen(false)}
        onConnected={() => fetchSocialMedia()}
      />

      <AlertDialog
        isOpen={isCancelInviteOpen}
        leastDestructiveRef={cancelInviteRef}
        onClose={onCancelInviteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cancel Invite
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to cancel this invitation? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelInviteRef} onClick={onCancelInviteClose}>
                Keep Invite
              </Button>
              <Button colorScheme="red" onClick={handleConfirmCancelInvite} ml={3}>
                Cancel Invite
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isResendInviteOpen}
        leastDestructiveRef={resendInviteRef}
        onClose={onResendInviteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Resend Invite Email
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to resend the invitation email? The recipient will receive a new email with the invite link.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={resendInviteRef} onClick={onResendInviteClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleConfirmResendInvite} ml={3}>
                Resend Email
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};