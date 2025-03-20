// models/File.js

const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  fileName: String,
  filePath: String,
  createdAt: { type: Date, default: Date.now }
});

const File = mongoose.model('File', FileSchema);

module.exports = File;
