import React from "react";
import { Box } from "@chakra-ui/react";
import { HomeHeader } from "./HomeHeader";

interface BlogLayoutProps {
  children: React.ReactNode;
}

export const BlogLayout: React.FC<BlogLayoutProps> = ({ children }) => {
  return (
    <>
      <HomeHeader />
      <Box pt="24">
        {children}
      </Box>
    </>
  );
};