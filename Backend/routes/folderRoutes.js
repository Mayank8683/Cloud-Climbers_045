// routes/folderRoutes.js

const { Router } = require("express");
const Folder = require("../models/Folder"); // Assuming Folder model is in models/Folder.js

const folderRouter = Router();

// 1. Create a new folder
folderRouter.post("/", async (req, res) => {
  try {
    const { name, parentFolder } = req.body;
    const newFolder = new Folder({ name, parentFolder });
    const savedFolder = await newFolder.save();
    res.status(201).json(savedFolder);
  } catch (error) {
    res.status(500).json({ message: "Error creating folder", error });
  }
});

// 2. Get all folders
folderRouter.get("/", async (req, res) => {
  try {
    const folders = await Folder.find();
    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving folders", error });
  }
});

// 3. Get a single folder by ID
folderRouter.get("/:id", async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id).populate(
      "parentFolder"
    );
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    res.status(200).json(folder);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving folder", error });
  }
});

// 4. Update a folder
folderRouter.put("/:id", async (req, res) => {
  try {
    const { name, parentFolder } = req.body;
    const updatedFolder = await Folder.findByIdAndUpdate(
      req.params.id,
      { name, parentFolder },
      { new: true }
    );
    if (!updatedFolder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    res.status(200).json(updatedFolder);
  } catch (error) {
    res.status(500).json({ message: "Error updating folder", error });
  }
});

// 5. Delete a folder
folderRouter.delete("/:id", async (req, res) => {
  try {
    const deletedFolder = await Folder.findByIdAndDelete(req.params.id);
    if (!deletedFolder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting folder", error });
  }
});

module.exports = folderRouter;
