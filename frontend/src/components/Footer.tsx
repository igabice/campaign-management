import React from "react";
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Link,
  Text,
  VStack,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box as="footer" bg="gray.900" color="white" mt="auto">
      <Container maxW="container.xl" py={12}>
        <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={8}>
          {/* Company Info */}
          <GridItem>
            <VStack align="start" spacing={4}>
              <Heading size="md" color="blue.400">
                Campaign Management
              </Heading>
              <Text fontSize="sm" color="gray.400" lineHeight="tall">
                Streamline your social media campaigns with powerful tools for scheduling,
                analytics, and team collaboration.
              </Text>
              <HStack spacing={4}>
                <Link href="#" color="gray.400" _hover={{ color: "blue.400" }} fontSize="lg">
                  📘
                </Link>
                <Link href="#" color="gray.400" _hover={{ color: "blue.400" }} fontSize="lg">
                  🐦
                </Link>
                <Link href="#" color="gray.400" _hover={{ color: "blue.400" }} fontSize="lg">
                  📷
                </Link>
                <Link href="#" color="gray.400" _hover={{ color: "blue.400" }} fontSize="lg">
                  💼
                </Link>
              </HStack>
            </VStack>
          </GridItem>

          {/* Product Links */}
          <GridItem>
            <VStack align="start" spacing={3}>
              <Heading size="sm" color="white">
                Product
              </Heading>
              <Link href="#" color="gray.400" _hover={{ color: "blue.400" }} fontSize="sm">
                Features
              </Link>
              <Link href="#" color="gray.400" _hover={{ color: "blue.400" }} fontSize="sm">
                Pricing
              </Link>
              <Link href="#" color="gray.400" _hover={{ color: "blue.400" }} fontSize="sm">
                Integrations
              </Link>
              <Link href="#" color="gray.400" _hover={{ color: "blue.400" }} fontSize="sm">
                API
              </Link>
            </VStack>
          </GridItem>

          {/* Company Links */}
          <GridItem>
            <VStack align="start" spacing={3}>
              <Heading size="sm" color="white">
                Company
              </Heading>
              <Link href="#" color="gray.400" _hover={{ color: "blue.400" }} fontSize="sm">
                About Us
              </Link>
              <Link href="#" color="gray.400" _hover={{ color: "blue.400" }} fontSize="sm">
                Blog
              </Link>
              <Link href="#" color="gray.400" _hover={{ color: "blue.400" }} fontSize="sm">
                Careers
              </Link>
              <Link href="#" color="gray.400" _hover={{ color: "blue.400" }} fontSize="sm">
                Press
              </Link>
            </VStack>
          </GridItem>

          {/* Support Links */}
          <GridItem>
            <VStack align="start" spacing={3}>
              <Heading size="sm" color="white">
                Support
              </Heading>
              <Link href="#" color="gray.400" _hover={{ color: "blue.400" }} fontSize="sm">
                Help Center
              </Link>
               <Link as={RouterLink} to="/contact" color="gray.400" _hover={{ color: "blue.400" }} fontSize="sm">
                 Contact Us
               </Link>
               <Link as={RouterLink} to="/privacy" color="gray.400" _hover={{ color: "blue.400" }} fontSize="sm">
                 Privacy Policy
               </Link>
               <Link as={RouterLink} to="/terms" color="gray.400" _hover={{ color: "blue.400" }} fontSize="sm">
                 Terms of Service
               </Link>
            </VStack>
          </GridItem>
        </Grid>

        <Divider my={8} borderColor="gray.700" />

        <HStack justify="space-between" align="center" flexWrap="wrap" spacing={4}>
          <Text fontSize="sm" color="gray.400">
            © {currentYear} Campaign Management. All rights reserved.
          </Text>
          <HStack spacing={6} flexWrap="wrap">
             <Link as={RouterLink} to="/privacy" color="gray.400" _hover={{ color: "blue.400" }} fontSize="sm">
               Privacy Policy
             </Link>
             <Link as={RouterLink} to="/terms" color="gray.400" _hover={{ color: "blue.400" }} fontSize="sm">
               Terms of Service
             </Link>
            <Link href="#" color="gray.400" _hover={{ color: "blue.400" }} fontSize="sm">
              Cookie Policy
            </Link>
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
};