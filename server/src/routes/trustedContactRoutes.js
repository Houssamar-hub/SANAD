const express = require('express');
const router = express.Router();
const trustedContactController = require('../controllers/trustedContactController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, trustedContactController.getContacts);
router.post('/', optionalAuth, trustedContactController.addContact);
router.delete('/:id', optionalAuth, trustedContactController.deleteContact);

module.exports = router;
