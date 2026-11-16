const mongoose = require('mongoose');

const trustedContactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Can be stored anonymously or with user account
  },
  guestDeviceId: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  relationship: {
    type: String,
    default: 'Ami(e) / Proche'
  },
  canReceiveAlert: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TrustedContact', trustedContactSchema);
