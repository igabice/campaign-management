import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Divider,
  Flex,
  Spacer,
  HStack,
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
import { z } from "zod";
import { post } from "../../lib/http";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormInputs = z.infer<typeof contactSchema>;

export const ContactPage: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const accentColor = "#F9D71C";
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormInputs) => {
    try {
      await post("/contact", data);
      toast({
        title: "Message sent!",
        description: "We'll get back to you soon.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to send message. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

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
          <Heading as="h1" size="xl" color={accentColor}>
            Contact Us
          </Heading>

          <Text fontSize="lg" color="gray.600">
            Have a question or need support? We'd love to hear from you. Send us
            a message and we'll respond as soon as possible.
          </Text>

          <Divider />

          <Box as="form" onSubmit={handleSubmit(onSubmit)} w="full">
            <VStack spacing={6} align="start" w="full">
              <FormControl isInvalid={!!errors.name}>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input id="name" type="text" {...register("name")} />
                <Text color="red.500" fontSize="sm">
                  {errors.name?.message}
                </Text>
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input id="email" type="email" {...register("email")} />
                <Text color="red.500" fontSize="sm">
                  {errors.email?.message}
                </Text>
              </FormControl>

              <FormControl isInvalid={!!errors.message}>
                <FormLabel htmlFor="message">Message</FormLabel>
                <Textarea id="message" rows={6} {...register("message")} />
                <Text color="red.500" fontSize="sm">
                  {errors.message?.message}
                </Text>
              </FormControl>

              <Button
                type="submit"
                bg={accentColor}
                color="black"
                _hover={{ bg: accentColor, opacity: 0.8 }}
                isLoading={isSubmitting}
                size="lg"
                w="full"
              >
                Send Message
              </Button>
            </VStack>
          </Box>

          <Divider />

          <VStack spacing={4} align="start">
            <Text fontSize="lg" fontWeight="bold">
              Other ways to reach us:
            </Text>
            <Text>Email: contact@dokahub.com</Text>
            <Text>Address: Tallinn, Estonia</Text>
          </VStack>

          <Divider />

          <Text fontSize="sm" color="gray.600">
            <RouterLink to="/" style={{ color: "#3182ce" }}>
              ← Back to Home
            </RouterLink>
          </Text>
        </VStack>
      </Container>

      {/* Footer */}
      <Box id="footer" py={8} borderTop="1px" borderColor="gray.300">
        <Container maxW="1200px">
          <Flex
            direction={["column", "row"]}
            align={["center", "center"]}
            justify="space-between"
            textAlign={["center", "left"]}
          >
            <Text color={"gray.300"}>© 2024 Dokahub. All rights reserved.</Text>
            <HStack spacing={6} mt={[4, 0]}>
              <Text
                as={RouterLink}
                to="/privacy"
                color="gray.300"
                _hover={{ color: accentColor }}
                transition="color 0.3s"
              >
                Privacy
              </Text>
              <Text
                as={RouterLink}
                to="/terms"
                color="gray.300"
                _hover={{ color: accentColor }}
                transition="color 0.3s"
              >
                Terms
              </Text>
              <Text
                as={RouterLink}
                to="/contact"
                color="gray.300"
                _hover={{ color: accentColor }}
                transition="color 0.3s"
              >
                Support
              </Text>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </>
  );
};
