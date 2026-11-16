const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  guestDeviceId: {
    type: String,
    required: false
  },
  incidentType: {
    type: String,
    required: true,
    enum: [
      'harcelement_rue',
      'cyberharcelement',
      'violence_conjugale',
      'chantage_numerique',
      'menaces',
      'discrimination_travail',
      'autre'
    ]
  },
  description: {
    type: String,
    required: true
  },
  incidentDate: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String
  },
  notes: {
    type: String
  },
  attachments: [{
    fileName: String,
    fileType: String,
    fileUri: String,
    uploadedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Incident', incidentSchema);
