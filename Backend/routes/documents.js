// routes/documents.js
const { Router } = require("express");
const Document = require("../models/Document");
const { transporter } = require("../config/mailerConfig");
const sendEmail = require("../utils/sendEmail");

const documentRouter = Router();

// Create a new document (with user association)
documentRouter.post("/", async (req, res) => {
  try {
    const { title, content, parentFolder } = req.body;
    const newDocument = new Document({
      title,
      content,
      parentFolder,
      user: req.user._id, // Associate document with the authenticated user
    });
    await newDocument.save();
    res.status(201).json(newDocument);
  } catch (error) {
    res.status(500).json({ error: "Failed to create document" });
  }
});

// Get all documents for the authenticated user
documentRouter.get("/", async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user._id }); // Fetch documents associated with the user
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

// Update a document (only if it belongs to the authenticated user)
documentRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, parentFolder } = req.body;

    const updatedDocument = await Document.findOneAndUpdate(
      { _id: id, user: req.user._id }, // Ensure document belongs to the user
      { title, content, parentFolder, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json(updatedDocument);
  } catch (error) {
    res.status(500).json({ error: "Failed to update document" });
  }
});

// Delete a document (only if it belongs to the authenticated user)
documentRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDocument = await Document.findOneAndDelete({
      _id: id,
      user: req.user._id, // Ensure document belongs to the user
    });

    if (!deletedDocument) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete document" });
  }
});

documentRouter.post("/invite", async (req, res) => {
  const { email, content, link } = req.body;

  if (!email || !content) {
    return res.status(400).json({ message: "Email and content are required" });
  }

  try {
    const emailResult = await sendEmail({
      to: email,
      subject: "Invitation to Collaborate on a Document",
      text: "You have been invited to collaborate on a document. Please click the link below to join.",
      html: `<p>You have been invited to collaborate on a document.</p>
             <p>Document Content Preview:</p>
             <blockquote>${content.slice(0, 200)}...</blockquote>
             <p><a href="${link}">Click here to access the document</a></p>`,
    });

    if (emailResult.success) {
      res.status(200).json({ message: "Invitation sent successfully" });
    } else {
      res.status(500).json({ message: emailResult.message });
    }
  } catch (error) {
    console.error("Error sending invitation email:", error);
    res.status(500).json({ message: "Failed to send invitation" });
  }
});

module.exports = documentRouter;
