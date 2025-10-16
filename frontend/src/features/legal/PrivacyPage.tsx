import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Divider,
  Flex,
  Spacer,
  HStack,
  Button,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  Hide,
  Show,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { HamburgerIcon } from "@chakra-ui/icons";

export const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();
  const accentColor = "#F9D71C";
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {/* Navigation */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={10}
        bg="white"
        boxShadow="md"
      >
        <Flex as="nav" p={[4, 6]} align="center" maxW="1200px" mx="auto">
          <Heading
            size="lg"
            fontWeight="bold"
            color={accentColor}
            cursor="pointer"
            onClick={() => navigate("/")}
          >
            Doka
            <span style={{ color: "black" }}>hub</span>
          </Heading>
          <Spacer />
          <Hide below="md">
            <HStack spacing={4}>
              <Button
                variant="ghost"
                onClick={() => navigate("/#features")}
                _hover={{ color: accentColor }}
              >
                Features
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/#pricing")}
                _hover={{ color: accentColor }}
              >
                Pricing
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                _hover={{ color: accentColor }}
              >
                Login
              </Button>
              <Button
                bg={accentColor}
                color="black"
                _hover={{ bg: accentColor, opacity: 0.8 }}
                onClick={() => navigate("/signup")}
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
                onClick={() => {
                  navigate("/#features");
                  onClose();
                }}
              >
                Features
              </Button>
              <Button
                variant="ghost"
                w="full"
                justifyContent="start"
                onClick={() => {
                  navigate("/#pricing");
                  onClose();
                }}
              >
                Pricing
              </Button>
              <Button
                variant="ghost"
                w="full"
                justifyContent="start"
                onClick={() => {
                  navigate("/login");
                  onClose();
                }}
              >
                Login
              </Button>
              <Button
                bg={accentColor}
                color="black"
                w="full"
                _hover={{ bg: accentColor, opacity: 0.8 }}
                onClick={() => {
                  navigate("/signup");
                  onClose();
                }}
              >
                Get Started
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Container maxW="container.md" py={12} pt={24}>
        <VStack spacing={8} align="start">
          <Heading as="h1" size="xl" color="blue.600">
            Privacy Policy
          </Heading>

          <Text fontSize="sm" color="gray.600">
            Last updated: {new Date().toLocaleDateString()}
          </Text>

          <Divider />

          <VStack spacing={6} align="start" w="full">
            <Text>
              Dokahub is committed to protecting your privacy. This Privacy
              Policy describes how Dokahub, a C-Corp incorporated in Estonia
              with its headquarters in Tallinn, Estonia ("Dokahub," "we," "us,"
              or "our"), collects, uses, and shares personal information of
              users of our website https://dokahub.com (the "Site") and our
              social media content planner & scheduling tool (the "Service").
              This Privacy Policy applies to you whether you are accessing the
              Site or using the Service in Estonia, Canada, the USA, or any
              other location.
            </Text>

            <Text>
              Please read this Privacy Policy carefully. By using the Site or
              the Service, you consent to the practices described in this
              Privacy Policy.
            </Text>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                1. Information We Collect
              </Heading>
              <Text mb={3}>We collect the following types of information:</Text>
              <VStack align="start" spacing={2}>
                <Text>
                  • <strong>Information You Provide Directly:</strong> We
                  collect information you provide directly to us, such as when
                  you create an account, update your profile, contact us, or
                  make a purchase. This information may include your name, email
                  address, phone number, postal address, username, password,
                  payment information (processed via Stripe), and any other
                  information you choose to provide.
                </Text>
                <Text>
                  • <strong>Information We Collect Automatically:</strong> We
                  automatically collect certain information when you use the
                  Site or the Service, such as your IP address, device type,
                  operating system, browser type, browsing activity, and usage
                  data. We may also collect information about your location.
                </Text>
                <Text>
                  • <strong>Information From Third Parties:</strong> We may
                  receive information about you from third parties, such as
                  social media platforms when you connect your account to our
                  Service.
                </Text>
              </VStack>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                2. How We Use Your Information
              </Heading>
              <Text mb={3}>
                We use your information for the following purposes:
              </Text>
              <VStack align="start" spacing={2}>
                <Text>
                  • <strong>To Provide and Improve the Service:</strong> We use
                  your information to operate, maintain, and improve the Site
                  and the Service, including personalizing your experience.
                </Text>
                <Text>
                  • <strong>To Communicate With You:</strong> We use your
                  information to communicate with you, such as to respond to
                  your inquiries, provide customer support, and send you updates
                  and notifications.
                </Text>
                <Text>
                  • <strong>For Marketing Purposes:</strong> With your consent
                  where required by law, we may use your information to send you
                  marketing emails about new features, products, and services.
                  You can opt out of receiving marketing emails at any time by
                  following the instructions in the email.
                </Text>
                <Text>
                  • <strong>To Process Payments:</strong> We use your payment
                  information to process payments for the Service through our
                  payment processor, Stripe.
                </Text>
                <Text>
                  • <strong>To Ensure Security:</strong> We use your information
                  to protect the security of the Site and the Service, including
                  preventing fraud and abuse.
                </Text>
                <Text>
                  • <strong>To Comply with Legal Obligations:</strong> We may
                  use your information to comply with applicable laws and
                  regulations.
                </Text>
              </VStack>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                3. How We Share Your Information
              </Heading>
              <Text mb={3}>
                We may share your information with the following parties:
              </Text>
              <VStack align="start" spacing={2}>
                <Text>
                  • <strong>Service Providers:</strong> We may share your
                  information with third-party service providers who assist us
                  in providing the Site and the Service, such as hosting
                  providers, payment processors (Stripe), and marketing
                  automation platforms.
                </Text>
                <Text>
                  • <strong>Business Partners:</strong> We may share your
                  information with business partners who offer products or
                  services that may be of interest to you.
                </Text>
                <Text>
                  • <strong>Legal Authorities:</strong> We may disclose your
                  information to legal authorities if required by law or legal
                  process.
                </Text>
                <Text>
                  • <strong>Affiliates:</strong> We may share your information
                  with our affiliates.
                </Text>
                <Text>
                  • <strong>Business Transfers:</strong> In the event of a
                  merger, acquisition, or sale of all or a portion of our
                  assets, your information may be transferred to the acquiring
                  entity.
                </Text>
              </VStack>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                4. Legal Bases for Processing (EEA and UK Users)
              </Heading>
              <Text mb={3}>
                If you are located in the European Economic Area (EEA) or the
                United Kingdom (UK), our legal bases for processing your
                personal information are as follows:
              </Text>
              <VStack align="start" spacing={2}>
                <Text>
                  • <strong>Consent:</strong> We may process your information
                  based on your consent, such as for marketing purposes. You
                  have the right to withdraw your consent at any time.
                </Text>
                <Text>
                  • <strong>Contract:</strong> We may process your information
                  to perform our contractual obligations to you, such as
                  providing the Service.
                </Text>
                <Text>
                  • <strong>Legitimate Interests:</strong> We may process your
                  information based on our legitimate interests, such as to
                  improve the Service and prevent fraud, provided that such
                  interests are not overridden by your rights and freedoms.
                </Text>
                <Text>
                  • <strong>Legal Obligation:</strong> We may process your
                  information to comply with our legal obligations.
                </Text>
              </VStack>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                5. Your Rights
              </Heading>
              <Text mb={3}>
                You have the following rights regarding your personal
                information, subject to applicable law:
              </Text>
              <VStack align="start" spacing={2}>
                <Text>
                  • <strong>Access:</strong> You have the right to access your
                  personal information.
                </Text>
                <Text>
                  • <strong>Rectification:</strong> You have the right to
                  rectify inaccurate or incomplete personal information.
                </Text>
                <Text>
                  • <strong>Erasure:</strong> You have the right to erase your
                  personal information under certain circumstances.
                </Text>
                <Text>
                  • <strong>Restriction of Processing:</strong> You have the
                  right to restrict the processing of your personal information
                  under certain circumstances.
                </Text>
                <Text>
                  • <strong>Data Portability:</strong> You have the right to
                  receive your personal information in a structured, commonly
                  used, and machine-readable format and to transmit it to
                  another controller.
                </Text>
                <Text>
                  • <strong>Objection:</strong> You have the right to object to
                  the processing of your personal information under certain
                  circumstances.
                </Text>
                <Text>
                  • <strong>Right to Withdraw Consent:</strong> If we are
                  processing your information based on your consent, you have
                  the right to withdraw your consent at any time.
                </Text>
              </VStack>
              <Text mt={3}>
                To exercise these rights, please contact us at
                contact@dokahub.com.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                6. Data Retention
              </Heading>
              <Text>
                We retain your personal information for as long as necessary to
                fulfill the purposes described in this Privacy Policy, unless a
                longer retention period is required or permitted by law.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                7. Data Security
              </Heading>
              <Text>
                We take reasonable measures to protect your personal information
                from unauthorized access, use, or disclosure. However, no method
                of transmission over the internet or method of electronic
                storage is 100% secure.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                8. International Data Transfers
              </Heading>
              <Text>
                Your information may be transferred to and processed in
                countries outside of your country of residence, including
                Estonia, Canada, and the United States. These countries may have
                data protection laws that are different from the laws of your
                country. We will take appropriate measures to protect your
                information in accordance with this Privacy Policy and
                applicable law.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                9. Children's Privacy
              </Heading>
              <Text>
                The Site and the Service are not directed to children under the
                age of 13, and we do not knowingly collect personal information
                from children under the age of 13. If you are a parent or
                guardian and believe that your child has provided us with
                personal information, please contact us at contact@dokahub.com.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                10. Changes to this Privacy Policy
              </Heading>
              <Text>
                We may update this Privacy Policy from time to time. We will
                post any changes on the Site. Your continued use of the Site or
                the Service after the effective date of the revised Privacy
                Policy constitutes your acceptance of the changes.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                11. Contact Us
              </Heading>
              <Text>
                If you have any questions about this Privacy Policy, please
                contact us at:
              </Text>
              <Text mt={2} whiteSpace="pre-line">
                Dokahub Tallinn, Estonia <br />
                Email: contact@dokahub.com
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                12. Canadian Residents
              </Heading>
              <Text>
                Canadian residents may have additional rights under the Personal
                Information Protection and Electronic Documents Act (PIPEDA) and
                applicable provincial legislation. If you have any questions or
                concerns about our privacy practices, please contact our Privacy
                Officer at contact@dokahub.com.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                13. United States Residents
              </Heading>
              <Text>
                Depending on the state in which you reside, you may have certain
                rights under applicable state privacy laws, such as the
                California Consumer Privacy Act (CCPA) or the Virginia Consumer
                Data Protection Act (CDPA). Please contact us at
                contact@dokahub.com for further information.
              </Text>
            </Box>

            <Text mt={4} fontSize="sm" color="gray.600">
              This document was generated by an AI assistant and should be
              reviewed by a qualified legal professional before use. Dokahub
              does not accept any liability for reliance on this document
              without such review.
            </Text>
          </VStack>

          <Divider />

          <Text fontSize="sm" color="gray.600">
            <RouterLink to="/" style={{ color: "#3182ce" }}>
              ← Back to Home
            </RouterLink>
          </Text>
        </VStack>
      </Container>
    </>
  );
};
