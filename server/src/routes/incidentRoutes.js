const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, incidentController.getIncidents);
router.post('/', optionalAuth, incidentController.addIncident);
router.delete('/:id', optionalAuth, incidentController.deleteIncident);

module.exports = router;
