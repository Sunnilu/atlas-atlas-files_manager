// controllers/UsersController.js

const User = require('../models/User');
const sha1 = require('sha1');  // We use the `sha1` library to hash the password

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
