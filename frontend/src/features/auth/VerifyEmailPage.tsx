import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Link as ChakraLink, Spinner, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError("Failed to verify email. The link may be invalid or expired.");
    }
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
        <Text mt={4}>Verifying your email...</Text>
      </Box>
    );
  }

  return (
    <Box maxW="md" mx="auto" mt={10} textAlign="center">
      <Heading mb={6}>{error ? "Verification Failed" : "Email Verified!"}</Heading>
      {error ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <Alert status="success">
          <AlertIcon />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>Your email has been successfully verified.</AlertDescription>
        </Alert>
      )}
      <Text mt={4}>
        You can now{" "}
        <ChakraLink as={RouterLink} to="/login" color="teal.500">
          login
        </ChakraLink>
        .
      </Text>
    </Box>
  );
};