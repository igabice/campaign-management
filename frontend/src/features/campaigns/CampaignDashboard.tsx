/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Box,
  Stack,
  Input,
  Center,
  Spinner,
  Select,
  useDisclosure,
  useToast,
  Button,
  Spacer,
  Flex,
} from "@chakra-ui/react";
import { AddIcon, Search2Icon } from "@chakra-ui/icons";

import { Campaign } from "../../types/commons";
import { campaignsApi } from "../../services/campaigns";
import { CampaignList } from "../../components/CampaignsTable";
import { CampaignModal } from "./modals/CreateCampaignModal";

export const CampaignsDashboard = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState<boolean | null>(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const socialLoginInitiated = localStorage.getItem("socialLoginInitiated");
    if (socialLoginInitiated) {
      toast({
        title: "Success",
        description: "Logged in successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      localStorage.removeItem("socialLoginInitiated");
    }
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setIsLoading(true);
      const query = { searchTerm, isRunning };
      const result = await campaignsApi.getAllCampaigns(1, 20, query);
      setCampaigns(result.result);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error getting campaigns.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === "paused") {
      setIsRunning(false);
    } else if (value === "running") {
      setIsRunning(true);
    } else {
      setIsRunning(null);
    }
  };

  return (
    <Flex justify="center" width="100%">
      <Box p={4} minH="100vh" w={{ base: "full", sm: "100%", md: "1200px" }}>
        <Stack direction="row" spacing={4} mb={4}>
          <Input
            placeholder="Search campaigns by title or URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            w="400px"
            bg="gray.700"
            color="whiteAlpha.800"
            border="none"
            borderRadius="md"
            height="40px"
            _focus={{
              bg: "gray.600",
              borderColor: "gray.500",
              boxShadow: "none",
            }}
            style={{
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
              paddingRight: "40px",
            }}
          />
          <Select
            placeholder="Campaign Status"
            onChange={handleStatusChange}
            bg="gray.700"
            color="whiteAlpha.800"
            border="none"
            borderRadius="md"
            _focus={{
              bg: "gray.600",
              borderColor: "gray.500",
              boxShadow: "none",
            }}
            w="200px"
            minW={{ base: "150px", md: "200px" }}
            maxW="300px"
          >
            <option value="all">All</option>
            <option value="running">Running</option>
            <option value="paused">Paused</option>
          </Select>
          <Button
            leftIcon={<Search2Icon />}
            variant="primary"
            onClick={loadCampaigns}
          ></Button>

          <Spacer></Spacer>
          <Button
            leftIcon={<AddIcon />}
            variant="primary"
            onClick={() => {
              onOpen();
            }}
          >
            New Campaign
          </Button>
        </Stack>

        {isLoading ? (
          <Center>
            <Spinner size="xl" color="primary.500" />
          </Center>
        ) : (
          <CampaignList campaigns={campaigns} onSuccess={loadCampaigns} />
        )}
        <CampaignModal
          isOpen={isOpen}
          onClose={onClose}
          onSave={() => {
            onClose();
            loadCampaigns();
          }}
          campaign={null}
        />
      </Box>
    </Flex>
  );
};
