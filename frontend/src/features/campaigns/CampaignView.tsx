/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  Button,
  Badge,
  Flex,
  IconButton,
  Stack,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { Campaign, Payout } from "../../types/commons";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { CampaignModal } from "./modals/CreateCampaignModal";
import { Center, Spinner, useDisclosure } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { campaignsApi } from "../../services/campaigns";
import { getFlagEmoji } from "../../services/country";
import { CreatePayoutModal } from "./modals/CreatePayoutModal";
import { payoutsApi } from "../../services/payouts";
import { ACTION } from "../../types/commons";
import { AppModal } from "../../components/modals/AppModal";
import { formatDate } from "../../utils/date";

export const CampaignView = () => {
  const toast = useToast();
  const { campaignId } = useParams<{ campaignId: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [payout, setPayout] = useState<Payout | null>(null);
  const [isCreatingPayout, setIsCreatingPayout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [searchTerm, setSearchTerm] = useState("");
  const [action, setAction] = useState<ACTION | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);

  const filteredPayouts = useMemo(() => {
    return payouts.filter((payout) =>
      payout.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [payouts, searchTerm]);

  useEffect(() => {
    getCampaign();
  }, []);

  const handleDeletePayout = async (payout: Payout) => {
    setAction(ACTION.DELETE_PAYOUT);
    setPayout(payout);
  };

  const onActionDone = async () => {
    setAction(null);
    setPayout(null);
  };

  const onDelete = async () => {
    setIsLoading(true);
    try {
      await payoutsApi.deletePayout(payout?.id!);
      getCampaign();
      onActionDone();
    } catch (error: any) {
      toast({
        title: "Error creating payout",
        description:
          error?.message || "Something went wrong while creating the payout.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  const getCampaign = async () => {
    const foundCampaign = await campaignsApi.getCampaignById(campaignId!);

    if (foundCampaign) {
      setCampaign(foundCampaign);
      if (foundCampaign?.payouts) {
        setPayouts(foundCampaign?.payouts);
      }
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    navigate("/campaigns");
  };

  const handleEditClick = () => {
    onOpen();
  };

  if (!campaign) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="primary.500" />
      </Center>
    );
  }

  return (
    <Box p={4} minH="100vh" bg="gray.900" color="whiteAlpha.900" marginX={40}>
      <Button mb={4} colorScheme="gray" onClick={handleClose}>
        ← Back
      </Button>

      <Box bg="gray.800" boxShadow="md" borderRadius="md" p={4}>
        <Badge
          borderRadius="full"
          px={2}
          colorScheme={campaign.isRunning ? "green" : "red"}
        >
          {campaign.isRunning ? "Running" : "Paused"}
        </Badge>
        <Flex justify="space-between" align="center" mb={4}>
          <Box>
            <Heading size="lg" color="primary.500">
              {campaign.title}
            </Heading>
          </Box>

          <Stack direction="row" spacing={2} align="center">
            <Button variant="primary" size="sm" onClick={handleEditClick}>
              Edit Campaign
            </Button>

            <CampaignModal
              isOpen={isOpen}
              onClose={onClose}
              onSave={() => {
                onClose();
                getCampaign();
              }}
              campaign={campaign}
            />
            <CreatePayoutModal
              isOpen={isCreatingPayout}
              onClose={() => setIsCreatingPayout(false)}
              onSave={() => {
                setIsCreatingPayout(false);
                getCampaign();
              }}
              campaign={campaign}
            />
          </Stack>
        </Flex>

        <Text mb={2}>
          <strong>Landing Page URL:</strong>{" "}
          <a
            href={campaign.landingPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            color="blue.400"
          >
            {campaign.landingPageUrl}
          </a>
        </Text>

        <Flex justify="space-between" color="whiteAlpha.600">
          <Text>
            <Text as="span">Created At: {formatDate(campaign.createdAt)}</Text>
          </Text>
          <Text>Last Updated: {formatDate(campaign.updatedAt)}</Text>
        </Flex>
      </Box>

      <Box mt={6}>
        <Flex justify="space-around" align="center" mb={4} marginX={40}>
          <Input
            placeholder="Search payout by country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mb={4}
            bg="gray.700"
            color="whiteAlpha.800"
            _placeholder={{ color: "whiteAlpha.500" }}
            border="none"
            borderRadius="md"
            maxW="350px"
            _focus={{
              bg: "gray.600",
              borderColor: "gray.500",
              boxShadow: "none",
            }}
          />
          <Button
            leftIcon={<AddIcon />}
            size="sm"
            variant="primary"
            onClick={() => setIsCreatingPayout(true)}
          >
            Add Payout
          </Button>
        </Flex>

        <TableContainer
          bg="gray.800"
          boxShadow="md"
          borderRadius="md"
          marginX={40}
        >
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th color="whiteAlpha.700" cursor="pointer">
                  Country
                </Th>
                <Th color="whiteAlpha.700" cursor="pointer">
                  Amount{" "}
                </Th>
                <Th color="whiteAlpha.700">Created</Th>
                <Th color="whiteAlpha.700">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredPayouts.map((payout, index) => (
                <Tr key={index}>
                  <Td>
                    {getFlagEmoji(payout.country)} {payout.country}
                  </Td>
                  <Td>${payout.amount}</Td>
                  <Td> {formatDate(payout.createdAt)}</Td>
                  <Td>
                    <Stack direction="row" spacing={2}>
                      <Tooltip label="Delete Payout">
                        <IconButton
                          icon={<DeleteIcon />}
                          aria-label="Delete Payout"
                          onClick={() => handleDeletePayout(payout)}
                          colorScheme="red"
                          size="sm"
                          _hover={{ bg: "red.600" }}
                        />
                      </Tooltip>
                    </Stack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      {payout && (
        <AppModal
          title={`Delete payout for: ${getFlagEmoji(payout?.country!)} ${
            payout?.country
          }`}
          isOpen={action === ACTION.DELETE_PAYOUT}
          onCancel={onActionDone}
          onSubmit={onDelete}
          successButtonColorScheme="red"
          successButtonLabel="Delete"
          isSuccessButtonDisabled={isLoading}
          isSuccessButtonLoading={isLoading}
        >
          <Box bg="gray.800" boxShadow="md" borderRadius="md" p={4}>
            <strong>AMOUNT: ${payout?.amount}</strong>
          </Box>
        </AppModal>
      )}
    </Box>
  );
};
