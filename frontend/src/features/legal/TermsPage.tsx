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
import { Helmet } from "react-helmet-async";

export const TermsPage: React.FC = () => {
  const navigate = useNavigate();
  const accentColor = "#F9D71C";
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Helmet>
        <title>Terms of Service - Dokahub</title>
        <meta name="description" content="Review Dokahub's terms of service to understand the rules and guidelines for using our platform." />
        <meta name="keywords" content="terms of service, terms and conditions, dokahub terms" />
        <meta property="og:title" content="Terms of Service - Dokahub" />
        <meta property="og:description" content="Review Dokahub's terms of service to understand the rules and guidelines for using our platform." />
        <meta property="og:url" content="https://dokahub.com/terms" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Terms of Service - Dokahub" />
        <meta name="twitter:description" content="Review Dokahub's terms of service to understand the rules and guidelines for using our platform." />
      </Helmet>
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
            Terms of Service
          </Heading>

          <Text fontSize="sm" color="gray.600">
            Last updated: {new Date().toLocaleDateString()}
          </Text>

          <Divider />

          <VStack spacing={6} align="start" w="full">
            <Text>Effective Date: October 16, 2025</Text>

            <Text>
              Welcome to Dokahub! These Terms of Service ("Terms") govern your
              access to and use of the Dokahub platform, website, applications,
              and related services (collectively, the "Service") provided by
              Dokahub ("we," "us," or "our"). By accessing or using the Service,
              you agree to be bound by these Terms. If you do not agree to these
              Terms, you may not access or use the Service.
            </Text>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                1. Acceptance of Terms
              </Heading>
              <Text>
                By using the Service, you represent that you are at least 18
                years old and have the legal capacity to enter into these Terms.
                If you are using the Service on behalf of an organization, you
                represent and warrant that you have the authority to bind that
                organization to these Terms.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                2. Description of Service
              </Heading>
              <Text>
                Dokahub is a social media content planning and scheduling tool
                designed for influencers and small teams to manage and
                collaborate on their social media presence. The Service allows
                users to plan, schedule, and publish content to various social
                media platforms.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                3. Account Registration
              </Heading>
              <VStack align="start" spacing={2}>
                <Text>
                  a. To use certain features of the Service, you may be required
                  to register for an account. You agree to provide accurate,
                  current, and complete information during the registration
                  process and to update such information to keep it accurate,
                  current, and complete.
                </Text>
                <Text>
                  b. You are responsible for maintaining the confidentiality of
                  your account credentials and for all activities that occur
                  under your account. You agree to notify us immediately of any
                  unauthorized access to or use of your account.
                </Text>
                <Text>
                  c. We reserve the right to suspend or terminate your account
                  if we suspect that you have violated these Terms.
                </Text>
              </VStack>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                4. Use of the Service
              </Heading>
              <VStack align="start" spacing={2}>
                <Text>
                  a. You agree to use the Service only for lawful purposes and
                  in accordance with these Terms. You agree not to:
                </Text>
                <VStack align="start" spacing={1} pl={4}>
                  <Text>
                    i. Use the Service in any way that violates any applicable
                    law or regulation.
                  </Text>
                  <Text>
                    ii. Impersonate any person or entity, or falsely state or
                    otherwise misrepresent your affiliation with a person or
                    entity.
                  </Text>
                  <Text>
                    iii. Interfere with or disrupt the Service or servers or
                    networks connected to the Service.
                  </Text>
                  <Text>
                    iv. Upload, post, or transmit any content that is unlawful,
                    harmful, threatening, abusive, harassing, tortious,
                    defamatory, vulgar, obscene, libelous, invasive of another's
                    privacy, hateful, or racially, ethnically, or otherwise
                    objectionable.
                  </Text>
                  <Text>
                    v. Collect or store personal information about other users
                    without their consent.
                  </Text>
                  <Text>
                    vi. Use any robot, spider, scraper, or other automated means
                    to access the Service for any purpose without our express
                    written permission.
                  </Text>
                </VStack>
                <Text>
                  b. You are solely responsible for the content you upload,
                  post, or transmit through the Service. You represent and
                  warrant that you have all necessary rights to such content and
                  that such content does not infringe the rights of any third
                  party.
                </Text>
              </VStack>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                5. Payment Terms
              </Heading>
              <VStack align="start" spacing={2}>
                <Text>
                  a. Certain features of the Service may require payment of
                  fees. You agree to pay all fees and charges specified in the
                  pricing plan you selected.
                </Text>
                <Text>
                  b. We use Stripe to process payments. By using the Service,
                  you agree to Stripe's terms of service and privacy policy. You
                  are responsible for providing valid payment information and
                  keeping it up to date.
                </Text>
                <Text>
                  c. All fees are non-refundable unless otherwise stated in our
                  refund policy. We reserve the right to change our fees at any
                  time, but we will provide you with reasonable notice of any
                  such changes.
                </Text>
                <Text>
                  d. If you fail to pay any fees when due, we may suspend or
                  terminate your access to the Service.
                </Text>
              </VStack>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                6. Intellectual Property
              </Heading>
              <VStack align="start" spacing={2}>
                <Text>
                  a. The Service and its original content, features, and
                  functionality are owned by Dokahub and are protected by
                  copyright, trademark, and other intellectual property laws.
                  You may not use our trademarks, logos, or other proprietary
                  graphics without our express written permission.
                </Text>
                <Text>
                  b. You retain ownership of the content you upload, post, or
                  transmit through the Service. However, by using the Service,
                  you grant us a non-exclusive, worldwide, royalty-free license
                  to use, reproduce, modify, adapt, publish, translate,
                  distribute, and display such content in connection with the
                  Service.
                </Text>
              </VStack>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                7. Data Privacy
              </Heading>
              <VStack align="start" spacing={2}>
                <Text>
                  a. We collect and use your data in accordance with our Privacy
                  Policy, which is incorporated into these Terms by reference.
                  Please review our Privacy Policy to understand our practices
                  regarding your data.
                </Text>
                <Text>
                  b. By using the Service, you consent to the collection, use,
                  and disclosure of your information as described in our Privacy
                  Policy. We may use your data for marketing purposes, including
                  sending you promotional emails and newsletters. You can opt
                  out of receiving marketing communications at any time by
                  following the instructions in our Privacy Policy.
                </Text>
                <Text>
                  c. As we operate in multiple jurisdictions, including Estonia,
                  Canada, and the USA, we strive to comply with the data privacy
                  laws of these regions, including GDPR, PIPEDA, and CCPA. We
                  are committed to protecting your personal information and
                  ensuring its confidentiality and security.
                </Text>
              </VStack>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                8. Disclaimer of Warranties
              </Heading>
              <Text>
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT
                NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO
                NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR
                ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICE
                IS FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                9. Limitation of Liability
              </Heading>
              <Text>
                IN NO EVENT SHALL DOKAHUB BE LIABLE FOR ANY INDIRECT,
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING
                OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE, WHETHER
                BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY
                OTHER LEGAL THEORY, EVEN IF WE HAVE BEEN ADVISED OF THE
                POSSIBILITY OF SUCH DAMAGES. OUR TOTAL LIABILITY TO YOU FOR ANY
                CLAIM ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR THE
                SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID TO US FOR THE
                SERVICE IN THE SIX (6) MONTHS PRECEDING THE EVENT GIVING RISE TO
                THE CLAIM.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                10. Indemnification
              </Heading>
              <Text>
                You agree to indemnify and hold Dokahub harmless from any and
                all claims, liabilities, damages, losses, and expenses
                (including reasonable attorneys' fees) arising out of or in
                connection with your use of the Service, your violation of these
                Terms, or your infringement of any intellectual property or
                other right of any person or entity.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                11. Termination
              </Heading>
              <Text>
                We may terminate your access to the Service at any time, with or
                without cause, and with or without notice. You may terminate
                your account at any time by contacting us at
                contact@dokahub.com.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                12. Governing Law
              </Heading>
              <Text>
                These Terms shall be governed by and construed in accordance
                with the laws of Estonia, without regard to its conflict of law
                principles.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                13. Dispute Resolution
              </Heading>
              <Text>
                Any dispute arising out of or in connection with these Terms
                shall be resolved through binding arbitration in accordance with
                the rules of the Estonian Chamber of Commerce and Industry. The
                arbitration shall take place in Tallinn, Estonia. The language
                of the arbitration shall be English.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                14. Changes to These Terms
              </Heading>
              <Text>
                We may modify these Terms at any time by posting the revised
                Terms on our website. Your continued use of the Service after
                the posting of the revised Terms constitutes your acceptance of
                the changes.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                15. Miscellaneous
              </Heading>
              <VStack align="start" spacing={2}>
                <Text>
                  a. These Terms constitute the entire agreement between you and
                  Dokahub regarding your use of the Service.
                </Text>
                <Text>
                  b. If any provision of these Terms is held to be invalid or
                  unenforceable, such provision shall be struck and the
                  remaining provisions shall be enforced.
                </Text>
                <Text>
                  c. Our failure to enforce any right or provision of these
                  Terms shall not constitute a waiver of such right or
                  provision.
                </Text>
                <Text>
                  d. You may not assign these Terms without our prior written
                  consent. We may assign these Terms at any time without notice
                  to you.
                </Text>
              </VStack>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                16. Contact Information
              </Heading>
              <Text>
                If you have any questions about these Terms, please contact us
                at:
              </Text>
              <Text mt={2} whiteSpace="pre-line">
                Email: contact@dokahub.com <br />
                Website: https://dokahub.com <br />
              </Text>
            </Box>
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
