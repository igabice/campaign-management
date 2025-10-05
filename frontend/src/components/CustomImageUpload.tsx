import React from "react";
import {
  Box,
  Button,
  Text,
  Icon,
  Image,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

interface CustomImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export const CustomImageUpload: React.FC<CustomImageUploadProps> = ({
  value,
  onChange,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const hoverBorderColor = useColorModeValue("gray.400", "gray.500");
  const bgColor = useColorModeValue("gray.50", "gray.700");

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        onChange(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the upload
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Box
      border="2px"
      borderStyle="dashed"
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
      cursor="pointer"
      _hover={{ borderColor: hoverBorderColor }}
      transition="border-color 0.2s"
      bg={bgColor}
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      {value ? (
        <Box position="relative">
          <Image
            src={value}
            alt="Uploaded"
            maxH="40"
            mx="auto"
            objectFit="contain"
            borderRadius="md"
          />
          <Button
            type="button"
            colorScheme="red"
            size="sm"
            position="absolute"
            top={2}
            right={2}
            onClick={handleRemove}
          >
            Remove
          </Button>
        </Box>
      ) : (
        <VStack spacing={4} textAlign="center">
          <Box
            w={16}
            h={16}
            bg="gray.200"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon
              w={8}
              h={8}
              color="gray.500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </Icon>
          </Box>
          <Text fontSize="lg" fontWeight="medium" color="gray.700">
            Upload Image
          </Text>
          <Text fontSize="sm" color="gray.500">
            Click to browse or drag and drop
          </Text>
          <Text fontSize="xs" color="gray.400">
            PNG, JPG, GIF up to 5MB
          </Text>
        </VStack>
      )}
    </Box>
  );
};