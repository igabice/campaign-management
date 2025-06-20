import React, { useState, useEffect, useCallback } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  IconButton,
  NumberInput,
  NumberInputField,
  HStack,
  Select,
  FormErrorMessage,
  Switch,
  Text,
  useToast,
  Button,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { Campaign, Payout } from "../../../types/commons";
import { CampaignFormSchema } from "../../../types/schemas";
import { z } from "zod";
import { campaignsApi } from "../../../services/campaigns";
import { countriesOptions } from "../../../services/country";
import { AppModal } from "../../../components/modals/AppModal";

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  campaign: Campaign | null;
}

const CampaignModal: React.FC<CampaignModalProps> = ({
  isOpen,
  onClose,
  onSave,
  campaign,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [landingPageUrl, setLandingPageUrl] = useState("https://");
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [formErrors, setFormErrors] = useState<z.ZodIssue[]>([]);

  const getFieldError = (fieldName: string) => {
    const error = formErrors.find((err) => err.path[0] === fieldName);
    return error ? error.message : "";
  };

  const getPayoutFieldError = (index: number, fieldName: string) => {
    const error = formErrors.find(
      (err) =>
        err.path[0] === "payouts" &&
        err.path[1] === index &&
        err.path[2] === fieldName
    );
    return error ? error.message : "";
  };

  useEffect(() => {
    if (campaign) {
      setTitle(campaign.title);
      setLandingPageUrl(campaign.landingPageUrl);
      setPayouts(campaign.payouts || []);
      setIsRunning(campaign.isRunning || false);
    } else {
      setTitle("");
      setLandingPageUrl("https://");
      setPayouts([]);
      setIsRunning(false);
    }
    setFormErrors([]);
  }, [campaign]);

  const handleAddPayout = useCallback(() => {
    setPayouts((prev) => [...prev, { country: "US", amount: 0 }]);
    setFormErrors([]);
  }, []);

  const handleRemovePayout = useCallback((index: number) => {
    setPayouts((prev) => prev.filter((_, i) => i !== index));
    setFormErrors([]);
  }, []);

  const handlePayoutChange = useCallback(
    (index: number, field: keyof Payout, value: string | number) => {
      setPayouts((prev) =>
        prev.map((p, i) =>
          i === index
            ? { ...p, [field]: field === "amount" ? Number(value) : value }
            : p
        )
      );
      setFormErrors([]);
    },
    []
  );

  const handleIsRunningChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsRunning(e.target.checked);
      setFormErrors([]);
    },
    []
  );

  const handleSubmit = async () => {
    const campaignData: Partial<Campaign> = {
      title,
      landingPageUrl,
      isRunning,
      ...(!campaign && { payouts }),
    };

    const validationResult = CampaignFormSchema.safeParse(campaignData);

    if (!validationResult.success) {
      setFormErrors(validationResult.error.issues);
      return;
    }

    setIsLoading(true);
    try {
      campaign
        ? await campaignsApi.updateCampaign(campaign.id, campaignData)
        : await campaignsApi.createCampaign(campaignData);
      onSave();
    } catch (error: any) {
      toast({
        title: "Validation Error",
        description: error?.message || "Please correct the highlighted errors.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    setIsLoading(false);
    setFormErrors([]);
  };

  return (
    <AppModal
      title={campaign ? "Edit Campaign" : "Create Campaign"}
      isOpen={isOpen}
      onCancel={onClose}
      onSubmit={handleSubmit}
      successButtonLabel="Save"
      isSuccessButtonLoading={isLoading}
    >
      <Stack spacing={3}>
        <FormControl isRequired isInvalid={!!getFieldError("title")}>
          <FormLabel>Title</FormLabel>
          <Input
            placeholder="Campaign Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            bg="gray.700"
            color="whiteAlpha.800"
            _placeholder={{ color: "whiteAlpha.500" }}
            border="none"
            borderRadius="md"
            _focus={{
              bg: "gray.600",
              borderColor: "gray.500",
              boxShadow: "none",
            }}
          />
          <FormErrorMessage>{getFieldError("title")}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!getFieldError("landingPageUrl")}>
          <FormLabel>Landing Page URL</FormLabel>
          <Input
            placeholder="https://example.com"
            value={landingPageUrl}
            onChange={(e) => setLandingPageUrl(e.target.value)}
            bg="gray.700"
            color="whiteAlpha.800"
            _placeholder={{ color: "whiteAlpha.500" }}
            border="none"
            borderRadius="md"
            _focus={{
              bg: "gray.600",
              borderColor: "gray.500",
              boxShadow: "none",
            }}
          />
          <FormErrorMessage>{getFieldError("landingPageUrl")}</FormErrorMessage>
        </FormControl>

        <FormControl
          display="flex"
          alignItems="center"
          isInvalid={!!getFieldError("isRunning")}
        >
          <FormLabel htmlFor="is-running" mb="0">
            Is Running?
          </FormLabel>
          <Switch
            id="is-running"
            isChecked={isRunning}
            onChange={handleIsRunningChange}
            colorScheme="teal"
          />
          <Text ml={2}>{isRunning ? "Active" : "Inactive"}</Text>
          <FormErrorMessage>{getFieldError("isRunning")}</FormErrorMessage>
        </FormControl>

        {!campaign && (
          <FormControl isRequired isInvalid={!!getFieldError("payouts")}>
            <FormLabel>Payouts</FormLabel>
            {payouts.map((payout, index) => (
              <HStack key={index} mb={2}>
                <FormControl
                  isInvalid={!!getPayoutFieldError(index, "country")}
                >
                  <Select
                    placeholder="Select country"
                    value={payout.country}
                    onChange={(e) =>
                      handlePayoutChange(index, "country", e.target.value)
                    }
                    bg="gray.700"
                    color="whiteAlpha.800"
                    border="none"
                    borderRadius="md"
                    _focus={{
                      bg: "gray.600",
                      borderColor: "gray.500",
                      boxShadow: "none",
                    }}
                  >
                    {countriesOptions.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>
                    {getPayoutFieldError(index, "country")}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!getPayoutFieldError(index, "amount")}>
                  <NumberInput
                    step={0.1}
                    onChange={(valueString) =>
                      handlePayoutChange(index, "amount", valueString)
                    }
                    bg="gray.700"
                    color="whiteAlpha.800"
                    border="none"
                    borderRadius="md"
                    _focus={{
                      bg: "gray.600",
                      borderColor: "gray.500",
                      boxShadow: "none",
                    }}
                  >
                    <NumberInputField
                      bg="gray.700"
                      color="whiteAlpha.800"
                      border="none"
                      borderRadius="md"
                      _focus={{
                        bg: "gray.600",
                        borderColor: "gray.500",
                        boxShadow: "none",
                      }}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormErrorMessage>
                    {getPayoutFieldError(index, "amount")}
                  </FormErrorMessage>
                </FormControl>

                <IconButton
                  icon={<DeleteIcon />}
                  aria-label="Remove Payout"
                  onClick={() => handleRemovePayout(index)}
                  size="sm"
                  colorScheme="red"
                />
              </HStack>
            ))}
            <Button leftIcon={<AddIcon />} size="sm" onClick={handleAddPayout}>
              Add Payout
            </Button>
            {getFieldError("payouts") && (
              <FormErrorMessage mt={2}>
                {getFieldError("payouts")}
              </FormErrorMessage>
            )}
          </FormControl>
        )}
      </Stack>
    </AppModal>
  );
};

export { CampaignModal };
