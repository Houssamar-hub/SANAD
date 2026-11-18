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
  type: {
    type: String,
    enum: ['association', 'institution'],
    default: 'association',
    index: true
  },
  region: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  city: {
    type: String,
    required: true,
    trim: true,
    index: true
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
  email: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  logo: {
    type: String
  },
  description: {
    type: String
  },
  descriptionAr: {
    type: String
  },
  services: [{
    type: String
  }],
  category: {
    type: String,
    trim: true,
    index: true
  },
  languages: [{
    type: String
  }],
  coordinates: {
    latitude: {
      type: Number,
      required: false,
      default: 33.5731
    },
    longitude: {
      type: Number,
      required: false,
      default: -7.5898
    }
  },
  openingHours: {
    type: String,
    default: 'Lundi - Vendredi: 08:30 - 16:30'
  },
  sourceName: {
    type: String,
    default: 'Annuaire officiel / CNDH Maroc'
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

supportCenterSchema.index({ region: 1, city: 1, type: 1, services: 1 });
supportCenterSchema.index({ name: 'text', description: 'text', city: 'text' });

module.exports = mongoose.model('SupportCenter', supportCenterSchema);
