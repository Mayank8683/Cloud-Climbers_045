// src/components/Logo.js

import React from "react";
import { Box, Image, Text, useColorModeValue } from "@chakra-ui/react";
import logoSrc from "../assets/logo.png";

export const Logo = () => {
  return (
    <Box display={{ base: "none", md: "flex" }} alignItems="center" gap={2}>
      <Image src={logoSrc} height="40px" width="40px" alt="logo" />
      <Text fontWeight="semibold">DocEase</Text>
    </Box>
  );
};
