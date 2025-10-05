import React, { useState, useEffect } from "react";
import {
  VStack,
  HStack,
  Link as ChakraLink,
  Text,
  Divider,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Badge,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useColorMode } from "@chakra-ui/react";
import { useTeam } from "../contexts/TeamContext";
import { CreateTeamModal } from "./modals/CreateTeamModal";
import { subscriptionService } from "../services/subscription";
import {
  LayoutDashboard,
  Calendar,
  Users,
  User,
  FileText,
  CreditCard,
} from "lucide-react";

interface SideMenuItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
}

interface SideMenuProps {
  onClose?: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ onClose }) => {
  const location = useLocation();
  const { colorMode } = useColorMode();
  const {
    activeTeam,
    teams: teamList,
    setActiveTeam,
    refreshTeams,
  } = useTeam();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState<any>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await subscriptionService.getActive();
        setActiveSubscription(response.subscription);
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
      }
    };

    fetchSubscription();
  }, []);

  const menuItems: SideMenuItem[] = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Calendar", path: "/calendar", icon: Calendar },
    { name: "Content Planner", path: "/content-planner", icon: FileText },
    { name: "Team", path: "/team", icon: Users },
    { name: "Subscription", path: "/subscription", icon: CreditCard },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <VStack spacing={4} align="stretch" h="full">
      {/* <Text fontSize="xl" fontWeight="bold">
        Menu
      </Text> */}
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          variant="ghost"
          size="sm"
          w="full"
          justifyContent="flex-start"
        >
          {activeTeam ? activeTeam.title : "Select Team"}
        </MenuButton>
        <MenuList zIndex={10000}>
          {teamList.map((team) => (
            <MenuItem
              key={team.id}
              onClick={() => setActiveTeam(team)}
            >
              {team.title}
            </MenuItem>
          ))}
          <MenuItem onClick={() => setIsCreateModalOpen(true)}>
            Add New Team
          </MenuItem>
        </MenuList>
      </Menu>
      <Divider />
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
          _hover={{ bg: colorMode === "light" ? "blue.50" : "blue.700" }}
          display="flex"
          alignItems="center"
          onClick={onClose}
        >
          <item.icon size={18} style={{ marginRight: 8 }} />
          {item.name}
        </ChakraLink>
      ))}
      <Spacer />
      <Divider />
      <VStack spacing={1} align="start">
        <Text fontSize="sm" color="gray.500">
          Subscription Plan:
        </Text>
        <HStack>
          <Text fontSize="sm" fontWeight="medium" color="white">
            {activeSubscription ? activeSubscription.plan : 'Free'}
          </Text>
          {activeSubscription && (
            <Badge
              size="sm"
              colorScheme={activeSubscription.status === 'active' ? 'green' : 'yellow'}
              fontSize="xs"
            >
              {activeSubscription.status}
            </Badge>
          )}
        </HStack>
      </VStack>

      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTeamCreated={(newTeam) => {
          refreshTeams();
          setActiveTeam(newTeam);
        }}
      />
    </VStack>
  );
};
