const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  guestDeviceId: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['capture_ecran', 'photo_blessure', 'enregistrement_audio', 'certificat_medical', 'temoignage', 'autre'],
    default: 'capture_ecran'
  },
  incidentDate: {
    type: Date,
    default: Date.now
  },
  fileReference: {
    type: String,
    required: false
  },
  fileType: {
    type: String,
    default: 'image'
  },
  fileSize: {
    type: Number,
    default: 0
  },
  hashSha256: {
    type: String,
    default: ''
  },
  encrypted: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }],
  accessLogs: [{
    action: { type: String, enum: ['created', 'viewed', 'exported', 'updated', 'deleted'] },
    timestamp: { type: Date, default: Date.now },
    ip: { type: String }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Evidence', evidenceSchema);
