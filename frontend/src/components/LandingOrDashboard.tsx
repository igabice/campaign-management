import React from "react";
import { useAuth } from "../features/auth/AuthContext";
import { HomePage } from "../features/home/HomePage";
import { Dashboard } from "../features/dashboard/Dashboard";
import { MainLayout } from "./MainLayout";
import { Box, Spinner, Text } from "@chakra-ui/react";

export const LandingOrDashboard: React.FC = () => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading...</Text>
      </Box>
    );
  }

  if (!session) {
    return <HomePage />;
  }

  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  );
};