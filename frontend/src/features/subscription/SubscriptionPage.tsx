import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Spinner,
  useToast,
  Alert,
  AlertIcon,
  Icon,
  usePrefersReducedMotion,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { subscriptionService } from '../../services/subscription';

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

interface Subscription {
  id: string;
  plan: string;
  status: string;
  limits?: Record<string, number>;
}

const SubscriptionPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const toast = useToast();
  const prefersReducedMotion = usePrefersReducedMotion();

  const bgColor = "gray.900";
  const textColor = "white";
  const accentColor = "#F9D71C";
  const featureTextColor = "gray.300";

  const loadSubscriptions = useCallback(async () => {
    try {
      const { data, error } = await subscriptionService.list();
      if (error) {
        toast({
          title: 'Error loading subscriptions',
          description: error.message,
          status: 'error',
          duration: 5000,
        });
      } else {
        setSubscriptions(data || []);
      }
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  const handleUpgrade = async (plan: string) => {
    setUpgrading(true);
    try {
      const { error } = await subscriptionService.upgrade({
        plan,
        successUrl: `${window.location.origin}/dashboard`,
        cancelUrl: `${window.location.origin}/subscription`,
      });

      if (error) {
        toast({
          title: 'Upgrade failed',
          description: error.message,
          status: 'error',
          duration: 5000,
        });
      }
      // If successful, user will be redirected to Stripe
    } catch (error) {
      console.error('Error upgrading:', error);
      toast({
        title: 'Upgrade failed',
        description: 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setUpgrading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      const { data, error } = await subscriptionService.billingPortal({
        returnUrl: `${window.location.origin}/subscription`,
      });

      if (error) {
        toast({
          title: 'Error opening billing portal',
          description: error.message,
          status: 'error',
          duration: 5000,
        });
      } else if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error opening billing portal:', error);
    }
  };

  const plans = [
    {
      name: 'free',
      title: 'Free',
      price: '$0',
      priceSubtext: '',
      features: [
        '1 Team',
        '10 Posts/month',
        '1 Content Plan/month',
        'Basic analytics',
        'Manual scheduling'
      ],
      limits: { teams: 1, posts: 10, plans: 1 },
      popular: false,
    },
    {
      name: 'pro',
      title: 'Pro',
      price: '$29',
      priceSubtext: '/month',
      features: [
        '5 Teams',
        '100 Posts/month',
        '10 Content Plans/month',
        'AI-powered content generation',
        'Automated scheduling',
        'Team collaboration tools',
        'Advanced analytics & insights',
        'Priority support'
      ],
      limits: { teams: 5, posts: 100, plans: 10 },
      popular: true,
    },
    {
      name: 'enterprise',
      title: 'Enterprise',
      price: 'Custom',
      priceSubtext: '',
      features: [
        'Unlimited Teams',
        'Unlimited Posts',
        'Unlimited Content Plans',
        'All Pro features',
        'Custom integrations',
        'Dedicated account manager',
        '24/7 phone support'
      ],
      limits: { teams: -1, posts: -1, plans: -1 },
      popular: false,
    },
  ];

  const activeSubscription = subscriptions.find(sub => sub.status === 'active' || sub.status === 'trialing');

  if (loading) {
    return (
      <Box bg={bgColor} color={textColor} minH="100vh" display="flex" justifyContent="center" alignItems="center">
        <Spinner size="xl" color={accentColor} />
      </Box>
    );
  }

  return (
    <Box bg={bgColor} color={textColor} minH="100vh" py={20}>
      <Container maxW="1200px">
        <VStack spacing={12}>
          <Box textAlign="center" maxW="600px" mx="auto">
            <Heading
              size="3xl"
              fontWeight="black"
              mb={4}
              fontSize={["2xl", "3xl", "4xl"]}
            >
              Choose Your Plan
            </Heading>
            <Text
              fontSize={["md", "lg", "xl"]}
              color={featureTextColor}
            >
              Select the perfect plan for your content creation needs.
            </Text>
          </Box>

          {activeSubscription && (
            <Alert status="info" bg="blue.900" borderColor="blue.500">
              <AlertIcon color="blue.300" />
              <Box>
                <Text fontWeight="bold" color="blue.100">Current Plan: {activeSubscription.plan}</Text>
                <Text color="blue.200">Status: <Badge colorScheme={activeSubscription.status === 'active' ? 'green' : 'yellow'}>
                  {activeSubscription.status}
                </Badge></Text>
              </Box>
            </Alert>
          )}

          <Grid
            templateColumns={[
              "1fr",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
            ]}
            gap={8}
            w="full"
          >
            {plans.map((plan, index) => (
              <GridItem key={plan.name}>
                <Box
                  bg="gray.800"
                  borderRadius="2xl"
                  boxShadow="2xl"
                  overflow="hidden"
                  border={plan.popular ? "2px solid" : "none"}
                  borderColor={plan.popular ? accentColor : undefined}
                  position="relative"
                  transition="all 0.3s"
                  _hover={{
                    transform: "translateY(-8px)",
                    boxShadow: "3xl",
                  }}
                  {...(prefersReducedMotion
                    ? {}
                    : {
                        animation: `${fadeInUp} 0.8s ease-out ${index * 0.2}s`,
                        opacity: 1,
                      })}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
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
                      zIndex={2}
                    >
                      Most Popular
                    </Box>
                  )}

                  <VStack spacing={6} p={8}>
                    <VStack spacing={2} textAlign="center">
                      <Text
                        fontSize="lg"
                        color={featureTextColor}
                      >
                        {plan.title}
                      </Text>
                      <HStack align="baseline" spacing={1} justify="center">
                        <Text
                          fontSize="4xl"
                          fontWeight="black"
                          color={accentColor}
                        >
                          {plan.price}
                        </Text>
                        <Text
                          fontSize="lg"
                          color={featureTextColor}
                        >
                          {plan.priceSubtext}
                        </Text>
                      </HStack>
                      {plan.name !== 'free' && plan.name !== 'enterprise' && (
                        <Text
                          fontSize="sm"
                          color="gray.400"
                        >
                          Billed monthly • Cancel anytime
                        </Text>
                      )}
                    </VStack>

                    <VStack spacing={4} align="start" w="full">
                      {plan.features.map((feature, idx) => (
                        <HStack key={idx} spacing={3}>
                          <Icon
                            as={CheckCircleIcon}
                            color="green.500"
                            w={5}
                            h={5}
                          />
                          <Text fontSize="sm">{feature}</Text>
                        </HStack>
                      ))}
                    </VStack>

                    <VStack spacing={4} w="full">
                      {plan.name === 'pro' && (
                        <Box
                          bg="blue.900"
                          borderRadius="lg"
                          p={4}
                          w="full"
                          textAlign="center"
                        >
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="blue.200"
                          >
                            🎉 7-Day Free Trial
                          </Text>
                          <Text
                            fontSize="xs"
                            color="blue.300"
                          >
                           No credit card required
                         </Text>
                        </Box>
                      )}

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
                        onClick={() => handleUpgrade(plan.name)}
                        isLoading={upgrading}
                        isDisabled={activeSubscription?.plan === plan.name}
                      >
                        {activeSubscription?.plan === plan.name ? 'Current Plan' : plan.name === 'enterprise' ? 'Contact Sales' : 'Get Started'}
                      </Button>
                    </VStack>
                  </VStack>
                </Box>
              </GridItem>
            ))}
          </Grid>

          {activeSubscription && (
            <Box
              bg="gray.800"
              borderRadius="2xl"
              boxShadow="2xl"
              p={8}
              w="full"
              maxW="400px"
              mx="auto"
              textAlign="center"
            >
              <Heading size="md" mb={4}>Manage Subscription</Heading>
              <Button
                bg="gray.700"
                color="white"
                size="lg"
                w="full"
                fontSize="lg"
                _hover={{
                  bg: "gray.600",
                  transform: "translateY(-2px)",
                }}
                transition="all 0.3s"
                onClick={handleManageBilling}
              >
                Open Billing Portal
              </Button>
            </Box>
          )}

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
  );
};

export default SubscriptionPage;