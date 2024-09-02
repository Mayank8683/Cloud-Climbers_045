import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Text,
  Link,
  Container,
  useBreakpointValue, // For responsive design
} from "@chakra-ui/react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://docease-ovq2.onrender.com/api/auth/register", {
        username,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setRegisterSuccess(true);
      setTimeout(() => {
        navigate("/login"); // Redirect to login page after successful registration
      }, 1000); // Delay navigation to show the success message
    } catch (err) {
      console.error(err);
      setRegisterError(
        "Please try again. Ensure all fields are filled correctly."
      );
      setRegisterSuccess(false);
    }
  };

  return (
    <Container
      maxW={{ base: "90%", sm: "80%", md: "60%", lg: "50%" }}
      minH="70vh"
      py={{ base: 8, md: 12 }}
      centerContent
    >
      <Box
        w="100%"
        maxW="md"
        p={6}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="md"
      >
        <Heading as="h2" size={{ base: "lg", md: "xl" }} textAlign="center" mb={6}>
          Register
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="username" isRequired>
              <FormLabel fontSize={{ base: "sm", md: "md" }}>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                fontSize={{ base: "sm", md: "md" }}
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel fontSize={{ base: "sm", md: "md" }}>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                fontSize={{ base: "sm", md: "md" }}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel fontSize={{ base: "sm", md: "md" }}>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                fontSize={{ base: "sm", md: "md" }}
              />
            </FormControl>
            <Button
              type="submit"
              bg="teal.500"
              color="white"
              px={4}
              py={2}
              borderRadius="md"
              fontSize={{ base: "sm", md: "md" }}
              _hover={{ bg: "teal.600" }}
              width="full"
            >
              Register
            </Button>
            {registerSuccess && (
              <Text color="green.500" textAlign="center" mt={4}>
                Registration successful! Redirecting to login...
              </Text>
            )}
            {registerError && (
              <Text color="red.500" textAlign="center" mt={4}>
                {registerError}
              </Text>
            )}
            <Text mt={4} textAlign="center" fontSize={{ base: "sm", md: "md" }}>
              Already have an account?{" "}
              <Link color="blue.500" href="/login">
                Login here
              </Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
