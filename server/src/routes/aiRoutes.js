const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.post('/chat', optionalAuth, aiController.chat);
router.post('/feedback', optionalAuth, aiController.feedback);

module.exports = router;
