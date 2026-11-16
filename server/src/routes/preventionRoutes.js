const express = require('express');
const router = express.Router();
const preventionController = require('../controllers/preventionController');

router.get('/', preventionController.getCampaigns);
router.get('/:id', preventionController.getCampaignById);

module.exports = router;
