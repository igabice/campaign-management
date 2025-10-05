import React from "react";
import { Box, Hide, Flex } from "@chakra-ui/react";
import { AppHeader } from "./AppHeader";
import { SideMenu } from "./SideMenu";
import { Footer } from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Flex direction="column" minH="100vh">
      {/* Header */}
      <Box position="fixed" top={0} left={0} right={0} zIndex={10}>
        <AppHeader />
      </Box>

      {/* Main Content Area */}
      <Flex pt="80px" flex="1" minH="0">
        {/* Desktop Side Menu */}
        <Hide below="md">
          <Box
            w="250px"
            bg="white"
            _dark={{ bg: "gray.900" }}
            p={4}
            overflowY="auto"
            flexShrink={0}
          >
            <SideMenu />
          </Box>
        </Hide>

        {/* Main Content */}
        <Box flex="1" overflowY="auto" display="flex" flexDirection="column">
          <Box flex="1">
            {children}
          </Box>
          <Footer />
        </Box>
      </Flex>
    </Flex>
  );
};