// routes/index.js

const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');

// Define routes and link them to controller methods
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// Add the POST /users route
router.post('/users', UsersController.postNew);

module.exports = router;
