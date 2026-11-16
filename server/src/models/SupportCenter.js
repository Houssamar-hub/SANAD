const mongoose = require('mongoose');

const supportCenterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  nameAr: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  cityAr: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  addressAr: {
    type: String
  },
  phone: {
    type: String,
    required: true
  },
  emergencyPhone: {
    type: String
  },
  services: [{
    type: String
  }],
  languages: [{
    type: String
  }],
  coordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  openingHours: {
    type: String,
    default: 'Lundi - Vendredi: 08:30 - 16:30'
  },
  sourceUrl: {
    type: String
  },
  verified: {
    type: Boolean,
    default: true
  },
  verifiedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

supportCenterSchema.index({ city: 1, services: 1 });

module.exports = mongoose.model('SupportCenter', supportCenterSchema);
