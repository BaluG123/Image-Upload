const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const userController = require('../controllers/userController');

const router = express.Router();

// POST endpoint for adding a user
router.post('/', upload.single('image'), userController.addUser);

// GET endpoint for retrieving all users
router.get('/', userController.getUsers);

module.exports = router;
