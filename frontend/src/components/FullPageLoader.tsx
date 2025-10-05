import React from 'react';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';

interface FullPageLoaderProps {
  message?: string;
}

export const FullPageLoader: React.FC<FullPageLoaderProps> = ({ message = 'Loading...' }) => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(0, 0, 0, 0.5)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={9999}
    >
      <VStack spacing={4} bg="white" p={8} borderRadius="md" boxShadow="lg">
        <Spinner size="xl" color="blue.500" />
        <Text fontSize="lg" fontWeight="medium">
          {message}
        </Text>
      </VStack>
    </Box>
  );
};