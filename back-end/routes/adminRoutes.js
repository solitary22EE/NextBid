const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
//const { admin } = require('../middleware/adminMiddleware');

router.get('/users', protect, getAllUsers);
router.delete('/users/:id', protect, deleteUser);

module.exports = router;
