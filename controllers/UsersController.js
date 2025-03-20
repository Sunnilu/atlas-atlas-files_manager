// controllers/UsersController.js

const User = require('../models/User');
const sha1 = require('sha1');  // We use the `sha1` library to hash the password
const redisClient = require('../config/redisClient'); // Redis client
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');  // bcrypt used for password comparison

// POST /users - Create a new user
exports.postNew = async (req, res) => {
  const { email, password } = req.body;

  // Check if email is provided
  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  // Check if password is provided
  if (!password) {
    return res.status(400).json({ error: 'Missing password' });
  }

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password using SHA1
    const hashedPassword = sha1(password);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Return the created user (with only the email and id)
    res.status(201).json({
      id: newUser._id,
      email: newUser.email,
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Helper function to decode basic auth header
const decodeBasicAuth = (authHeader) => {
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [email, password] = credentials.split(':');
  return { email, password };
};

// GET /connect - Sign-in user and generate a token
exports.getConnect = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { email, password } = decodeBasicAuth(authHeader);

  try {
    // Find the user based on the email
    const user = await User.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Generate a new token
    const token = uuidv4();

    // Store token in Redis with a 24-hour expiration (86400 seconds)
    await redisClient.set(`auth_${token}`, user.id, 'EX', 86400);

    // Return the token
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET /disconnect - Sign-out user by deleting token from Redis
exports.getDisconnect = async (req, res) => {
  const token = req.headers['x-token'];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Check if the token exists in Redis
    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Delete the token from Redis
    await redisClient.del(`auth_${token}`);

    // Return no content status
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET /users/me - Retrieve the current user based on the token
exports.getMe = async (req, res) => {
  const token = req.headers['x-token'];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Retrieve the user ID from Redis using the token
    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Retrieve the user from your DB
    const user = await User.findById(userId, 'email id');

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Return the user data (email and id)
    return res.status(200).json({ email: user.email, id: user.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
