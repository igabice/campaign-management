import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Box, Spinner, Text } from "@chakra-ui/react";
import { TeamProvider } from "../../contexts/TeamContext";

export const ProtectedRoute: React.FC = () => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading session...</Text>
      </Box>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <TeamProvider>
      <Outlet />
    </TeamProvider>
  );
};