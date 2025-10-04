import React from "react";
import { Box, Hide, Text } from "@chakra-ui/react";
import { SideMenu } from "../../components/SideMenu";
import { useColorMode } from "@chakra-ui/react";

const Dashboard: React.FC = () => {
  const { colorMode } = useColorMode();

  return (
    <>
      {/* Desktop Side Menu */}
      <Hide below="md">
        <Box
          position="fixed"
          top="80px"
          left={0}
          w="250px"
          h="calc(100vh - 80px)"
          bg={colorMode === "light" ? "gray.100" : "gray.900"}
          p={4}
          zIndex={1000}
        >
          <SideMenu />
        </Box>
      </Hide>

      {/* Main Content */}
      <Box ml={{ base: 0, md: "250px" }} p={4}>
        <Text fontSize="2xl">Dashboard</Text>
        <Text>Welcome to your dashboard!</Text>
        {/* TODO: Add content based on selected menu item */}
      </Box>
    </>
  );
};

export { Dashboard };
