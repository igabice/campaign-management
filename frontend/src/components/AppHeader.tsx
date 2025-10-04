import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer as ChakraSpacer,
  Text,
  IconButton,
  useColorMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  Link as ChakraLink,
  useDisclosure,
  Show,
  Hide,
  Spacer,
  Divider,
  Icon,
} from "@chakra-ui/react";
import {
  SunIcon,
  MoonIcon,
  ChevronDownIcon,
  HamburgerIcon,
  ViewIcon,
  CalendarIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { useAuth } from "../features/auth/AuthContext";

export const AppHeader = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();

  const handleLogout = async () => {
    await authClient.signOut();
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: ViewIcon },
    { name: "Calendar", path: "/calendar", icon: CalendarIcon },
    { name: "Team", path: "/team", icon: SettingsIcon },
    { name: "Profile", path: "/profile", icon: SettingsIcon },
  ];

  return (
    <>
      <Flex
        align="center"
        justify="space-between"
        p={4}
        bg={colorMode === "light" ? "gray.100" : "gray.900"}
        color={colorMode === "light" ? "black" : "whiteAlpha.900"}
        boxShadow="md"
        position="relative"
        zIndex={10}
      >
        <Flex align="center">
          <Show below="md">
            <IconButton
              aria-label="Open menu"
              icon={<HamburgerIcon />}
              onClick={onOpen}
              mr={2}
              variant="ghost"
            />
          </Show>
          <Hide below="md">
            <Box fontSize="2xl" fontWeight="bold">
              <Heading>Campaign Manager</Heading>
            </Box>
          </Hide>
        </Flex>
        <Spacer />
        <Flex align="center">
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            mr={4}
            variant="ghost"
          />
          {session && (
            <Menu placement="bottom-end">
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                variant="ghost"
              >
                {session.user.name || session.user.email}
              </MenuButton>
              <MenuList zIndex={9999}>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" h="full">
              {menuItems.map((item) => (
                <ChakraLink
                  key={item.path}
                  as={RouterLink}
                  to={item.path}
                  p={2}
                  borderRadius="md"
                  bg={
                    location.pathname === item.path
                      ? colorMode === "light"
                        ? "blue.100"
                        : "blue.800"
                      : "transparent"
                  }
                  _hover={{
                    bg: colorMode === "light" ? "blue.50" : "blue.700",
                  }}
                  onClick={onClose}
                  display="flex"
                  alignItems="center"
                >
                  <Icon as={item.icon} mr={2} />
                  {item.name}
                </ChakraLink>
              ))}
              <ChakraSpacer />
              <Divider />
              <Text fontSize="sm" color="gray.500">
                Subscription Plan: Basic
              </Text>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
