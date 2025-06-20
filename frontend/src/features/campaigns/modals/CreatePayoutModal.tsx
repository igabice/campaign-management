import React, { useState, useCallback } from "react";
import {
  FormControl,
  FormLabel,
  Stack,
  NumberInput,
  NumberInputField,
  Select,
  FormErrorMessage,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
} from "@chakra-ui/react";
import { z } from "zod";
import { AppModal } from "../../../components/modals/AppModal";
import { PayoutSchema } from "../../../types/schemas";
import { countriesOptions } from "../../../services/country";
import { payoutsApi } from "../../../services/payouts";
import { Campaign } from "../../../types/commons";

interface CreatePayoutModalProps {
  campaign: Campaign;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const CreatePayoutModal: React.FC<CreatePayoutModalProps> = ({
  isOpen,
  onClose,
  onSave,
  campaign,
}) => {
  const toast = useToast();
  const [country, setCountry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [formErrors, setFormErrors] = useState<z.ZodIssue[]>([]);

  const excludedCountrySet = campaign.payouts.map(({ country }) => country);

  const options = countriesOptions
    .filter(
      (option) =>
        !excludedCountrySet.includes(option.value) || option.value === country
    )
    .map((countryOption) => (
      <option key={countryOption.value} value={countryOption.value}>
        {countryOption.label}
      </option>
    ));

  const getFieldError = useCallback(
    (fieldName: string) => {
      const error = formErrors.find((err) => err.path[0] === fieldName);
      return error ? error.message : "";
    },
    [formErrors]
  );

  const handleCountryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setCountry(e.target.value);
      setFormErrors([]);
    },
    []
  );

  const handleAmountChange = useCallback((valueString: string) => {
    const parsedValue = parseFloat(valueString);
    setAmount(isNaN(parsedValue) ? 0 : parsedValue);
    setFormErrors([]);
  }, []);

  const handleSubmit = async () => {
    const payoutData = {
      campaignId: campaign.id,
      country,
      amount,
    };

    const validationResult = PayoutSchema.safeParse(payoutData);

    if (!validationResult.success) {
      setFormErrors(validationResult.error.issues);
      return;
    }

    setFormErrors([]);
    setIsLoading(true);
    try {
      await payoutsApi.createPayout(payoutData);
      setCountry("");
      onSave();
    } catch (error: any) {
      toast({
        title: "Error creating payout",
        description:
          error?.message || "Something went wrong while saving the payout.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <AppModal
      title="Create New Payout"
      isOpen={isOpen}
      onCancel={onClose}
      onSubmit={handleSubmit}
      successButtonLabel="Create Payout"
      isSuccessButtonLoading={isLoading}
      isSuccessButtonDisabled={isLoading}
    >
      <Stack spacing={3}>
        <FormControl isRequired isInvalid={!!getFieldError("country")}>
          <FormLabel>Country</FormLabel>
          <Select
            placeholder="Select country"
            value={country}
            onChange={handleCountryChange}
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
            {options}
          </Select>
          <FormErrorMessage>{getFieldError("country")}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!getFieldError("amount")}>
          <FormLabel>Amount ($)</FormLabel>
          <NumberInput
            step={0.1}
            onChange={handleAmountChange}
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

          <FormErrorMessage>{getFieldError("amount")}</FormErrorMessage>
        </FormControl>
      </Stack>
    </AppModal>
  );
};

export { CreatePayoutModal };
