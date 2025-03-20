// routes/index.js

const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController');

// Define routes and link them to controller methods
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

module.exports = router;
