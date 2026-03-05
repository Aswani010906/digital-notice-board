const express = require('express');
const router = express.Router();
const { createUser, getUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('admin'), createUser)
    .get(protect, authorize('admin'), getUsers);

module.exports = router;
