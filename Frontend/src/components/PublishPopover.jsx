import React, { useState } from "react";
import { Button, Input, Flex, Text, useToast, Box } from "@chakra-ui/react";
import { Check, Copy, X } from "lucide-react"; // Importing icons

const PublishPopover = ({ isPublished, url, isSubmitting, onPublish, onUnpublish }) => {
  const [copied, setCopied] = useState(false);
  const [showUnpublished, setShowUnpublished] = useState(true);
  const toast = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast({
      title: "URL copied!",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    setTimeout(() => setCopied(false), 1000);
    setShowUnpublished(false); // Close the unpublished popup
  };

  return (
    <Flex
      direction="column"
      p={4}
      width={{ base: "full", md: "auto" }} // Responsive width
      maxWidth="400px" // Maximum width
      bg="white"
      borderRadius="md"
      boxShadow="md"
    >
      {isPublished ? (
        <>
          <Flex
            mb={4}
            direction={{ base: "column", md: "row" }} // Responsive direction
            align={{ base: "start", md: "center" }} // Align items
            gap={2}
          >
            <Input
              value={url}
              isReadOnly
              bg="gray.100"
              borderRadius="md"
              flex="1" // Take available space
            />
            <Button
              onClick={handleCopy}
              isDisabled={copied}
              colorScheme="teal"
              variant="outline"
              size="sm"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </Flex>
          <Flex
            direction={{ base: "column", md: "row" }} // Responsive direction
            align={{ base: "start", md: "center" }} // Align items
            gap={2}
          >
            <Button
              colorScheme="red"
              isLoading={isSubmitting}
              onClick={onUnpublish}
              size="sm"
            >
              Unpublish
            </Button>
            <Button
              variant="ghost"
              colorScheme="teal"
              onClick={() => setShowUnpublished(false)}
              size="sm"
            >
              Close <X className="w-4 h-4 ml-1" />
            </Button>
          </Flex>
        </>
      ) : (
        <>
          {showUnpublished && (
            <Flex direction="column" mb={4}>
              <Text mb={4} fontSize={{ base: "sm", md: "md" }}> {/* Responsive font size */}
                Publish this note
              </Text>
              <Button
                colorScheme="teal"
                isLoading={isSubmitting}
                onClick={onPublish}
                size="sm"
              >
                Publish
              </Button>
            </Flex>
          )}
          <Button
            variant="ghost"
            colorScheme="teal"
            onClick={() => setShowUnpublished(!showUnpublished)}
            size="sm"
          >
            {showUnpublished ? "Close" : "Show Publish Options"}
          </Button>
        </>
      )}
    </Flex>
  );
};

export default PublishPopover;
