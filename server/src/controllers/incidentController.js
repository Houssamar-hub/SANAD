const Incident = require('../models/Incident');
const { incidentSchema } = require('../validators/schemas');

let inMemoryIncidents = [];

const getIncidents = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const guestDeviceId = req.headers['x-device-id'] || req.query.guestDeviceId;

    let incidents = [];
    try {
      if (userId) {
        incidents = await Incident.find({ userId }).sort({ incidentDate: -1 });
      } else if (guestDeviceId) {
        incidents = await Incident.find({ guestDeviceId }).sort({ incidentDate: -1 });
      }
    } catch (e) {
      incidents = inMemoryIncidents.filter(i => (userId && String(i.userId) === String(userId)) || (guestDeviceId && i.guestDeviceId === guestDeviceId));
    }

    res.json({
      success: true,
      incidents
    });
  } catch (error) {
    next(error);
  }
};

const addIncident = async (req, res, next) => {
  try {
    const validated = incidentSchema.parse(req.body);
    const userId = req.user?._id;
    const guestDeviceId = req.headers['x-device-id'] || validated.guestDeviceId;

    let newIncident = null;
    try {
      newIncident = await Incident.create({
        userId,
        guestDeviceId,
        incidentType: validated.incidentType,
        description: validated.description,
        location: validated.location,
        incidentDate: validated.incidentDate ? new Date(validated.incidentDate) : new Date()
      });
    } catch (e) {
      newIncident = {
        _id: 'inc_' + Date.now(),
        userId,
        guestDeviceId,
        incidentType: validated.incidentType,
        description: validated.description,
        location: validated.location,
        incidentDate: validated.incidentDate ? new Date(validated.incidentDate) : new Date(),
        createdAt: new Date()
      };
      inMemoryIncidents.unshift(newIncident);
    }

    res.status(201).json({
      success: true,
      message: 'Incident consigné en toute confidentialité',
      incident: newIncident
    });
  } catch (error) {
    next(error);
  }
};

const deleteIncident = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      await Incident.findByIdAndDelete(id);
    } catch (e) {
      inMemoryIncidents = inMemoryIncidents.filter(i => i._id !== id);
    }

    res.json({
      success: true,
      message: 'Entrée supprimée définitivement.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getIncidents,
  addIncident,
  deleteIncident
};
