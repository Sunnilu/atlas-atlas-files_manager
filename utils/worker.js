const Bull = require('bull');
const path = require('path');
const fs = require('fs');
const File = require('../models/File'); // Assuming you have a File model for storing file metadata
const imageThumbnail = require('image-thumbnail'); // Import image-thumbnail module
const fileQueue = require('../queues/fileQueue');

// Process the fileQueue to generate thumbnails
fileQueue.process(async (job) => {
  const { userId, fileId } = job.data;

  // Validate the job data
  if (!fileId) {
    throw new Error('Missing fileId');
  }
  if (!userId) {
    throw new Error('Missing userId');
  }

  // Find the file document in DB
  const file = await File.findOne({ _id: fileId, userId: userId });
  if (!file) {
    throw new Error('File not found');
  }

  if (file.type !== 'image') {
    throw new Error('File is not an image');
  }

  // Generate thumbnails
  try {
    const sizes = [500, 250, 100];
    for (let size of sizes) {
      const thumbnailPath = path.join(path.dirname(file.localPath), `${path.basename(file.localPath, path.extname(file.localPath))}_${size}${path.extname(file.localPath)}`);
      
      const thumbnail = await imageThumbnail(file.localPath, { width: size });
      fs.writeFileSync(thumbnailPath, thumbnail);
    }
    console.log('Thumbnails generated for file:', fileId);
  } catch (error) {
    console.error('Error generating thumbnails:', error);
  }
});
