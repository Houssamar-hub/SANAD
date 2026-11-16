const express = require('express');
const aiRouter = require('../modules/ai/ai.routes');
const aiController = require('../modules/ai/ai.controller');
const { optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Mount all advanced AI Assistant routes
router.use('/', optionalAuth, aiRouter);
router.post('/feedback', optionalAuth, aiController.feedback);

module.exports = router;
