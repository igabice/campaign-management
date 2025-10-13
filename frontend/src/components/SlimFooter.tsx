import React from "react";
import { Box, Container, HStack, Link, Text } from "@chakra-ui/react";

export const SlimFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      as="footer"
      bg="gray.50"
      borderTop="1px"
      borderColor="gray.200"
      _dark={{ borderColor: "gray.700" }}
    >
      <Container maxW="container.xl" py={4}>
        <HStack
          justify="space-between"
          align="center"
          flexWrap="wrap"
          spacing={4}
        >
          <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
            © {currentYear} Dokahub. All rights reserved.
          </Text>
          <HStack spacing={6} flexWrap="wrap">
            <Link
              href="#"
              color="gray.600"
              _dark={{ color: "gray.400" }}
              _hover={{ color: "blue.500" }}
              fontSize="sm"
            >
              Support
            </Link>
            <Link
              href="#"
              color="gray.600"
              _dark={{ color: "gray.400" }}
              _hover={{ color: "blue.500" }}
              fontSize="sm"
            >
              Contact Us
            </Link>
            <Link
              href="#"
              color="gray.600"
              _dark={{ color: "gray.400" }}
              _hover={{ color: "blue.500" }}
              fontSize="sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              color="gray.600"
              _dark={{ color: "gray.400" }}
              _hover={{ color: "blue.500" }}
              fontSize="sm"
            >
              Help Center
            </Link>
            <Link
              href="#"
              color="gray.600"
              _dark={{ color: "gray.400" }}
              _hover={{ color: "blue.500" }}
              fontSize="sm"
            >
              Terms of Service
            </Link>
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
};
