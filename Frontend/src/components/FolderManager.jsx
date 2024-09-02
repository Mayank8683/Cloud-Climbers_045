import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Heading,
  List,
  ListItem,
  useDisclosure,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useToast
} from '@chakra-ui/react';

const FolderManager = ({ onFolderSelect }) => {
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await axios.get('https://docease-ovq2.onrender.com/api/folders');
        setFolders(res.data);
      } catch (err) {
        console.error('Failed to fetch folders', err);
        toast({
          title: 'Error fetching folders',
          description: 'There was an error loading your folders.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchFolders();
  }, [toast]);

  const handleCreateFolder = async () => {
    if (newFolderName) {
      try {
        const res = await axios.post('https://docease-ovq2.onrender.com/api/folders', { name: newFolderName });
        setFolders([...folders, res.data]);
        setNewFolderName(''); // Clear input field
        onClose(); // Close the modal
        toast({
          title: 'Folder created.',
          description: 'Your folder has been successfully created.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        console.error('Failed to create folder', err);
        toast({
          title: 'Error creating folder',
          description: 'There was an error creating the folder.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>Folder Manager</Heading>
      <Button colorScheme="blue" onClick={onOpen} mb={4}>
        Create New Folder
      </Button>
      <List spacing={3}>
        {folders.map((folder) => (
          <ListItem
            key={folder._id}
            p={3}
            borderWidth="1px"
            borderRadius="md"
            cursor="pointer"
            _hover={{ bg: 'gray.100' }}
            onClick={() => onFolderSelect(folder._id)}
          >
            {folder.name}
          </ListItem>
        ))}
      </List>

      {/* Create Folder Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Folder</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Enter folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleCreateFolder} ml={3}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default FolderManager;
