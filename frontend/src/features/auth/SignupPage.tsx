import React from "react";
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
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { z } from "zod";
import { signupSchema } from "./schemas";
import { authClient } from "../../lib/auth-client";
import { useAuth } from "./AuthContext";
import { useEffect } from "react";
import { Spinner } from "@chakra-ui/react";

type SignupFormInputs = z.infer<typeof signupSchema>;

export const SignupPage: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { session, isLoading } = useAuth();
  const accentColor = "#F9D71C";

  useEffect(() => {
    if (session) {
      navigate("/dashboard");
    }
  }, [session, navigate]);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormInputs) => {
    const { error } = await authClient.signUp.email(data);
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
        title: "Account created.",
        description: "Please check your email to verify your account.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/dashboard");
    }
  };

  const handleGoogleSignup = async () => {
    localStorage.setItem("socialLoginInitiated", "true");
    const { error } = await authClient.signIn.social({ provider: "google" });
    if (error) {
      localStorage.removeItem("socialLoginInitiated");
      toast({
        title: "Signup Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleFacebookSignup = async () => {
    localStorage.setItem("socialLoginInitiated", "true");
    const { error } = await authClient.signIn.social({ provider: "facebook" });
    if (error) {
      localStorage.removeItem("socialLoginInitiated");
      toast({
        title: "Signup Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box maxW="md" mx="auto" mt={10}>
      <Box textAlign="center" mb={8}>
        <ChakraLink
          as={RouterLink}
          to="/"
          _hover={{ textDecoration: "none" }}
        >
          <Heading size="lg" color={accentColor} mb={2}>
            CampaignPro
          </Heading>
        </ChakraLink>
      </Box>
      <Heading textAlign="center" mb={6}>
        Sign Up
      </Heading>
      <Box as="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={4}>
          <FormControl isInvalid={!!errors.name}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input id="name" type="text" {...register("name")} />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input id="email" type="email" {...register("email")} />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input id="password" type="password" {...register("password")} />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>
          <Button type="submit" isLoading={isSubmitting} bg={accentColor} color="black" _hover={{ bg: accentColor, opacity: 0.8 }}>
            Sign Up with Email
          </Button>
        </Stack>
      </Box>
      <Stack spacing={2} mt={4}>
        <Button onClick={handleGoogleSignup} colorScheme="red">
          Sign up with Google
        </Button>
        <Button onClick={handleFacebookSignup} colorScheme="facebook">
          Sign up with Facebook
        </Button>
      </Stack>
      <Text mt={4} textAlign="center">
        Already have an account?{" "}
        <ChakraLink as={RouterLink} to="/login" color={accentColor}>
          Login
        </ChakraLink>
      </Text>
    </Box>
  );
};
