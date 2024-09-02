// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Avatar,
  useToast,
  Spinner,
  Center,
} from "@chakra-ui/react";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/"); // Redirect to login if not authenticated
        return;
      }

      try {
        const res = await axios.get("https://docease-ovq2.onrender.com/api/auth/me", {
          headers: {
            "x-auth-token": token,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
        toast({
          title: "Failed to fetch user data",
          description: "Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        localStorage.removeItem("token");
        navigate("/"); // Redirect to login on error
      }
    };

    fetchUser();
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Box
      maxW={{ base: "full", sm: "md", md: "lg" }}
      mx="auto"
      mt={10}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      textAlign="center"
    >
      <Heading as="h2" size={{ base: "lg", md: "xl" }} mb={6}>
        Dashboard
      </Heading>
      {user ? (
        <Flex
          align="center"
          justify="center"
          direction={{ base: "column", md: "row" }}
        >
          <Avatar
            name={user.username}
            src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
            size={{ base: "xl", md: "2xl" }}
            mb={{ base: 4, md: 0 }}
            mx="auto"
          />
          <Box ml={{ md: 6 }} textAlign={{ base: "center", md: "left" }}>
            <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
              {user.username}
            </Text>
            <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
              Email: {user.email}
            </Text>
          </Box>
        </Flex>
      ) : (
        <Center>
          <Spinner size="lg" />
          <Text ml={4}>Loading user information...</Text>
        </Center>
      )}
      <Button
        mt={6}
        bg="white"
        color="black"
        px={4}
        py={2}
        borderRadius="md"
        fontSize={{ base: "md", md: "lg" }}
        _hover={{ bg: "gray.700", color: "white" }}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Dashboard;
