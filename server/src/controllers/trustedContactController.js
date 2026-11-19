const TrustedContact = require('../models/TrustedContact');
const { trustedContactSchema } = require('../validators/schemas');

// In-memory fallback cache for development or guest mode
let inMemoryContacts = [];

const getContacts = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const guestDeviceId = req.headers['x-device-id'] || req.query.guestDeviceId;

    let contacts = [];
    try {
      if (userId) {
        contacts = await TrustedContact.find({ userId }).sort({ createdAt: -1 });
      } else if (guestDeviceId) {
        contacts = await TrustedContact.find({
          $or: [
            { guestDeviceId },
            { guestDeviceId: null },
            { guestDeviceId: { $exists: false } },
            { userId: null }
          ]
        }).sort({ createdAt: -1 });
      } else {
        contacts = await TrustedContact.find({}).sort({ createdAt: -1 });
      }
    } catch (e) {
      contacts = inMemoryContacts;
    }

    res.json({
      success: true,
      contacts
    });
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const validated = trustedContactSchema.parse(req.body);
    const userId = req.user?._id;
    const guestDeviceId = req.headers['x-device-id'] || validated.guestDeviceId;

    let newContact = null;
    try {
      newContact = await TrustedContact.create({
        userId,
        guestDeviceId,
        name: validated.name,
        phone: validated.phone,
        relationship: validated.relationship || 'Ami(e) / Proche'
      });
    } catch (e) {
      newContact = {
        _id: 'mem_' + Date.now(),
        userId,
        guestDeviceId,
        name: validated.name,
        phone: validated.phone,
        relationship: validated.relationship || 'Ami(e) / Proche',
        createdAt: new Date()
      };
      inMemoryContacts.push(newContact);
    }

    res.status(201).json({
      success: true,
      message: 'Contact de confiance enregistré',
      contact: newContact
    });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      await TrustedContact.findByIdAndDelete(id);
    } catch (e) {
      inMemoryContacts = inMemoryContacts.filter(c => c._id !== id);
    }

    res.json({
      success: true,
      message: 'Contact supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContacts,
  addContact,
  deleteContact
};
