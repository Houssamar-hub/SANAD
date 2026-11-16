const express = require('express');
const router = express.Router();
const legalController = require('../controllers/legalController');

router.get('/categories', legalController.getCategories);
router.get('/', legalController.getLegalDocuments);
router.get('/:id', legalController.getLegalDocumentById);

module.exports = router;
