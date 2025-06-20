import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

interface Props {
  title: string;
  onCancel: () => void;
  isOpen: boolean;
  onSubmit: () => void;
  children?: React.ReactNode;
  successButtonLabel?: string;
  successButtonColorScheme?: string;
  isSuccessButtonDisabled?: boolean;
  isSuccessButtonLoading?: boolean;
}

const AppModal: React.FC<Props> = ({
  title,
  onCancel,
  isOpen,
  onSubmit,
  children,
  successButtonLabel = "Submit",
  successButtonColorScheme = "blue",
  isSuccessButtonDisabled = false,
  isSuccessButtonLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} isCentered>
      <ModalOverlay />
      <ModalContent bg="gray.800" color="whiteAlpha.900" borderRadius="lg">
        <ModalHeader borderBottomWidth="1px" borderColor="gray.700">
          {title}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>{children}</ModalBody>
        <ModalFooter borderTopWidth="1px" borderColor="gray.700">
          <Button
            onClick={onCancel}
            mr={3}
            variant="ghost"
            colorScheme="whiteAlpha"
          >
            Cancel
          </Button>
          <Button
            colorScheme={successButtonColorScheme}
            onClick={onSubmit}
            isDisabled={isSuccessButtonDisabled}
            isLoading={isSuccessButtonLoading}
          >
            {successButtonLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export { AppModal };
