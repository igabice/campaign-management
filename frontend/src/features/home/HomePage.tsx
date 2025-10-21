import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Icon,
  Grid,
  Link,
  useColorModeValue,
  usePrefersReducedMotion,
  Flex,
  Spacer,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  Hide,
  Show,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  CheckCircleIcon,
  HamburgerIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";

// Animation keyframes
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

export const HomePage = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = "white";
  const textColor = "gray.900";
  const accentColor = "#F9D71C";
  const featureTextColor = "gray.600";

  const [isVisible, setIsVisible] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  const featuresRef = useRef<HTMLDivElement>(null);
  const [featuresVisible, setFeaturesVisible] = useState(false);

  const demoRef = useRef<HTMLDivElement>(null);
  const [demoVisible, setDemoVisible] = useState(false);

  const pricingRef = useRef<HTMLDivElement>(null);
  const [pricingVisible, setPricingVisible] = useState(false);

  const ctaRef = useRef<HTMLDivElement>(null);
  const [ctaVisible, setCtaVisible] = useState(false);

  const footerRef = useRef<HTMLDivElement>(null);
  const [footerVisible, setFooterVisible] = useState(false);

  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "monthly"
  );

  // Image viewer modal state
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Feature images data
  const featureImages = [
    {
      src: "/images/features/content-plan.png",
      alt: "Plan Your Social Media Content with AI",
      title: "Plan Your Social Media Content with AI",
    },
    {
      src: "/images/features/content-calendar.png",
      alt: "Social Media Calendar View",
      title: "Social Media Calendar View",
    },
    {
      src: "/images/features/team-invite.png",
      alt: "Team Collaboration",
      title: "Team Collaboration",
    },
    {
      src: "/images/features/dashboard-analytics.png",
      alt: "Smart Reminders",
      title: "Smart Reminders",
    },
    {
      src: "/images/features/social-sharing.png",
      alt: "Social Media Sharing",
      title: "Social Media Sharing",
    },
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (entry.target === heroRef.current) setHeroVisible(true);
          if (entry.target === featuresRef.current) setFeaturesVisible(true);
          if (entry.target === demoRef.current) setDemoVisible(true);
          if (entry.target === pricingRef.current) setPricingVisible(true);
          if (entry.target === ctaRef.current) setCtaVisible(true);
          if (entry.target === footerRef.current) setFooterVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (demoRef.current) observer.observe(demoRef.current);
    if (pricingRef.current) observer.observe(pricingRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);
    if (footerRef.current) observer.observe(footerRef.current);
    // Handle initial intersections
    const checkInitial = (
      ref: React.RefObject<HTMLDivElement | null>,
      setVisible: (value: boolean) => void
    ) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const isIntersecting = rect.top < window.innerHeight && rect.bottom > 0;
        if (isIntersecting) setVisible(true);
      }
    };
    checkInitial(heroRef, setHeroVisible);
    checkInitial(featuresRef, setFeaturesVisible);
    checkInitial(demoRef, setDemoVisible);
    checkInitial(pricingRef, setPricingVisible);
    checkInitial(ctaRef, setCtaVisible);
    checkInitial(footerRef, setFooterVisible);
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  // Image viewer functions
  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setIsImageViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % featureImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + featureImages.length) % featureImages.length
    );
  };

  const animationProps = prefersReducedMotion
    ? {}
    : {
        animation: `${fadeInUp} 0.8s ease-out`,
      };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Dokahub",
    url: "https://dokahub.com",
    description:
      "End social media content chaos with AI-powered planning and scheduling.",
    logo: "https://dokahub.com/logo192.png",
    sameAs: [],
  };

  return (
    <>
      <Helmet>
        <title>
          Dokahub - End Social Media Content Chaos with AI-Powered Planning
        </title>
        <meta
          name="description"
          content="Stop scrambling for social media posts. Plan weeks ahead with AI, collaborate seamlessly with teams, and automate your social media scheduling."
        />
        <meta
          name="keywords"
          content="social media calendar, social media automation, AI content planning, team collaboration, social media scheduling"
        />
        <meta
          property="og:title"
          content="Dokahub - End Social Media Content Chaos with AI-Powered Planning"
        />
        <meta
          property="og:description"
          content="Stop scrambling for social media posts. Plan weeks ahead with AI, collaborate seamlessly with teams, and automate your social media scheduling."
        />
        <meta property="og:image" content="https://dokahub.com/logo192.png" />
        <meta property="og:url" content="https://dokahub.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Dokahub - End Social Media Content Chaos with AI-Powered Planning"
        />
        <meta
          name="twitter:description"
          content="Stop scrambling for social media posts. Plan weeks ahead with AI, collaborate seamlessly with teams, and automate your social media scheduling."
        />
        <meta name="twitter:image" content="https://dokahub.com/logo192.png" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <Box
        bg={bgColor}
        color={textColor}
        minH="100vh"
        overflowX="hidden"
        pt="24"
      >
        {/* Navigation */}
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
                  onClick={() => scrollToSection("features")}
                  _hover={{ color: accentColor }}
                >
                  Features
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => scrollToSection("pricing")}
                  _hover={{ color: accentColor }}
                >
                  Pricing
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/blog")}
                  _hover={{ color: accentColor }}
                >
                  Blog
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
                    scrollToSection("features");
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
                    scrollToSection("pricing");
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
                    navigate("/blog");
                    onClose();
                  }}
                >
                  Blog
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

        {/* Hero Section - PROBLEM & SOLUTION */}
        <Box
          ref={heroRef}
          py={20}
          position="relative"
          opacity={heroVisible ? 1 : 0}
        >
          <Container maxW="1200px" position="relative" zIndex={2}>
            <VStack spacing={8} textAlign="center">
              <Box {...animationProps} opacity={isVisible ? 1 : 0}>
                <Heading
                  size="4xl"
                  fontWeight="black"
                  lineHeight="0.9"
                  mb={6}
                  fontSize={["4xl", "5xl", "6xl", "7xl"]}
                >
                  Tired of Social Media
                  <br />
                  <Text as="span" color={accentColor}>
                    Content Chaos?
                  </Text>
                </Heading>

                <Text
                  fontSize={["lg", "xl", "2xl"]}
                  maxW="600px"
                  mx="auto"
                  mb={8}
                  lineHeight="1.6"
                >
                  Are you scrambling for last-minute social media posts, missing
                  deadlines, and struggling with messy collaborations?
                  <strong> DokaHub eliminates the stress</strong> with
                  AI-powered social media planning that lets you
                  <strong> plan weeks ahead</strong> and collaborate seamlessly
                  across all platforms.
                </Text>

                <HStack spacing={4} justify="center" flexWrap="wrap">
                  <Button
                    size="lg"
                    bg="black"
                    color="white"
                    px={8}
                    py={4}
                    fontSize="lg"
                    fontWeight="bold"
                    _hover={{
                      bg: "white",
                      opacity: 0.9,
                      color: "black",
                      transform: "translateY(-2px)",
                      animation: prefersReducedMotion
                        ? undefined
                        : `${pulse} 0.3s ease-in-out`,
                    }}
                    transition="all 0.3s"
                    onClick={() => navigate("/signup")}
                  >
                    Start Free Trial
                  </Button>
                  <Button
                    size="lg"
                    bg={accentColor}
                    variant="outline"
                    borderColor="black"
                    color="black"
                    px={8}
                    py={4}
                    fontSize="lg"
                    _hover={{
                      bg: "black",
                      color: "white",
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.3s"
                    onClick={() => scrollToSection("demo")}
                  >
                    See How It Works
                  </Button>
                </HStack>
              </Box>
            </VStack>
          </Container>
        </Box>

        {/* Demo Video Section - FROM PROBLEM TO SOLUTION */}
        <Box
          id="demo"
          ref={demoRef}
          bg="gray.100"
          py={20}
          opacity={demoVisible ? 1 : 0}
          transition="opacity 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
        >
          <Container maxW="1200px">
            <VStack spacing={12}>
              <Box textAlign="center" maxW="800px" mx="auto">
                <Heading
                  size="3xl"
                  fontWeight="black"
                  mb={4}
                  fontSize={["2xl", "3xl", "4xl"]}
                >
                  From Social Media Chaos to Calendar Control
                </Heading>
                <Text fontSize={["md", "lg", "xl"]} color="gray.600" mb={8}>
                  See how DokaHub transforms last-minute social media scrambling
                  into strategic, stress-free planning with automated scheduling
                  and team collaboration.
                </Text>
              </Box>

              <Box
                w="full"
                maxW="900px"
                mx="auto"
                borderRadius="xl"
                overflow="hidden"
                boxShadow="2xl"
                {...(prefersReducedMotion
                  ? {}
                  : {
                      animation: `${slideInLeft} 0.8s ease-out`,
                      opacity: isVisible ? 1 : 0,
                    })}
              >
                <Box
                  bg="gray.200"
                  h={["250px", "400px", "500px"]}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  _hover={{
                    "& > .play-button": {
                      transform: "scale(1.1)",
                    },
                  }}
                  transition="all 0.3s"
                  cursor="pointer"
                  onClick={() => {
                    const demoVideoUrl = "#";
                    window.open(demoVideoUrl, "_blank");
                  }}
                >
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bgGradient="linear(to-br, purple.200, blue.200)"
                    opacity={0.8}
                  />

                  <Box
                    className="play-button"
                    w={20}
                    h={20}
                    bg="white"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow="lg"
                    transition="all 0.3s"
                    position="relative"
                    zIndex={2}
                  >
                    <Box
                      w={0}
                      h={0}
                      borderLeft="12px solid"
                      borderLeftColor="black"
                      borderTop="8px solid transparent"
                      borderBottom="8px solid transparent"
                      ml={1}
                    />
                  </Box>

                  <VStack
                    position="absolute"
                    bottom={6}
                    left={6}
                    right={6}
                    align="start"
                    spacing={2}
                    zIndex={2}
                  >
                    <Text
                      color="white"
                      fontSize="lg"
                      fontWeight="bold"
                      textShadow="0 2px 4px rgba(0,0,0,0.5)"
                    >
                      From Social Media Chaos to Control in 2 Minutes
                    </Text>
                    <Text
                      color="white"
                      fontSize="sm"
                      opacity={0.9}
                      textShadow="0 2px 4px rgba(0,0,0,0.5)"
                    >
                      2:34 • See the transformation
                    </Text>
                  </VStack>
                </Box>
              </Box>

              <HStack spacing={6} flexWrap="wrap" justify="center">
                <VStack spacing={2} align="center" minW="150px">
                  <Text fontSize="3xl" fontWeight="bold" color={accentColor}>
                    10x
                  </Text>
                  <Text fontSize="sm" color={"gray.600"} textAlign="center">
                    Faster social media planning
                  </Text>
                </VStack>
                <VStack spacing={2} align="center" minW="150px">
                  <Text fontSize="3xl" fontWeight="bold" color={accentColor}>
                    80%
                  </Text>
                  <Text fontSize="sm" color={"gray.600"} textAlign="center">
                    Less social media stress
                  </Text>
                </VStack>
                <VStack spacing={2} align="center" minW="150px">
                  <Text fontSize="3xl" fontWeight="bold" color={accentColor}>
                    5x
                  </Text>
                  <Text fontSize="sm" color={"gray.600"} textAlign="center">
                    Better team collaboration
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Container>
        </Box>

        {/* Features Section - THE SOLUTION */}
        <Box
          id="features"
          ref={featuresRef}
          py={20}
          opacity={featuresVisible ? 1 : 0}
          transition="opacity 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
        >
          <Container maxW="1200px">
            <VStack spacing={16}>
              <Box textAlign="center">
                <Heading
                  size="3xl"
                  fontWeight="black"
                  mb={4}
                  fontSize={["2xl", "3xl", "4xl"]}
                >
                  Your All-in-One Solution for
                  <br />
                  <Text as="span" color={accentColor}>
                    Stress-Free Social Media
                  </Text>
                </Heading>
                <Text
                  fontSize={["md", "lg", "xl"]}
                  color="gray.700"
                  maxW="600px"
                  mx="auto"
                >
                  Everything you need to go from chaotic social media creation
                  to organized, strategic planning.
                </Text>
              </Box>

              <VStack spacing={20} w="full">
                {/* Feature 1 */}
                <HStack
                  spacing={8}
                  align="center"
                  flexDirection={["column", "column", "row"]}
                  w="full"
                  minH="350px"
                  {...(prefersReducedMotion
                    ? {}
                    : {
                        animation: `${fadeInUp} 0.8s ease-out 0.2s`,
                        opacity: isVisible ? 1 : 0,
                      })}
                >
                  <Box
                    flex={1}
                    textAlign="center"
                    minH="300px"
                    display="flex"
                    alignItems="center"
                  >
                    <img
                      src="/images/features/content-plan.png"
                      alt="Plan Your Social Media Content with AI"
                      style={{
                        width: "100%",
                        height: "280px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        cursor: "pointer",
                        border: "2px solid #E2E8F0",
                      }}
                      onClick={() => openImageViewer(0)}
                    />
                  </Box>
                  <Box flex={1}>
                    <Heading size="lg" fontWeight="bold" mb={4}>
                      Plan Your Social Media Content with AI
                    </Heading>
                    <Text color={featureTextColor} fontSize="lg">
                      Stop scrambling for social media ideas. Plan your posts
                      for weeks or months ahead with AI suggestions that keep
                      your social media strategy on track and consistent across
                      all platforms.
                    </Text>
                  </Box>
                </HStack>

                {/* Feature 2 */}
                <HStack
                  spacing={8}
                  align="center"
                  flexDirection={["column", "column", "row-reverse"]}
                  w="full"
                  minH="350px"
                  {...(prefersReducedMotion
                    ? {}
                    : {
                        animation: `${fadeInUp} 0.8s ease-out 0.4s`,
                        opacity: isVisible ? 1 : 0,
                      })}
                >
                  <Box
                    flex={1}
                    textAlign="center"
                    minH="300px"
                    display="flex"
                    alignItems="center"
                  >
                    <img
                      src="/images/features/content-calendar.png"
                      alt="Social Media Calendar View"
                      style={{
                        width: "100%",
                        height: "280px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        cursor: "pointer",
                        border: "2px solid #E2E8F0",
                      }}
                      onClick={() => openImageViewer(1)}
                    />
                  </Box>
                  <Box flex={1}>
                    <Heading size="lg" fontWeight="bold" mb={4}>
                      Social Media Calendar View
                    </Heading>
                    <Text color={featureTextColor} fontSize="lg">
                      Never miss a social media post again. Visualize your
                      entire social media strategy at a glance and maintain
                      perfect posting consistency across Instagram, Twitter,
                      Facebook, and more.
                    </Text>
                  </Box>
                </HStack>

                {/* Feature 3 */}
                <HStack
                  spacing={8}
                  align="center"
                  flexDirection={["column", "column", "row"]}
                  w="full"
                  minH="350px"
                  {...(prefersReducedMotion
                    ? {}
                    : {
                        animation: `${fadeInUp} 0.8s ease-out 0.6s`,
                        opacity: isVisible ? 1 : 0,
                      })}
                >
                  <Box
                    flex={1}
                    textAlign="center"
                    minH="300px"
                    display="flex"
                    alignItems="center"
                  >
                    <img
                      src="/images/features/team-invite.png"
                      alt="Team Collaboration"
                      style={{
                        width: "100%",
                        height: "280px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        cursor: "pointer",
                        border: "2px solid #E2E8F0",
                      }}
                      onClick={() => openImageViewer(2)}
                    />
                  </Box>
                  <Box flex={1}>
                    <Heading size="lg" fontWeight="bold" mb={4}>
                      Team Collaboration
                    </Heading>
                    <Text color={featureTextColor} fontSize="lg">
                      End messy email threads and lost social media files.
                      Invite team members and clients to collaborate in
                      real-time with clear task assignments and feedback loops
                      for your social media content.
                    </Text>
                  </Box>
                </HStack>

                {/* Feature 4 */}
                <HStack
                  spacing={8}
                  align="center"
                  flexDirection={["column", "column", "row-reverse"]}
                  w="full"
                  minH="350px"
                  {...(prefersReducedMotion
                    ? {}
                    : {
                        animation: `${fadeInUp} 0.8s ease-out 0.8s`,
                        opacity: isVisible ? 1 : 0,
                      })}
                >
                  <Box
                    flex={1}
                    textAlign="center"
                    minH="300px"
                    display="flex"
                    alignItems="center"
                  >
                    <img
                      src="/images/features/dashboard-analytics.png"
                      alt="Smart Reminders"
                      style={{
                        width: "100%",
                        height: "280px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        cursor: "pointer",
                        border: "2px solid #E2E8F0",
                      }}
                      onClick={() => openImageViewer(3)}
                    />
                  </Box>
                  <Box flex={1}>
                    <Heading size="lg" fontWeight="bold" mb={4}>
                      Smart Reminders
                    </Heading>
                    <Text color={featureTextColor} fontSize="lg">
                      Forget about missing social media deadlines. Get automated
                      reminders for due posts so you can focus on creating
                      engaging content while we handle the scheduling.
                    </Text>
                  </Box>
                </HStack>

                {/* Feature 5 */}
                <HStack
                  spacing={8}
                  align="center"
                  flexDirection={["column", "column", "row"]}
                  w="full"
                  minH="350px"
                  {...(prefersReducedMotion
                    ? {}
                    : {
                        animation: `${fadeInUp} 0.8s ease-out 1.0s`,
                        opacity: isVisible ? 1 : 0,
                      })}
                >
                  <Box
                    flex={1}
                    textAlign="center"
                    minH="300px"
                    display="flex"
                    alignItems="center"
                  >
                    <img
                      src="/images/features/social-sharing.png"
                      alt="Social Media Sharing"
                      style={{
                        width: "100%",
                        height: "280px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        cursor: "pointer",
                        border: "2px solid #E2E8F0",
                      }}
                      onClick={() => openImageViewer(4)}
                    />
                  </Box>
                  <Box flex={1}>
                    <Heading size="lg" fontWeight="bold" mb={4}>
                      Social Media Sharing
                    </Heading>
                    <Text color={featureTextColor} fontSize="lg">
                      Stop the copy-paste madness. Publish directly to your
                      social media accounts with one click and maintain your
                      posting schedule effortlessly across all platforms.
                    </Text>
                  </Box>
                </HStack>
              </VStack>
            </VStack>
          </Container>
        </Box>

        {/* Pricing Section */}
        <Box
          id="pricing"
          ref={pricingRef}
          py={20}
          bg="gray.100"
          opacity={pricingVisible ? 1 : 0}
          transition="opacity 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
        >
          <Container maxW="1200px">
            <VStack spacing={12}>
              <Box textAlign="center" maxW="600px" mx="auto">
                <Heading
                  size="3xl"
                  fontWeight="black"
                  mb={4}
                  fontSize={["2xl", "3xl", "4xl"]}
                >
                  Simple, Transparent Pricing
                </Heading>
                <Text fontSize={["md", "lg", "xl"]} color={"gray.700"}>
                  Start automating your social media calendar today with our
                  flexible pricing.
                </Text>
              </Box>

              {/* Billing Toggle */}
              <HStack
                spacing={0}
                bg="gray.200"
                p={1}
                borderRadius="full"
                maxW="300px"
                mx="auto"
              >
                <Button
                  flex={1}
                  variant={billingPeriod === "monthly" ? "solid" : "ghost"}
                  bg={billingPeriod === "monthly" ? "white" : "transparent"}
                  color={billingPeriod === "monthly" ? "black" : "gray.600"}
                  _hover={{
                    bg: billingPeriod === "monthly" ? "white" : "gray.100",
                  }}
                  onClick={() => setBillingPeriod("monthly")}
                  borderRadius="full"
                >
                  Monthly
                </Button>
                <Button
                  flex={1}
                  variant={billingPeriod === "annual" ? "solid" : "ghost"}
                  bg={billingPeriod === "annual" ? "white" : "transparent"}
                  color={billingPeriod === "annual" ? "black" : "gray.600"}
                  _hover={{
                    bg: billingPeriod === "annual" ? "white" : "gray.100",
                  }}
                  onClick={() => setBillingPeriod("annual")}
                  borderRadius="full"
                >
                  Annual
                </Button>
              </HStack>

              <Grid
                templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                gap={8}
                maxW="1200px"
                w="full"
                mx="auto"
              >
                {/* Free Plan */}
                <Box
                  {...(prefersReducedMotion
                    ? {}
                    : {
                        animation: `${fadeInUp} 0.8s ease-out`,
                        opacity: isVisible ? 1 : 0,
                      })}
                >
                  <Box
                    bg={bgColor}
                    borderRadius="2xl"
                    boxShadow="2xl"
                    overflow="hidden"
                    h="full"
                  >
                    <VStack spacing={6} p={8}>
                      <VStack spacing={2} textAlign="center">
                        <Text fontSize="lg" color={"gray.600"}>
                          Free Plan
                        </Text>
                        <HStack align="baseline" spacing={1}>
                          <Text
                            fontSize="4xl"
                            fontWeight="black"
                            color={textColor}
                          >
                            $0
                          </Text>
                          <Text fontSize="lg" color={"gray.600"}>
                            /forever
                          </Text>
                        </HStack>
                        <Text
                          fontSize="sm"
                          color={useColorModeValue("gray.500", "gray.400")}
                        >
                          Perfect for getting started
                        </Text>
                      </VStack>

                      <VStack spacing={4} align="start" w="full">
                        <HStack spacing={3}>
                          <Icon
                            as={CheckCircleIcon}
                            color="green.500"
                            w={5}
                            h={5}
                          />
                          <Text fontSize="sm">1 team</Text>
                        </HStack>
                        <HStack spacing={3}>
                          <Icon
                            as={CheckCircleIcon}
                            color="green.500"
                            w={5}
                            h={5}
                          />
                          <Text fontSize="sm">
                            10 social media posts per month
                          </Text>
                        </HStack>
                        <HStack spacing={3}>
                          <Icon
                            as={CheckCircleIcon}
                            color="green.500"
                            w={5}
                            h={5}
                          />
                          <Text fontSize="sm">
                            1 social media plan per month
                          </Text>
                        </HStack>
                        <HStack spacing={3}>
                          <Icon
                            as={CheckCircleIcon}
                            color="green.500"
                            w={5}
                            h={5}
                          />
                          <Text fontSize="sm">1 team invite</Text>
                        </HStack>
                        <HStack spacing={3}>
                          <Icon
                            as={CheckCircleIcon}
                            color="green.500"
                            w={5}
                            h={5}
                          />
                          <Text fontSize="sm">
                            Basic social media scheduling
                          </Text>
                        </HStack>
                      </VStack>

                      <VStack spacing={4} w="full" mt="auto">
                        <Button
                          bg="gray.100"
                          color="gray.700"
                          size="lg"
                          w="full"
                          fontSize="lg"
                          fontWeight="bold"
                          _hover={{
                            bg: "gray.200",
                          }}
                          transition="all 0.3s"
                          onClick={() => navigate("/signup")}
                        >
                          Get Started Free
                        </Button>
                      </VStack>
                    </VStack>
                  </Box>
                </Box>

                {/* Pro Plan */}
                <Box
                  {...(prefersReducedMotion
                    ? {}
                    : {
                        animation: `${fadeInUp} 0.8s ease-out 0.2s`,
                        opacity: isVisible ? 1 : 0,
                      })}
                >
                  <Box
                    bg={bgColor}
                    borderRadius="2xl"
                    boxShadow="2xl"
                    overflow="hidden"
                    border="2px solid"
                    borderColor={accentColor}
                    position="relative"
                    h="full"
                  >
                    {/* Popular Badge */}
                    <Box
                      position="absolute"
                      top={4}
                      right={4}
                      bg={accentColor}
                      color="black"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="bold"
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      Most Popular
                    </Box>

                    <VStack spacing={6} p={8}>
                      <VStack spacing={2} textAlign="center">
                        <Text fontSize="lg" color={"gray.600"}>
                          Pro Plan
                        </Text>
                        <HStack align="baseline" spacing={1}>
                          <Text
                            fontSize="4xl"
                            fontWeight="black"
                            color={accentColor}
                          >
                            {billingPeriod === "monthly" ? "$9.99" : "$99.90"}
                          </Text>
                          <Text fontSize="lg" color={"gray.600"}>
                            {billingPeriod === "monthly" ? "/month" : "/year"}
                          </Text>
                        </HStack>
                        <Text
                          fontSize="sm"
                          color={useColorModeValue("gray.500", "gray.400")}
                        >
                          Billed {billingPeriod} • Cancel anytime
                        </Text>
                      </VStack>

                      <VStack spacing={4} align="start" w="full">
                        <HStack spacing={3}>
                          <Icon
                            as={CheckCircleIcon}
                            color="green.500"
                            w={5}
                            h={5}
                          />
                          <Text fontSize="sm">
                            Unlimited social media plans
                          </Text>
                        </HStack>
                        <HStack spacing={3}>
                          <Icon
                            as={CheckCircleIcon}
                            color="green.500"
                            w={5}
                            h={5}
                          />
                          <Text fontSize="sm">
                            AI-powered social media content generation
                          </Text>
                        </HStack>
                        <HStack spacing={3}>
                          <Icon
                            as={CheckCircleIcon}
                            color="green.500"
                            w={5}
                            h={5}
                          />
                          <Text fontSize="sm">
                            Automated social media scheduling
                          </Text>
                        </HStack>
                        <HStack spacing={3}>
                          <Icon
                            as={CheckCircleIcon}
                            color="green.500"
                            w={5}
                            h={5}
                          />
                          <Text fontSize="sm">Team collaboration tools</Text>
                        </HStack>
                        <HStack spacing={3}>
                          <Icon
                            as={CheckCircleIcon}
                            color="green.500"
                            w={5}
                            h={5}
                          />
                          <Text fontSize="sm">
                            Social media analytics & insights
                          </Text>
                        </HStack>
                        <HStack spacing={3}>
                          <Icon
                            as={CheckCircleIcon}
                            color="green.500"
                            w={5}
                            h={5}
                          />
                          <Text fontSize="sm">Priority support</Text>
                        </HStack>
                      </VStack>

                      <VStack spacing={4} w="full" mt="auto">
                        <Box
                          bg="blue.50"
                          borderRadius="lg"
                          p={4}
                          w="full"
                          textAlign="center"
                        >
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="blue.800"
                          >
                            14-Day Free Trial
                          </Text>
                          <Text fontSize="xs" color="blue.700">
                            No credit card required
                          </Text>
                        </Box>

                        <Button
                          bg={accentColor}
                          color="black"
                          size="lg"
                          w="full"
                          fontSize="lg"
                          fontWeight="bold"
                          _hover={{
                            bg: accentColor,
                            opacity: 0.8,
                            transform: "translateY(-2px)",
                          }}
                          transition="all 0.3s"
                          onClick={() => navigate("/signup")}
                        >
                          Start Free Trial
                        </Button>
                      </VStack>
                    </VStack>
                  </Box>
                </Box>

                {/* Enterprise Plan */}
                <Box
                  {...(prefersReducedMotion
                    ? {}
                    : {
                        animation: `${fadeInUp} 0.8s ease-out 0.4s`,
                        opacity: isVisible ? 1 : 0,
                      })}
                >
                  <Box
                    bg={bgColor}
                    borderRadius="2xl"
                    boxShadow="2xl"
                    overflow="hidden"
                    h="full"
                  >
                    <VStack spacing={6} p={8}>
                      <VStack spacing={2} textAlign="center">
                        <Text fontSize="lg" color={"gray.600"}>
                          Enterprise Plan
                        </Text>
                        <HStack align="baseline" spacing={1}>
                          <Text
                            fontSize="4xl"
                            fontWeight="black"
                            color={textColor}
                          >
                            Custom
                          </Text>
                        </HStack>
                        <Text
                          fontSize="sm"
                          color={useColorModeValue("gray.500", "gray.400")}
                        >
                          For large teams and agencies
                        </Text>
                      </VStack>

                      <VStack spacing={4} align="start" w="full">
                        <HStack spacing={3}>
                          <Icon
                            as={CheckCircleIcon}
                            color="green.500"
                            w={5}
                            h={5}
                          />
                          <Text fontSize="sm">Everything in Pro</Text>
                        </HStack>
                        <HStack spacing={3}>
                          <Icon
                            as={CheckCircleIcon}
                            color="green.500"
                            w={5}
                            h={5}
                          />
                          <Text fontSize="sm">Unlimited teams</Text>
                        </HStack>
                        <HStack spacing={3}>
                          <Icon
                            as={CheckCircleIcon}
                            color="green.500"
                            w={5}
                            h={5}
                          />
                          <Text fontSize="sm">
                            Advanced social media analytics
                          </Text>
                        </HStack>
                        <HStack spacing={3}>
                          <Icon
                            as={CheckCircleIcon}
                            color="green.500"
                            w={5}
                            h={5}
                          />
                          <Text fontSize="sm">White-label options</Text>
                        </HStack>
                        <HStack spacing={3}>
                          <Icon
                            as={CheckCircleIcon}
                            color="green.500"
                            w={5}
                            h={5}
                          />
                          <Text fontSize="sm">Dedicated account manager</Text>
                        </HStack>
                        <HStack spacing={3}>
                          <Icon
                            as={CheckCircleIcon}
                            color="green.500"
                            w={5}
                            h={5}
                          />
                          <Text fontSize="sm">
                            Custom social media integrations
                          </Text>
                        </HStack>
                      </VStack>

                      <VStack spacing={4} w="full" mt="auto">
                        <Button
                          bg="gray.100"
                          color="gray.700"
                          size="lg"
                          w="full"
                          fontSize="lg"
                          fontWeight="bold"
                          _hover={{
                            bg: "gray.200",
                          }}
                          transition="all 0.3s"
                          onClick={() => navigate("/contact")}
                        >
                          Contact Sales
                        </Button>
                      </VStack>
                    </VStack>
                  </Box>
                </Box>
              </Grid>

              <HStack spacing={8} flexWrap="wrap" justify="center">
                <VStack spacing={1} align="center">
                  <Icon as={CheckCircleIcon} color="green.500" w={6} h={6} />
                  <Text fontSize="sm" fontWeight="medium">
                    30-day money back
                  </Text>
                </VStack>
                <VStack spacing={1} align="center">
                  <Icon as={CheckCircleIcon} color="green.500" w={6} h={6} />
                  <Text fontSize="sm" fontWeight="medium">
                    Cancel anytime
                  </Text>
                </VStack>
                <VStack spacing={1} align="center">
                  <Icon as={CheckCircleIcon} color="green.500" w={6} h={6} />
                  <Text fontSize="sm" fontWeight="medium">
                    Secure payment
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Container>
        </Box>

        {/* CTA Section - THE SELL */}
        <Box
          id="cta"
          ref={ctaRef}
          py={20}
          opacity={ctaVisible ? 1 : 0}
          transition="opacity 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
        >
          <Container maxW="800px" textAlign="center">
            <VStack spacing={8}>
              <Box
                {...(prefersReducedMotion
                  ? {}
                  : {
                      animation: `${slideInLeft} 0.8s ease-out`,
                      opacity: isVisible ? 1 : 0,
                    })}
              >
                <Heading
                  size="3xl"
                  fontWeight="black"
                  mb={4}
                  fontSize={["2xl", "3xl", "4xl"]}
                >
                  Ready to End Social Media Chaos
                  <br />
                  <Text as="span" color={accentColor}>
                    For Good?
                  </Text>
                </Heading>
                <Text fontSize={["md", "lg", "xl"]} color={"gray.600"} mb={8}>
                  Join thousands of creators and marketers who have transformed
                  their social media strategy from stressful scrambling to
                  organized, stress-free planning.
                </Text>
              </Box>

              <Box
                {...(prefersReducedMotion
                  ? {}
                  : {
                      animation: `${slideInRight} 0.8s ease-out 0.2s both`,
                      opacity: isVisible ? 1 : 0,
                    })}
              >
                <HStack spacing={4} justify="center" flexWrap="wrap">
                  <Button
                    size="lg"
                    bg={accentColor}
                    color="black"
                    px={10}
                    py={4}
                    fontSize="lg"
                    fontWeight="bold"
                    leftIcon={<CheckCircleIcon />}
                    _hover={{
                      bg: accentColor,
                      opacity: 0.8,
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.3s"
                    onClick={() => navigate("/signup")}
                  >
                    Start Your Free Trial
                  </Button>
                </HStack>

                <Text
                  fontSize="sm"
                  color={useColorModeValue("gray.500", "gray.400")}
                  mt={4}
                >
                  No credit card required • 14-day free trial • Cancel anytime
                </Text>
              </Box>
            </VStack>
          </Container>
        </Box>

        {/* Footer */}
        <Box
          id="footer"
          ref={footerRef}
          py={8}
          borderTop="1px"
          borderColor="gray.300"
          opacity={footerVisible ? 1 : 0}
          transition="opacity 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
        >
          <Container maxW="1200px">
            <Flex
              direction={["column", "row"]}
              align={["center", "center"]}
              justify="space-between"
              textAlign={["center", "left"]}
            >
              <Text color={"gray.600"}>
                © 2024 Dokahub. All rights reserved.
              </Text>
              <HStack spacing={6} mt={[4, 0]}>
                <Link
                  as={RouterLink}
                  to="/blog"
                  color="gray.600"
                  _hover={{ color: accentColor }}
                  transition="color 0.3s"
                >
                  Blog
                </Link>
                <Link
                  as={RouterLink}
                  to="/privacy"
                  color="gray.600"
                  _hover={{ color: accentColor }}
                  transition="color 0.3s"
                >
                  Privacy
                </Link>
                <Link
                  as={RouterLink}
                  to="/terms"
                  color="gray.600"
                  _hover={{ color: accentColor }}
                  transition="color 0.3s"
                >
                  Terms
                </Link>
                <Link
                  as={RouterLink}
                  to="/contact"
                  color="gray.600"
                  _hover={{ color: accentColor }}
                  transition="color 0.3s"
                >
                  Support
                </Link>
              </HStack>
            </Flex>
          </Container>
        </Box>

        {/* Image Viewer Modal */}
        <Modal
          isOpen={isImageViewerOpen}
          onClose={closeImageViewer}
          size="6xl"
          isCentered
        >
          <ModalOverlay bg="blackAlpha.800" onClick={closeImageViewer} />
          <ModalContent bg="transparent" boxShadow="none">
            <ModalCloseButton
              color="white"
              size="lg"
              onClick={closeImageViewer}
              zIndex={9999}
            />
            <ModalBody p={0} position="relative">
              <Box
                position="relative"
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH="80vh"
              >
                {/* Previous Button */}
                <IconButton
                  aria-label="Previous image"
                  icon={<ChevronLeftIcon />}
                  position="absolute"
                  left={4}
                  zIndex={10}
                  size="lg"
                  color="white"
                  bg="blackAlpha.600"
                  _hover={{ bg: "blackAlpha.800" }}
                  onClick={prevImage}
                  isDisabled={featureImages.length <= 1}
                />

                {/* Current Image */}
                <Box maxW="90%" maxH="70vh" textAlign="center">
                  <img
                    src={featureImages[currentImageIndex].src}
                    alt={featureImages[currentImageIndex].alt}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "80%",
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
                  />
                  <Text
                    color="white"
                    fontSize="lg"
                    fontWeight="bold"
                    mt={4}
                    textShadow="0 2px 4px rgba(0,0,0,0.8)"
                  >
                    {featureImages[currentImageIndex].title}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mt={2}
                    textShadow="0 2px 4px rgba(0,0,0,0.8)"
                  >
                    {currentImageIndex + 1} of {featureImages.length}
                  </Text>
                </Box>

                {/* Next Button */}
                <IconButton
                  aria-label="Next image"
                  icon={<ChevronRightIcon />}
                  position="absolute"
                  right={4}
                  zIndex={10}
                  size="lg"
                  color="white"
                  bg="blackAlpha.600"
                  _hover={{ bg: "blackAlpha.800" }}
                  onClick={nextImage}
                  isDisabled={featureImages.length <= 1}
                />
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};
