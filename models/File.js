// models/File.js

const mongoose = require('mongoose');

// Define the File Schema
const FileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Store the user who owns the file
  name: { type: String, required: true }, // Name of the file or folder
  type: { type: String, enum: ['folder', 'file', 'image'], required: true }, // File type (folder, file, image)
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'File', default: 0 }, // Parent folder ID (default to 0 for root)
  isPublic: { type: Boolean, default: false }, // Public status of the file
  localPath: { type: String }, // Path to the file on the local filesystem (only for file/image types)
  createdAt: { type: Date, default: Date.now }, // Automatically set the file creation date
});

// Create a model based on the schema
const File = mongoose.model('File', FileSchema);

module.exports = File;
