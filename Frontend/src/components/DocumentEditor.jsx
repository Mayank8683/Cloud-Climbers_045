// src/components/DocumentEditor.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Box, Textarea } from "@chakra-ui/react";

const socket = io("https://docease-ovq2.onrender.com"); // Connect to the server

const DocumentEditor = ({ documentId }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    // Join the document room when the component mounts
    socket.emit("joinDocument", documentId);

    // Listen for changes from the server
    socket.on("receiveChanges", (updatedContent) => {
      setContent(updatedContent);
    });

    // Clean up the event listeners when the component unmounts
    return () => {
      socket.off("receiveChanges");
    };
  }, [documentId]);

  const handleChange = (e) => {
    const updatedContent = e.target.value;
    setContent(updatedContent);

    // Emit the changes to the server
    socket.emit("editDocument", { documentId, content: updatedContent });
  };

  return (
    <Box
      p={4}
      maxW="container.lg"
      mx="auto"
      mt={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
    >
      <Textarea
        value={content}
        onChange={handleChange}
        placeholder="Edit your document here..."
        size="lg"
        resize="none"
        width="100%"
        height={{ base: "300px", md: "400px" }}
        borderColor="gray.300"
        _placeholder={{ color: "gray.500" }}
      />
    </Box>
  );
};

export default DocumentEditor;
