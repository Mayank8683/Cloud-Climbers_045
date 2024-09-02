import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Button,
  Box,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";

const RichTextEditor = ({ initialContent, onSave, onShare }) => {
  const quillRef = useRef(null);
  const [content, setContent] = useState(initialContent || "");
  const [email, setEmail] = useState("");
  const [shareableLink, setShareableLink] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (quillRef.current) {
      const quillInstance = quillRef.current.getEditor();
      quillInstance.clipboard.dangerouslyPasteHTML(initialContent);
    }
  }, [initialContent]);

  const handleChange = (value) => {
    setContent(value);
  };

  const handleSave = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      onSave(editor.root.innerHTML);
    }
  };

  const handleGenerateLink = () => {
    const link = `https://docease-ovq2.onrender.com/document/${generateUniqueId()}`;
    setShareableLink(link);
    if (onShare) {
      onShare(link, content);
    }
  };

  const handleInvite = async () => {
    if (email) {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "https://docease-ovq2.onrender.com/api/documents/invite",
          { email, content, shareableLink },
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          }
        );

        if (response.status === 200) {
          toast({
            title: "Invitation Sent",
            description: `An invitation has been sent to ${email}`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setEmail("");
        } else {
          toast({
            title: "Error",
            description: "Failed to send invitation",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while sending the invitation",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const generateUniqueId = () => Math.random().toString(36).substring(2, 15);

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["clean"],
      ["code-block"],
    ],
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "video",
    "color",
    "background",
    "align",
    "clean",
    "code-block",
  ];

  return (
    <Box>
      <ReactQuill
        ref={quillRef}
        value={content}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder="Write something amazing..."
        style={{ height: "70vh", marginBottom: "20px" }}
      />
      <Button
        colorScheme="blue"
        onClick={handleSave}
        m={10}
        aria-label="Save content"
      >
        Save
      </Button>

      <Box mb={4}>
        <Button
          colorScheme="teal"
          onClick={handleGenerateLink}
          aria-label="Generate shareable link"
        >
          Generate Shareable Link
        </Button>
        {shareableLink && (
          <Box mt={2}>
            <a href={shareableLink} target="_blank" rel="noopener noreferrer">
              {shareableLink}
            </a>
          </Box>
        )}
      </Box>

      <Box mt={4}>
        <FormControl>
          <FormLabel>Invite Collaborator by Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter collaborator's email"
            mb={2}
          />
          <Button
            colorScheme="green"
            onClick={handleInvite}
            isLoading={loading}
            aria-label="Invite collaborator"
          >
            Invite
          </Button>
        </FormControl>
      </Box>
    </Box>
  );
};

export default RichTextEditor;
