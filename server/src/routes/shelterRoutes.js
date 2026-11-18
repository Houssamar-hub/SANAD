const express = require('express');
const router = express.Router();
const shelterController = require('../controllers/shelterController');

router.get('/', shelterController.getSafeHouses);

module.exports = router;
