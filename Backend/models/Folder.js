const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    parentFolder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
});

const Folder = mongoose.model('Folder', folderSchema);

module.exports = Folder;
