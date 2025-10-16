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
  GridItem,
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
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  CalendarIcon,
  TimeIcon,
  StarIcon,
  CheckCircleIcon,
  SettingsIcon,
  ChatIcon,
  HamburgerIcon,
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

  const animationProps = prefersReducedMotion
    ? {}
    : {
        animation: `${fadeInUp} 0.8s ease-out`,
      };

  return (
    <Box bg={bgColor} color={textColor} minH="100vh" overflowX="hidden" pt="24">
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

      {/* Hero Section */}
      <Box
        ref={heroRef}
        // bgGradient="linear(to-br, purple.200, pink.200)"
        py={20}
        position="relative"
        opacity={heroVisible ? 1 : 0}
        // transition="opacity 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
        // _before={{
        //   content: '""',
        //   position: "absolute",
        //   top: 0,
        //   left: 0,
        //   right: 0,
        //   bottom: 0,
        //   bg: "rgba(255, 255, 255, 0.2)",
        //   zIndex: 1,
        // }}
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
                Automate Your
                <br />
                <Text as="span" color={accentColor}>
                  Content Calendar
                </Text>
              </Heading>

              <Text
                fontSize={["lg", "xl", "2xl"]}
                // color="white"
                maxW="600px"
                mx="auto"
                mb={8}
                lineHeight="1.6"
                // textShadow="0 2px 4px rgba(0,0,0,0.3)"
              >
                Transform your social media strategy with AI-powered content
                planning, automated scheduling, and seamless team collaboration.
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
                  borderColor="white"
                  color="white"
                  px={8}
                  py={4}
                  fontSize="lg"
                  _hover={{
                    bg: "white",
                    color: "black",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.3s"
                  onClick={() => navigate("/login")}
                >
                  View Demo
                </Button>
              </HStack>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Demo Video Section */}
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
                See Dokahub in Action
              </Heading>
              <Text fontSize={["md", "lg", "xl"]} color="gray.600" mb={8}>
                Watch how our AI-powered content calendar automation transforms
                your social media strategy and saves you hours of manual work
                every week.
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
              {/* Demo Video Placeholder */}
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
                  // Replace "#" with your actual demo video URL (YouTube, Vimeo, etc.)
                  const demoVideoUrl = "#"; // e.g., "https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
                  window.open(demoVideoUrl, "_blank");
                }}
              >
                {/* Video Thumbnail Placeholder */}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  bgGradient="linear(to-br, purple.200, blue.200)"
                  opacity={0.8}
                />

                {/* Play Button */}
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

                {/* Video Title Overlay */}
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
                    Dokahub Demo
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    opacity={0.9}
                    textShadow="0 2px 4px rgba(0,0,0,0.5)"
                  >
                    2:34 • See how it works
                  </Text>
                </VStack>
              </Box>
            </Box>

            <HStack spacing={6} flexWrap="wrap" justify="center">
              <VStack spacing={2} align="center" minW="150px">
                <Text fontSize="3xl" fontWeight="bold" color={accentColor}>
                  5x
                </Text>
                <Text fontSize="sm" color={"gray.300"} textAlign="center">
                  Faster content creation
                </Text>
              </VStack>
              <VStack spacing={2} align="center" minW="150px">
                <Text fontSize="3xl" fontWeight="bold" color={accentColor}>
                  80%
                </Text>
                <Text fontSize="sm" color={"gray.300"} textAlign="center">
                  Time saved on scheduling
                </Text>
              </VStack>
              <VStack spacing={2} align="center" minW="150px">
                <Text fontSize="3xl" fontWeight="bold" color={accentColor}>
                  3x
                </Text>
                <Text fontSize="sm" color={"gray.300"} textAlign="center">
                  More engagement
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </Container>
      </Box>

       {/* Features Section */}
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
                 Everything You Need for
                 <br />
                 <Text as="span" color={accentColor}>
                   Content Success
                 </Text>
               </Heading>
               <Text
                 fontSize={["md", "lg", "xl"]}
                 color="gray.700"
                 maxW="600px"
                 mx="auto"
               >
                 Powerful features designed to streamline your content creation
                 and amplify your social media presence.
               </Text>
             </Box>

             <VStack spacing={20} w="full">
               {/* Feature 1 */}
               <HStack
                 spacing={8}
                 align="center"
                 flexDirection={["column", "column", "row"]}
                 w="full"
                 {...(prefersReducedMotion
                   ? {}
                   : {
                       animation: `${fadeInUp} 0.8s ease-out 0.2s`,
                       opacity: isVisible ? 1 : 0,
                     })}
               >
                 <Box flex={1} textAlign="center">
                   <Icon as={SettingsIcon} w={24} h={24} color={accentColor} />
                 </Box>
                 <Box flex={1}>
                   <Heading size="lg" fontWeight="bold" mb={4}>
                     Plan Your Content with AI
                   </Heading>
                   <Text color={featureTextColor} fontSize="lg">
                     Plan your content for the next week, month with suggestions from AI to keep your social media strategy on track.
                   </Text>
                 </Box>
               </HStack>

               {/* Feature 2 */}
               <HStack
                 spacing={8}
                 align="center"
                 flexDirection={["column", "column", "row-reverse"]}
                 w="full"
                 {...(prefersReducedMotion
                   ? {}
                   : {
                       animation: `${fadeInUp} 0.8s ease-out 0.4s`,
                       opacity: isVisible ? 1 : 0,
                     })}
               >
                 <Box flex={1} textAlign="center">
                   <Icon as={CalendarIcon} w={24} h={24} color={accentColor} />
                 </Box>
                 <Box flex={1}>
                   <Heading size="lg" fontWeight="bold" mb={4}>
                     Content Calendar View
                   </Heading>
                   <Text color={featureTextColor} fontSize="lg">
                     View scheduled content in your content calendar to stay organized and never miss a post.
                   </Text>
                 </Box>
               </HStack>

               {/* Feature 3 */}
               <HStack
                 spacing={8}
                 align="center"
                 flexDirection={["column", "column", "row"]}
                 w="full"
                 {...(prefersReducedMotion
                   ? {}
                   : {
                       animation: `${fadeInUp} 0.8s ease-out 0.6s`,
                       opacity: isVisible ? 1 : 0,
                     })}
               >
                 <Box flex={1} textAlign="center">
                   <Icon as={ChatIcon} w={24} h={24} color={accentColor} />
                 </Box>
                 <Box flex={1}>
                   <Heading size="lg" fontWeight="bold" mb={4}>
                     Team Collaboration
                   </Heading>
                   <Text color={featureTextColor} fontSize="lg">
                     Invite others to collaborate with you on contents, assign tasks, and work together seamlessly.
                   </Text>
                 </Box>
               </HStack>

               {/* Feature 4 */}
               <HStack
                 spacing={8}
                 align="center"
                 flexDirection={["column", "column", "row-reverse"]}
                 w="full"
                 {...(prefersReducedMotion
                   ? {}
                   : {
                       animation: `${fadeInUp} 0.8s ease-out 0.8s`,
                       opacity: isVisible ? 1 : 0,
                     })}
               >
                 <Box flex={1} textAlign="center">
                   <Icon as={TimeIcon} w={24} h={24} color={accentColor} />
                 </Box>
                 <Box flex={1}>
                   <Heading size="lg" fontWeight="bold" mb={4}>
                     Smart Reminders
                   </Heading>
                   <Text color={featureTextColor} fontSize="lg">
                     Get reminded when content is due, so you never miss important posting times.
                   </Text>
                 </Box>
               </HStack>

               {/* Feature 5 */}
               <HStack
                 spacing={8}
                 align="center"
                 flexDirection={["column", "column", "row"]}
                 w="full"
                 {...(prefersReducedMotion
                   ? {}
                   : {
                       animation: `${fadeInUp} 0.8s ease-out 1.0s`,
                       opacity: isVisible ? 1 : 0,
                     })}
               >
                 <Box flex={1} textAlign="center">
                   <Icon as={CheckCircleIcon} w={24} h={24} color={accentColor} />
                 </Box>
                 <Box flex={1}>
                   <Heading size="lg" fontWeight="bold" mb={4}>
                     Social Media Sharing
                   </Heading>
                   <Text color={featureTextColor} fontSize="lg">
                     Share content to your social media accounts directly from the platform with one click.
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
                Start automating your content calendar today with our flexible
                pricing.
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
                      <Text fontSize="lg" color={"gray.300"}>
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
                        <Text fontSize="lg" color={"gray.300"}>
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
                        <Text fontSize="sm">10 posts per month</Text>
                      </HStack>
                      <HStack spacing={3}>
                        <Icon
                          as={CheckCircleIcon}
                          color="green.500"
                          w={5}
                          h={5}
                        />
                        <Text fontSize="sm">1 content plan per month</Text>
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
                        <Text fontSize="sm">Basic scheduling</Text>
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
                      <Text fontSize="lg" color={"gray.300"}>
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
                        <Text fontSize="lg" color={"gray.300"}>
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
                        <Text fontSize="sm">Unlimited content plans</Text>
                      </HStack>
                      <HStack spacing={3}>
                        <Icon
                          as={CheckCircleIcon}
                          color="green.500"
                          w={5}
                          h={5}
                        />
                        <Text fontSize="sm">AI-powered content generation</Text>
                      </HStack>
                      <HStack spacing={3}>
                        <Icon
                          as={CheckCircleIcon}
                          color="green.500"
                          w={5}
                          h={5}
                        />
                        <Text fontSize="sm">Automated scheduling</Text>
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
                        <Text fontSize="sm">Analytics & insights</Text>
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
                        bg="grey.100"
                        borderRadius="lg"
                        p={4}
                        w="full"
                        textAlign="center"
                      >
                        <Text fontSize="sm" fontWeight="bold" color="grey.800">
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
                      <Text fontSize="lg" color={"gray.300"}>
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
                        <Text fontSize="sm">Advanced analytics</Text>
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
                        <Text fontSize="sm">Custom integrations</Text>
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

      {/* CTA Section */}
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
                Ready to Transform Your
                <br />
                <Text as="span" color={accentColor}>
                  Content Strategy?
                </Text>
              </Heading>
              <Text fontSize={["md", "lg", "xl"]} color={"gray.600"} mb={8}>
                Join thousands of creators and marketers who have automated
                their content calendar and boosted their engagement.
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
            <Text color={"gray.300"}>© 2024 Dokahub. All rights reserved.</Text>
            <HStack spacing={6} mt={[4, 0]}>
              <Link
                as={RouterLink}
                to="/privacy"
                color="gray.300"
                _hover={{ color: accentColor }}
                transition="color 0.3s"
              >
                Privacy
              </Link>
              <Link
                as={RouterLink}
                to="/terms"
                color="gray.300"
                _hover={{ color: accentColor }}
                transition="color 0.3s"
              >
                Terms
              </Link>
              <Link
                as={RouterLink}
                to="/contact"
                color="gray.300"
                _hover={{ color: accentColor }}
                transition="color 0.3s"
              >
                Support
              </Link>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};
