const express = require('express');
const router = express.Router();
const centerController = require('../controllers/centerController');

router.get('/', centerController.getCenters);
router.get('/:id', centerController.getCenterById);

module.exports = router;
