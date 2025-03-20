const express = require('express');
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');
const FilesController = require('../controllers/FilesController');
const Bull = require('bull');

const fileQueue = new Bull('fileQueue');

const router = express.Router({ mergeParams: true });

// User routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);

// File routes
router.get('/files/:id', FilesController.getShow); // GET specific file
router.get('/files', FilesController.getIndex); // GET all files
router.post('/files', FilesController.postUpload); // POST upload file
router.put('/files/:id/publish', FilesController.putPublish); // PUT publish file
router.put('/files/:id/unpublish', FilesController.putUnpublish); // PUT unpublish file
router.get('/files/:id/data', FilesController.getFile); // GET file content (new route)

module.exports = { router, fileQueue };

