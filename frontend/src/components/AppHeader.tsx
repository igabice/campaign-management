import { Box, Flex, Heading } from "@chakra-ui/react";

export const AppHeader = () => {
  return (
    <>
      <Flex
        align="center"
        justify="space-between"
        p={4}
        bg="gray.800"
        color="whiteAlpha.900"
        boxShadow="md"
      >
        <Box fontSize="2xl" fontWeight="bold">
          <Heading>Campaign Manager</Heading>
        </Box>
      </Flex>
    </>
  );
};
