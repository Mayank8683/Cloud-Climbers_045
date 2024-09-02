import React, { useState } from "react";
import { Box, Flex, Image, Text, Button, useToast, useBreakpointValue, useDisclosure, IconButton } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [state, setState] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const logoSize = useBreakpointValue({ base: "20px", md: "24px" });
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/dashboard"); // Change to the actual profile/dashboard route
  };

  const handleLogoutClick = () => {
    logout();
    setState(!state);
    toast({
      title: "Logged out.",
      description: "You have been successfully logged out.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    navigate("/");
  };

  return (
    <Flex
      as="header"
      width="100%"
      maxW="1440px"
      justify="space-between"
      align="center"
      p={5}
      bg="gray.800"
      color="white"
      mx="auto"
      wrap={{ base: "wrap", md: "nowrap" }}
    >
      {/* Logo and Branding */}
      <Flex align="center" mb={{ base: 4, md: 0 }}>
        <Image src={logo} alt="Logo" boxSize={logoSize} mr={2} />
        <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" cursor="pointer">
          DocEase
        </Text>
      </Flex>

      {/* Hamburger Menu Icon */}
      <IconButton
        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
        aria-label="Toggle Navigation"
        display={{ base: "flex", md: "none" }}
        onClick={isOpen ? onClose : onOpen}
        size="lg"
        color="white"
        bg="transparent"
        _hover={{ bg: "gray.700" }}
      />

      {/* Navigation Items */}
      <Flex
        align="center"
        gap={4}
        flexWrap="wrap"
        display={{ base: isOpen ? "flex" : "none", md: "flex" }}
        direction={{ base: "column", md: "row" }}
        mt={{ base: 4, md: 0 }}
      >
        {!user ? (
          <Button
            onClick={handleLoginClick}
            bg="transparent"
            color="white"
            px={4}
            py={2}
            borderRadius="md"
            fontSize={buttonSize}
            _hover={{ bg: "gray.900" }}
          >
            Enter DocEase →
          </Button>
        ) : (
          <>
            <Box
              h="32px"
              w="32px"
              bg="gray.700"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              onClick={handleProfileClick}
            >
              <Text fontSize="sm" color="white">
                U
              </Text>
            </Box>
            <Button
              onClick={handleLogoutClick}
              bg="transparent"
              color="white"
              px={4}
              py={2}
              borderRadius="md"
              fontSize={buttonSize}
              _hover={{ bg: "gray.700" }}
            >
              Logout
            </Button>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default Navbar;
