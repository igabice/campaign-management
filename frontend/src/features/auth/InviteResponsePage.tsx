import React, { useState, useEffect } from "react";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Card,
  CardBody,
  Badge,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { invitesApi } from "../../services/invites";

interface InviteDetails {
  id: string;
  email: string;
  status: string;
  inviter: {
    name: string;
    email: string;
  };
  team: {
    title: string;
  };
}

export const InviteResponsePage: React.FC = () => {
  const { inviteId } = useParams<{ inviteId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [invite, setInvite] = useState<InviteDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    const fetchInvite = async () => {
      if (!inviteId) return;

      try {
        const data = await invitesApi.getInviteById(inviteId);
        setInvite(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load invite");
      } finally {
        setLoading(false);
      }
    };

    fetchInvite();
  }, [inviteId]);

  const handleResponse = async (action: "accept" | "decline") => {
    if (!inviteId) return;

    setResponding(true);
    try {
      await invitesApi.respondToInvite(inviteId, action);
      toast({
        title: `Invite ${action}ed successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Failed to respond to invite",
        description: err.response?.data?.message || "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setResponding(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error || !invite) {
    return (
      <Box p={8}>
        <Alert status="error">
          <AlertIcon />
          {error || "Invite not found"}
        </Alert>
      </Box>
    );
  }

  if (invite.status !== "pending") {
    return (
      <Box p={8}>
        <Alert status="info">
          <AlertIcon />
          This invite has already been {invite.status}.
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={8} maxW="600px" mx="auto">
      <Box textAlign="center" mb={8}>
        <ChakraLink
          as={RouterLink}
          to="/"
          _hover={{ textDecoration: "none" }}
        >
          <Heading size="lg" color="teal.500" mb={2}>
            CampaignPro
          </Heading>
        </ChakraLink>
      </Box>
      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Heading size="lg" textAlign="center">
              Team Invitation
            </Heading>

            <Box textAlign="center">
              <Text fontSize="lg" mb={2}>
                You've been invited to join
              </Text>
              <Heading size="md" color="blue.500">
                {invite.team.title}
              </Heading>
            </Box>

            <Box>
              <Text mb={2}>
                <strong>Invited by:</strong> {invite.inviter.name || invite.inviter.email}
              </Text>
              <Text mb={2}>
                <strong>Email:</strong> {invite.email}
              </Text>
              <Text>
                <strong>Status:</strong>{" "}
                <Badge colorScheme="yellow">Pending</Badge>
              </Text>
            </Box>

            <Text textAlign="center" color="gray.600">
              Would you like to accept this invitation to join the team?
            </Text>

            <HStack spacing={4} justify="center">
              <Button
                colorScheme="green"
                size="lg"
                onClick={() => handleResponse("accept")}
                isLoading={responding}
                loadingText="Accepting..."
              >
                Accept Invite
              </Button>
              <Button
                colorScheme="red"
                variant="outline"
                size="lg"
                onClick={() => handleResponse("decline")}
                isLoading={responding}
                loadingText="Declining..."
              >
                Decline
              </Button>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};