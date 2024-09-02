import React from "react";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  VStack,
} from "@chakra-ui/react";
import { FiMoreVertical } from "react-icons/fi";

const Sidebar = React.memo(({ documents, onCreate, onSelect, onDelete, onPreview }) => {
  return (
    <Box
      as="aside"
      w="250px"
      p={4}
      bg="gray.100"
      borderRight="1px solid"
      borderColor="gray.200"
      h="100vh"
      overflowY="auto"
    >
      {/* Create New Document Button */}
      <Button colorScheme="teal" onClick={onCreate} w="100%" mb={4}>
        Create New Document
      </Button>

      {/* Document List */}
      <VStack as={List} spacing={4} align="stretch" w="100%">
        {documents.map((doc) => (
          <ListItem
            key={doc._id}
            p={3}
            bg="white"
            borderRadius="md"
            boxShadow="sm"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            w="100%"
          >
            <Box flex="1" ml={2} fontWeight="semibold">
              {doc.title}
            </Box>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Document options"
                icon={<FiMoreVertical />}
                variant="outline"
                size="sm"
                aria-haspopup="true"
              />
              <MenuList>
                <MenuItem onClick={() => onPreview(doc)}>Preview</MenuItem>
                <MenuItem onClick={() => onSelect(doc)}>Edit</MenuItem>
                <MenuItem onClick={() => onDelete(doc._id)}>Delete</MenuItem>
              </MenuList>
            </Menu>
          </ListItem>
        ))}
      </VStack>
    </Box>
  );
});

export default Sidebar;
