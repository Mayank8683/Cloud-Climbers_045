import React from "react";
import { Flex, Heading, Text, Image, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import document from "../assets/documents.png";
import reading from "../assets/reading.png";

const Main = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      textAlign="center"
      py={{ base: 10, md: 20 }}
    >
      <Heading as="h1" fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
        Your wiki, docs, & projects. Together.
      </Heading>
      <Text fontSize={{ base: "md", md: "xl" }} mb={8}>
        DocEase is the connected workspace where better, faster work happens.
      </Text>
      <Button
        onClick={handleLoginClick}
        bg="white"
        color="black"
        px={4}
        py={2}
        borderRadius="md"
        fontSize={{ base: "md", md: "lg" }}
        _hover={{ bg: "gray.200" }}
      >
        Enter DocEase →
      </Button>

      {/* Illustrations */}
      <Flex mt={16} gap={{ base: 4, md: 8 }} wrap="wrap" justify="center">
        <Image src={document} alt="Illustration 1" boxSize={{ base: "120px", md: "160px" }} />
        <Image src={reading} alt="Illustration 2" boxSize={{ base: "120px", md: "160px" }} />
      </Flex>
    </Flex>
  );
};

export default Main;
