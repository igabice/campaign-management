import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionRequiredModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleSubscribe = () => {
    onClose();
    navigate("/subscription");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent bg="white" color="gray.800" borderRadius="lg">
        <ModalHeader
          textAlign="center"
          borderBottomWidth="1px"
          borderColor="gray.200"
        >
          <VStack spacing={2}>
            <Text fontSize="3xl" color="yellow.400">
              👑
            </Text>
            <Text fontSize="lg" fontWeight="bold">
              Subscription Required
            </Text>
          </VStack>
        </ModalHeader>
        <ModalBody py={6} textAlign="center">
          <Text mb={4}>
            This feature requires an active subscription. Upgrade your plan to
            unlock premium features and continue building amazing campaigns.
          </Text>
          <Text fontSize="sm" color="gray.600">
            Get started with our Pro plan for advanced team collaboration,
            unlimited posts, and AI-powered content generation.
          </Text>
        </ModalBody>
        <ModalFooter
          borderTopWidth="1px"
          borderColor="gray.200"
          justifyContent="center"
        >
          <Button colorScheme="yellow" onClick={handleSubscribe} size="lg">
            👑 Upgrade to Pro
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export { SubscriptionRequiredModal };
