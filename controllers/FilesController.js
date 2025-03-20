// controllers/FilesController.js

const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const File = require('../models/File'); // Assuming you have a File model for storing file metadata
const redisClient = require('../config/redisClient'); // Redis client

// Helper function to retrieve the user based on the token
const getUserFromToken = async (token) => {
  const userId = await redisClient.get(`auth_${token}`);
  if (!userId) {
    return null; // Token not found or expired
  }
  return await User.findById(userId);
};

// POST /files - Handle file upload
exports.postUpload = async (req, res) => {
  const { name, type, parentId = 0, isPublic = false, data } = req.body;
  const token = req.headers['x-token'];  // Retrieve token from header

  // Check if user is authenticated
  const user = await getUserFromToken(token);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Validate required fields
  if (!name) {
    return res.status(400).json({ message: 'Missing name' });
  }
  if (!type || !['folder', 'file', 'image'].includes(type)) {
    return res.status(400).json({ message: 'Missing or invalid type' });
  }
  if ((type === 'file' || type === 'image') && !data) {
    return res.status(400).json({ message: 'Missing data' });
  }

  // Validate parentId if specified
  if (parentId !== 0) {
    const parentFile = await File.findById(parentId);
    if (!parentFile) {
      return res.status(400).json({ message: 'Parent not found' });
    }
    if (parentFile.type !== 'folder') {
      return res.status(400).json({ message: 'Parent is not a folder' });
    }
  }

  try {
    let localPath = null;

    if (type !== 'folder') {
      // Ensure the directory exists for storing files
      const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      // Create a unique file name using UUID
      const fileName = uuidv4();
      localPath = path.join(folderPath, fileName);

      // Decode the base64 data and write it to the local file system
      const buffer = Buffer.from(data, 'base64');
      fs.writeFileSync(localPath, buffer);
    }

    // Create new file record in the database
    const newFile = new File({
      userId: user._id, // Associate the file with the authenticated user
      name,
      type,
      parentId,
      isPublic,
      localPath,
    });

    // Save the new file to the database
    await newFile.save();

    // Return the newly created file object
    return res.status(201).json(newFile);
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
