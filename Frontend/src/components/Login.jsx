import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  FormControl,
  FormLabel,
  useToast,
  Container,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { Link as RouterLink } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const toast = useToast();
  const [loginError, setLoginError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        throw new Error("Email and password are required.");
      }
      await login(email, password);
      toast({
        title: "Login successful.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      setLoginError(err.response?.data?.message || err.message || "An error occurred.");
      toast({
        title: "Login failed.",
        description: err.response?.data?.message || err.message || "An error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="md" h="70vh" display="flex" alignItems="center" justifyContent="center">
      <Box
        maxW="md"
        mx="auto"
        p={6}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="md"
        bg="white"
        borderColor="gray.200"
      >
        <Heading as="h2" size="lg" mb={6} textAlign="center">
          Login to Your Account
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                variant="filled"
                focusBorderColor="blue.500"
                aria-label="Email"
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                variant="filled"
                focusBorderColor="blue.500"
                aria-label="Password"
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              px={4}
              py={2}
              borderRadius="md"
              fontSize="lg"
              width="full"
            >
              Login
            </Button>
            {loginError && (
              <Text color="red.500" textAlign="center" mt={4}>
                {loginError}
              </Text>
            )}
            <Text mt={4} textAlign="center">
              Don't have an account?{" "}
              <Link as={RouterLink} to="/register" color="blue.500">
                Register here
              </Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
