const bcrypt = require('bcrypt');
const redisClient = require('../config/redisClient'); // Assume this is set up for Redis connection
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User'); // Assuming you have a User model set up to interact with your DB

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
    // Find the user based on the email (you might use findOne or a similar method in your DB)
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
