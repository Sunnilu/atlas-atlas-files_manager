// controllers/AppController.js

const redis = require('redis');
const mongoose = require('mongoose');
const User = require('../models/User');  // Assuming you have a User model
const File = require('../models/File');  // Assuming you have a File model

// Create Redis client
const redisClient = redis.createClient();

// Check Redis connection
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Check Redis connection error
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// GET /status - Check Redis and DB health
exports.getStatus = (req, res) => {
  // Check if Redis is alive
  redisClient.ping((err, result) => {
    const redisStatus = err ? false : true;
    
    // Check DB connection
    mongoose.connection.db.admin().ping((err, result) => {
      const dbStatus = err ? false : true;
      res.status(200).json({ redis: redisStatus, db: dbStatus });
    });
  });
};

// GET /stats - Return user and file counts
exports.getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const fileCount = await File.countDocuments();
    
    res.status(200).json({ users: userCount, files: fileCount });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
