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
  Icon,
} from "@chakra-ui/react";
import { FaCrown } from "react-icons/fa";
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
      <ModalContent bg="gray.800" color="whiteAlpha.900" borderRadius="lg">
        <ModalHeader textAlign="center" borderBottomWidth="1px" borderColor="gray.700">
          <VStack spacing={2}>
            <Icon as={FaCrown} color="yellow.400" boxSize={8} />
            <Text fontSize="lg" fontWeight="bold">
              Subscription Required
            </Text>
          </VStack>
        </ModalHeader>
        <ModalBody py={6} textAlign="center">
          <Text mb={4}>
            This feature requires an active subscription. Upgrade your plan to unlock premium features and continue building amazing campaigns.
          </Text>
          <Text fontSize="sm" color="gray.400">
            Get started with our Pro plan for advanced team collaboration, unlimited posts, and AI-powered content generation.
          </Text>
        </ModalBody>
        <ModalFooter borderTopWidth="1px" borderColor="gray.700" justifyContent="center">
          <Button
            colorScheme="yellow"
            onClick={handleSubscribe}
            size="lg"
            leftIcon={<FaCrown />}
          >
            Upgrade to Pro
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export { SubscriptionRequiredModal };