import React, { useState } from "react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useToast,
  Flex,
  Box,
  useBreakpointValue, // Import useBreakpointValue for responsive values
} from "@chakra-ui/react";
import { Globe } from "lucide-react";
import PublishPopover from "./PublishPopover";

const PublishButton = ({ initialData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blobUrl, setBlobUrl] = useState(""); // State to store Blob URL
  const [isPublished, setIsPublished] = useState(!!initialData.isPublished); // State to track published status
  const toast = useToast();
  
  const popoverContentWidth = useBreakpointValue({ base: "full", md: "auto" });
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });
  const buttonFontSize = useBreakpointValue({ base: "sm", md: "md" });

  const handlePublishClick = () => {
    setIsSubmitting(true);

    // Convert the document content to a Blob and generate a URL
    const blob = new Blob([initialData.content], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    setBlobUrl(url);
    setIsPublished(true); // Update the published state

    toast({
      title: "Document published.",
      description: "You can now access the document offline.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setIsSubmitting(false);
  };

  const handleUnpublishClick = () => {
    setIsSubmitting(true);

    // Revoke the Blob URL if no longer needed
    URL.revokeObjectURL(blobUrl);
    setBlobUrl("");
    setIsPublished(false); // Update the published state

    toast({
      title: "Document unpublished.",
      description: "The document is no longer accessible offline.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });

    setIsSubmitting(false);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          size={buttonSize}
          variant="outline"
          colorScheme="teal"
          leftIcon={isPublished ? <Globe /> : null}
        >
          {isPublished ? "Published" : "Publish"}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        p={4}
        width={popoverContentWidth}
        maxWidth={{ base: "100%", md: "400px" }} // Adjust maxWidth based on screen size
        bg="white"
        boxShadow="md"
        borderRadius="md" // Add borderRadius for rounded corners
      >
        <PublishPopover
          isPublished={isPublished}
          url={blobUrl}
          isSubmitting={isSubmitting}
          onPublish={handlePublishClick}
          onUnpublish={handleUnpublishClick}
        />

        {/* Status button to show current state */}
        <Flex justifyContent="center" mt={4}>
          <Box>
            <Button
              size={buttonSize}
              colorScheme={isPublished ? "green" : "red"}
              variant="outline"
              disabled
              fontSize={buttonFontSize} // Adjust font size based on screen size
            >
              {isPublished ? "Status: Published" : "Status: Unpublished"}
            </Button>
          </Box>
        </Flex>
      </PopoverContent>
    </Popover>
  );
};

export default PublishButton;
