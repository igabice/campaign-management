import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  Link as ChakraLink,
  useToast,
} from "@chakra-ui/react";
import {
  Link as RouterLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { z } from "zod";
import { resetPasswordSchema } from "./schemas";
import { authClient } from "../../lib/auth-client";

type ResetPasswordFormInputs = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      toast({
        title: "Error",
        description: "Invalid or missing password reset token.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      navigate("/login");
    }
  }, [searchParams, navigate, toast]);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormInputs>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormInputs) => {
    if (!token) return;

    const { error } = await authClient.resetPassword({
      token,
      newPassword: data.password,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Password reset successful.",
        description: "You can now log in with your new password.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/login");
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10}>
      <Box textAlign="center" mb={8}>
        <ChakraLink as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
          <Heading size="lg" color="teal.500" mb={2}>
            Dokahub
          </Heading>
        </ChakraLink>
      </Box>
      <Heading textAlign="center" mb={6}>
        Reset Password
      </Heading>
      {token ? (
        <Box as="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={4}>
            <FormControl isInvalid={!!errors.password}>
              <FormLabel htmlFor="password">New Password</FormLabel>
              <Input id="password" type="password" {...register("password")} />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.confirmPassword}>
              <FormLabel htmlFor="confirmPassword">
                Confirm New Password
              </FormLabel>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
              />
              <FormErrorMessage>
                {errors.confirmPassword?.message}
              </FormErrorMessage>
            </FormControl>
            <Button type="submit" isLoading={isSubmitting} colorScheme="teal">
              Reset Password
            </Button>
          </Stack>
        </Box>
      ) : (
        <Text textAlign="center">Loading...</Text>
      )}
    </Box>
  );
};
