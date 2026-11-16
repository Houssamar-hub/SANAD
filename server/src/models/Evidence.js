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
  fileReference: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number
  },
  encrypted: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    enum: ['capture_ecran', 'message', 'document', 'photo', 'audio'],
    default: 'capture_ecran'
  },
  hashSha256: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Evidence', evidenceSchema);
