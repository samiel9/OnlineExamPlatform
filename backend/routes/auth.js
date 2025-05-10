const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', authController.registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token (Login)
// @access  Public
router.post('/login', authController.loginUser);

// @route   GET api/auth/me
// @desc    Get current authenticated user
// @access  Private
router.get('/me', authMiddleware, authController.getCurrentUser);

// @route   PUT api/auth/me
// @desc    Update current authenticated user
// @access  Private
router.put('/me', authMiddleware, authController.updateCurrentUser);

module.exports = router;
