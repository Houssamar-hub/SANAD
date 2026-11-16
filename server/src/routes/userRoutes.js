const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/me', requireAuth, userController.getProfile);
router.patch('/me', requireAuth, userController.updateProfile);
router.delete('/me', requireAuth, userController.deleteAccount);

module.exports = router;
