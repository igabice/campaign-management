import React from "react";
import {
  VStack,
  Link as ChakraLink,
  Text,
  Divider,
  Spacer,
  Icon,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { ViewIcon, CalendarIcon, UsersIcon, SettingsIcon } from "@chakra-ui/icons";
import { useColorMode } from "@chakra-ui/react";

interface MenuItem {
  name: string;
  path: string;
  icon: React.ComponentType;
}

interface SideMenuProps {
  onClose?: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ onClose }) => {
  const location = useLocation();
  const { colorMode } = useColorMode();

  const menuItems: MenuItem[] = [
    { name: "Dashboard", path: "/dashboard", icon: ViewIcon },
    { name: "Calendar", path: "/calendar", icon: CalendarIcon },
    { name: "Team", path: "/team", icon: UsersIcon },
    { name: "Profile", path: "/profile", icon: SettingsIcon },
  ];

  return (
    <VStack spacing={4} align="stretch" h="full">
      <Text fontSize="xl" fontWeight="bold">
        Menu
      </Text>
      <Divider />
      {menuItems.map((item) => (
        <ChakraLink
          key={item.path}
          as={RouterLink}
          to={item.path}
          p={2}
          borderRadius="md"
          bg={location.pathname === item.path ? (colorMode === "light" ? "blue.100" : "blue.800") : "transparent"}
          _hover={{ bg: colorMode === "light" ? "blue.50" : "blue.700" }}
          display="flex"
          alignItems="center"
          onClick={onClose}
        >
          <Icon as={item.icon} mr={2} />
          {item.name}
        </ChakraLink>
      ))}
      <Spacer />
      <Divider />
      <Text fontSize="sm" color="gray.500">
        Subscription Plan: Basic
      </Text>
    </VStack>
  );
};