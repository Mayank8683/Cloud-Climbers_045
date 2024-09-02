import React from "react";
import { Button, Flex, Box, useColorModeValue } from "@chakra-ui/react";
import { Logo } from "./Logo";

export const Footer = () => {
  const bg = useColorModeValue("white", "#1F1F1F");
  const color = useColorModeValue("gray.800", "white");

  return (
    <Flex
      as="footer"
      align="center"
      justify="space-between"
      p={6}
      w="full"
      bg={bg}
      color={color}
      zIndex="50"
      flexDirection={{ base: "column", md: "row" }} // Stack vertically on small screens
    >
      <Logo />

      <Flex
        align="center"
        gap={2}
        ml={{ base: 0, md: "auto" }}
        justify={{ base: "center", md: "flex-end" }}
        w="full"
        mt={{ base: 4, md: 0 }} // Add margin-top on small screens
        flexDirection={{ base: "column", md: "row" }} // Stack buttons vertically on small screens
      >
        <Button 
          variant="ghost" 
          size="sm" 
          as="a" 
          href="/privacy-policy" 
          aria-label="Privacy Policy"
        >
          Privacy Policy
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          as="a" 
          href="/terms-and-conditions" 
          aria-label="Terms and Conditions"
        >
          Terms & Conditions
        </Button>
      </Flex>
    </Flex>
  );
};
