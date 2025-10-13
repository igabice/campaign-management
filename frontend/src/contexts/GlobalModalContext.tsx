import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { SubscriptionRequiredModal } from "../components/modals/SubscriptionRequiredModal";

type ModalType = "subscription-required" | null;

interface GlobalModalContextType {
  showModal: (type: ModalType) => void;
  hideModal: () => void;
}

const GlobalModalContext = createContext<GlobalModalContextType | undefined>(undefined);

export const useGlobalModal = () => {
  const context = useContext(GlobalModalContext);
  if (!context) {
    throw new Error("useGlobalModal must be used within a GlobalModalProvider");
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const GlobalModalProvider: React.FC<Props> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const showModal = (type: ModalType) => {
    setActiveModal(type);
  };

  const hideModal = () => {
    setActiveModal(null);
  };

  useEffect(() => {
    const handleShowSubscriptionModal = () => {
      showModal("subscription-required");
    };

    window.addEventListener('show-subscription-modal', handleShowSubscriptionModal);

    return () => {
      window.removeEventListener('show-subscription-modal', handleShowSubscriptionModal);
    };
  }, []);

  return (
    <GlobalModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <SubscriptionRequiredModal
        isOpen={activeModal === "subscription-required"}
        onClose={hideModal}
      />
    </GlobalModalContext.Provider>
  );
};