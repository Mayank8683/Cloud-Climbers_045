// server.js (or app.js)
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = socketIo(server); // Bind socket.io to the server

app.use(express.json());
app.use(cors());

// Socket.IO setup for real-time collaboration
io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  // Join a document room
  socket.on("joinDocument", (documentId) => {
    socket.join(documentId);
    console.log(`User ${socket.id} joined document ${documentId}`);
  });

  // Listen for changes to the document
  socket.on("editDocument", ({ documentId, content }) => {
    console.log(`Document ${documentId} edited`);
    // Broadcast the change to other users in the same room
    socket.to(documentId).emit("receiveChanges", content);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected: " + socket.id);
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
