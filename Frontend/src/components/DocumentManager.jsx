import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import RichTextEditor from "./RichTextEditor";
import Sidebar from "./Sidebar";
import PublishButton from "./PublishButton";

const DocumentManager = () => {
  const [documents, setDocuments] = useState([]);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const cancelRef = useRef();
  const toast = useToast();
  const token = localStorage.getItem("token");

  const { isOpen, onOpen, onClose } = useDisclosure(); // Disclosure state for create modal
  const [newDocumentTitle, setNewDocumentTitle] = useState(""); // State for new document title

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get("https://docease-ovq2.onrender.com/api/documents", {
          headers: {
            "x-auth-token": token,
          },
        });
        setDocuments(res.data);
      } catch (err) {
        console.error("Failed to fetch documents", err);
        toast({
          title: "Error fetching documents",
          description: "There was an error loading your documents.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchDocuments();
  }, [token, toast]);

  const handleCreate = async () => {
    if (newDocumentTitle) {
      try {
        const res = await axios.post(
          "https://docease-ovq2.onrender.com/api/documents",
          { title: newDocumentTitle, content: "" },
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setDocuments([...documents, res.data]);
        toast({
          title: "Document created.",
          description: "Your document has been successfully created.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setNewDocumentTitle(""); // Clear the title after creation
        onClose(); // Close the modal
      } catch (err) {
        console.error("Failed to create document", err);
        toast({
          title: "Error creating document",
          description: "There was an error creating the document.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleSelectDocument = (doc) => {
    setCurrentDocument(doc);
    setPreviewDocument(null);
  };

  const handlePreviewDocument = (doc) => {
    setPreviewDocument(doc);
    setCurrentDocument(null);
  };

  const handleSaveContent = async (content) => {
    try {
      const res = await axios.put(
        `https://docease-ovq2.onrender.com/api/documents/${currentDocument._id}`,
        { title: currentDocument.title, content },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      setCurrentDocument(res.data);
      setDocuments(
        documents.map((doc) => (doc._id === res.data._id ? res.data : doc))
      );
      toast({
        title: "Document saved.",
        description: "Your document content has been saved.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Failed to save document content", err);
      toast({
        title: "Error saving document",
        description: "There was an error saving the document content.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://docease-ovq2.onrender.com/api/documents/${deleteId}`, {
        headers: {
          "x-auth-token": token,
        },
      });
      setDocuments(documents.filter((doc) => doc._id !== deleteId));
      if (currentDocument && currentDocument._id === deleteId) {
        setCurrentDocument(null);
      }
      if (previewDocument && previewDocument._id === deleteId) {
        setPreviewDocument(null);
      }
      toast({
        title: "Document deleted.",
        description: "The document has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Failed to delete document", err);
      toast({
        title: "Error deleting document",
        description: "There was an error deleting the document.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleteOpen(false);
    }
  };

  // Define responsive height and width for RichTextEditor
  const editorHeight = useBreakpointValue({ base: "40vh", md: "50vh" });
  const editorWidth = useBreakpointValue({ base: "100%", md: "100%" });

  return (
    <Flex direction="column" align="center" justify="center" h="100vh" p={4}>
      <Flex
        direction={{ base: "column", md: "row" }}
        w="100%"
        maxW="1440px"
        h="100%"
        maxH="100%"
      >
        <Sidebar
          documents={documents}
          onCreate={onOpen} // Open modal instead of directly creating
          onSelect={handleSelectDocument}
          onDelete={handleDeleteConfirmation}
          onPreview={handlePreviewDocument}
          flex={{ base: "none", md: "1" }} // Sidebar takes full width on small screens and a fraction on larger screens
          display={{ base: "none", md: "block" }} // Hide sidebar on small screens
        />

        <Box flex="1" p={6} overflowY="auto">
          {currentDocument ? (
            <Box>
              <Flex
                align="center"
                mb={4}
                direction={{ base: "column", md: "row" }}
              >
                <Heading size="md" mr={{ md: 4 }} mb={{ base: 4, md: 0 }}>
                  {currentDocument.title}
                </Heading>
                <PublishButton initialData={currentDocument} />
              </Flex>
              <RichTextEditor
                initialContent={currentDocument.content}
                onSave={handleSaveContent}
                style={{ width: editorWidth, height: editorHeight }} // Apply responsive styles
              />
            </Box>
          ) : previewDocument ? (
            <Box>
              <Heading size="md" mb={4}>
                {previewDocument.title}
              </Heading>
              <Box
                bg="gray.100"
                p={4}
                borderRadius="md"
                boxShadow="md"
                dangerouslySetInnerHTML={{ __html: previewDocument.content }}
              />
            </Box>
          ) : (
            <Text fontSize="lg" color="gray.500">
              Select a document to start editing or preview.
            </Text>
          )}
        </Box>
      </Flex>

      {/* Create Document Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Document</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Enter document title"
              value={newDocumentTitle}
              onChange={(e) => setNewDocumentTitle(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleCreate} ml={3}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteOpen(false)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Document
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this document? This action cannot
              be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default DocumentManager;
