import { Box, Button, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { useAuth } from "../features/auth/AuthContext";

export const AppHeader = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authClient.signOut();
    navigate("/login");
  };

  return (
    <>
      <Flex
        align="center"
        justify="space-between"
        p={4}
        bg="gray.800"
        color="whiteAlpha.900"
        boxShadow="md"
      >
        <Box fontSize="2xl" fontWeight="bold">
          <Heading>Campaign Manager</Heading>
        </Box>
        <Spacer />
        {session && (
          <Flex align="center">
            <Text mr={4}>Welcome, {session.user.name || session.user.email}</Text>
            <Button colorScheme="teal" onClick={handleLogout}>
              Logout
            </Button>
          </Flex>
        )}
      </Flex>
    </>
  );
};