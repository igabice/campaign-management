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
import { loginSchema } from "./schemas";
import { authClient } from "../../lib/auth-client";
import { useAuth } from "./AuthContext";
import { useEffect } from "react";
import { Spinner } from "@chakra-ui/react";
import { FaGoogle, FaFacebook } from "react-icons/fa";

type LoginFormInputs = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const toast = useToast();
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();
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
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    await authClient.signIn.email(data, {
      onSuccess: () => {
        // Session will be updated, useEffect will navigate
      },
      onError: (ctx) => {
        toast({
          title: "Error",
          description: ctx.error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
    });
  };

  const handleGoogleLogin = async () => {
    localStorage.setItem("socialLoginInitiated", "true");
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/dashboard`,
    });
    if (error) {
      localStorage.removeItem("socialLoginInitiated");
      toast({
        title: "Login Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleFacebookLogin = async () => {
    localStorage.setItem("socialLoginInitiated", "true");
    const { error } = await authClient.signIn.social({
      provider: "facebook",
      callbackURL: `${window.location.origin}/dashboard`,
    });
    if (error) {
      localStorage.removeItem("socialLoginInitiated");
      toast({
        title: "Login Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Box textAlign="center" mt={10} px={4}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box maxW="md" mx="auto" mt={10} px={4}>
      <Box textAlign="center" mb={8}>
        <ChakraLink as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
          <Heading size="lg" color={accentColor} mb={2}>
            Dokahub
          </Heading>
        </ChakraLink>
      </Box>
      <Heading textAlign="center" mb={6}>
        Login
      </Heading>
      <Box as="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={4}>
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
          <Button
            type="submit"
            isLoading={isSubmitting}
            bg={accentColor}
            color="black"
            _hover={{ bg: accentColor, opacity: 0.8 }}
          >
            Login
          </Button>
        </Stack>
      </Box>
      <Text textAlign="center" mt={4} mb={2}>
        or
      </Text>
      <Stack spacing={2}>
        <Button
          onClick={handleGoogleLogin}
          bg="white"
          color="black"
          border="1px"
          borderColor="gray.300"
          display="flex"
          alignItems="center"
          gap={2}
        >
          {/* @ts-ignore */}
          <FaGoogle color="#e85252" /> Google
        </Button>
        <Button
          onClick={handleFacebookLogin}
          bg="white"
          color="black"
          border="1px"
          borderColor="gray.300"
          display="flex"
          alignItems="center"
          gap={2}
        >
          {/* @ts-ignore */}
          <FaFacebook color="#5858e7" /> Facebook
        </Button>
      </Stack>
      <Text mt={4} textAlign="center">
        Don't have an account?{" "}
        <ChakraLink as={RouterLink} to="/signup" color={accentColor}>
          Sign up
        </ChakraLink>
      </Text>
      <Text mt={2} textAlign="center">
        <ChakraLink as={RouterLink} to="/forgot-password" color={accentColor}>
          Forgot password?
        </ChakraLink>
      </Text>
    </Box>
  );
};
