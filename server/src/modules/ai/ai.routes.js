/**
 * SANAD AI Assistant - Express Router
 */

const express = require('express');
const router = express.Router();
const aiController = require('./ai.controller');

// AI Assistant Endpoints
router.post('/chat', aiController.chat);
router.post('/detect-intent', aiController.detectIntent);
router.post('/legal-search', aiController.legalSearch);
router.post('/safety-guidance', aiController.safetyGuidance);
router.get('/sources', aiController.getSources);

module.exports = router;
