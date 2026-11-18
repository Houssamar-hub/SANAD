const express = require('express');
const router = express.Router();
const evidenceController = require('../controllers/evidenceController');

router.get('/', evidenceController.getEvidenceList);
router.post('/', evidenceController.createEvidence);
router.get('/export', evidenceController.exportAuditReport);
router.get('/:id', evidenceController.getEvidenceById);
router.delete('/:id', evidenceController.deleteEvidence);

module.exports = router;
