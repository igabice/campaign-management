import React from "react";
import {
  Box,
  Flex,
  Heading,
  Spacer,
  HStack,
  Button,
  IconButton,
  Hide,
  Show,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  VStack,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";

interface HomeHeaderProps {
  onScrollToSection?: (section: string) => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onScrollToSection }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = "white";
  const accentColor = "#F9D71C";

  const handleNavigation = (path: string) => {
    if (path.startsWith("#") && onScrollToSection) {
      onScrollToSection(path.substring(1));
    } else {
      navigate(path);
    }
    onClose();
  };

  return (
    <>
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={10}
        bg={bgColor}
        boxShadow="md"
      >
        <Flex as="nav" p={[4, 6]} align="center" maxW="1200px" mx="auto">
          <Heading size="lg" fontWeight="bold" color={accentColor}>
            Doka
            <span style={{ color: "black" }}>hub</span>
          </Heading>
          <Spacer />
          <Hide below="md">
            <HStack spacing={4}>
              <Button
                variant="ghost"
                onClick={() => handleNavigation("#features")}
                _hover={{ color: accentColor }}
              >
                Features
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleNavigation("#pricing")}
                _hover={{ color: accentColor }}
              >
                Pricing
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleNavigation("/blog")}
                _hover={{ color: accentColor }}
              >
                Blog
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleNavigation("/login")}
                _hover={{ color: accentColor }}
              >
                Login
              </Button>
              <Button
                bg={accentColor}
                color="black"
                _hover={{ bg: accentColor, opacity: 0.8 }}
                onClick={() => handleNavigation("/signup")}
              >
                Get Started
              </Button>
            </HStack>
          </Hide>
          <Show below="md">
            <IconButton
              aria-label="Open menu"
              icon={<HamburgerIcon />}
              variant="ghost"
              onClick={onOpen}
            />
          </Show>
        </Flex>
      </Box>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody pt={16}>
            <VStack spacing={6} align="start">
              <Button
                variant="ghost"
                w="full"
                justifyContent="start"
                onClick={() => handleNavigation("#features")}
              >
                Features
              </Button>
              <Button
                variant="ghost"
                w="full"
                justifyContent="start"
                onClick={() => handleNavigation("#pricing")}
              >
                Pricing
              </Button>
              <Button
                variant="ghost"
                w="full"
                justifyContent="start"
                onClick={() => handleNavigation("/blog")}
              >
                Blog
              </Button>
              <Button
                variant="ghost"
                w="full"
                justifyContent="start"
                onClick={() => handleNavigation("/login")}
              >
                Login
              </Button>
              <Button
                bg={accentColor}
                color="black"
                w="full"
                _hover={{ bg: accentColor, opacity: 0.8 }}
                onClick={() => handleNavigation("/signup")}
              >
                Get Started
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};