import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Stack,
  IconButton,
  Tooltip,
  Badge,
  Flex,
  useToast,
  useDisclosure,
  Box,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import { Campaign } from "../types/commons";
import { formatDate } from "../utils/date";
import { campaignsApi } from "../services/campaigns";
import { useNavigate } from "react-router-dom";
import { AppModal } from "./modals/AppModal";
import { CampaignModal } from "../features/campaigns/modals/CreateCampaignModal";

interface CampaignListProps {
  campaigns: Campaign[];
  onSuccess: () => void;
}

export const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  onSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingLoading, setIsDeletingLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const deleteCampaign = async () => {
    try {
      setIsDeletingLoading(true);

      await campaignsApi.deleteCampaign(selectedCampaign?.id!);
      toast({
        title: "Campaign deleted",
        description: "Successfully deleted campaign!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      cancelDeleteCampaign();
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete campaign",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    setIsDeletingLoading(false);
  };

  const handleViewCampaign = (campaign: Campaign) => {
    navigate(`/campaigns/${campaign.id}`);
  };

  const handleDeleteCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDeleting(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    onOpen();
  };

  const cancelDeleteCampaign = () => {
    setIsDeleting(false);
    setSelectedCampaign(null);
  };

  return (
    <>
      <TableContainer
        bg="gray.800"
        boxShadow="md"
        borderRadius="md"
        border="1px solid"
        borderColor="gray.700"
        w={{ base: "full", sm: "200px", md: "1200px" }}
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th color="whiteAlpha.700">Title</Th>
              <Th color="whiteAlpha.700">Landing Page URL</Th>
              <Th color="whiteAlpha.700">Status</Th>
              <Th color="whiteAlpha.700">Created</Th>
              <Th color="whiteAlpha.700">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {campaigns.length === 0 ? (
              <Tr>
                <Td colSpan={5} textAlign="center" color="whiteAlpha.600">
                  No campaigns found.
                </Td>
              </Tr>
            ) : (
              campaigns.map((campaign) => (
                <Tr key={campaign.id}>
                  <Td>{campaign.title}</Td>
                  <Td>
                    <a
                      href={campaign.landingPageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="blue.400"
                    >
                      {campaign.landingPageUrl}
                    </a>
                  </Td>
                  <Td>
                    <Flex align="center">
                      {campaign.isRunning ? (
                        <>
                          <Badge colorScheme="green">Running</Badge>
                        </>
                      ) : (
                        <>
                          <Badge colorScheme="red">Paused</Badge>
                        </>
                      )}
                    </Flex>
                  </Td>
                  <Td color="whiteAlpha.600">
                    {formatDate(campaign.updatedAt)}
                  </Td>
                  <Td>
                    <Stack direction="row" spacing={2} justify="flex-end">
                      <Tooltip label="View Campaign">
                        <IconButton
                          icon={<ViewIcon />}
                          aria-label="View Campaign"
                          onClick={() => handleViewCampaign(campaign)}
                          colorScheme="green"
                          size="sm"
                          _hover={{ bg: "green.600" }}
                        />
                      </Tooltip>
                      <Tooltip label="Edit Campaign">
                        <IconButton
                          icon={<EditIcon />}
                          aria-label="Edit Campaign"
                          onClick={() => handleEditCampaign(campaign)}
                          colorScheme="blue"
                          size="sm"
                          _hover={{ bg: "blue.600" }}
                        />
                      </Tooltip>
                      <Tooltip label="Delete Campaign">
                        <IconButton
                          icon={<DeleteIcon />}
                          aria-label="Delete Campaign"
                          onClick={() => handleDeleteCampaign(campaign)}
                          colorScheme="red"
                          size="sm"
                          _hover={{ bg: "red.600" }}
                        />
                      </Tooltip>
                    </Stack>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <AppModal
        title={`Delete campaign: ${selectedCampaign?.title}`}
        isOpen={isDeleting}
        onCancel={cancelDeleteCampaign}
        onSubmit={deleteCampaign}
        successButtonColorScheme="red"
        successButtonLabel="Delete"
        isSuccessButtonDisabled={isDeletingLoading}
        isSuccessButtonLoading={isDeletingLoading}
      >
        <Box bg="gray.800" boxShadow="md" borderRadius="md" p={4}>
          <Badge
            borderRadius="full"
            px={2}
            colorScheme={selectedCampaign?.isRunning ? "green" : "red"}
          >
            {selectedCampaign?.isRunning ? "Running" : "Paused"}
          </Badge>
          <br></br>
          <strong>Landing Page URL:</strong>{" "}
          <a
            href={selectedCampaign?.landingPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            color="yellow.400"
          >
            {selectedCampaign?.landingPageUrl}
          </a>
        </Box>
      </AppModal>

      <CampaignModal
        isOpen={isOpen}
        onClose={onClose}
        onSave={() => {
          onClose();
          onSuccess();
        }}
        campaign={selectedCampaign}
      />
    </>
  );
};
