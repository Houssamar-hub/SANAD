const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  titleAr: {
    type: String,
    required: true
  },
  organization: {
    type: String,
    required: true
  },
  organizationAr: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: [
      'couture_confection',
      'artisanat_cooperative',
      'cuisine_traiteur',
      'formation_diplomante',
      'microfinance_forsa',
      'teletravail',
      'service_commerce'
    ],
    required: true
  },
  region: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  descriptionAr: {
    type: String,
    required: true
  },
  requirements: [{
    type: String
  }],
  stipendOrSalary: {
    type: String,
    default: 'Rémunéré / Pris en charge'
  },
  contactPhone: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    default: ''
  },
  officialLink: {
    type: String,
    default: ''
  },
  verified: {
    type: Boolean,
    default: true
  },
  verifiedBy: {
    type: String,
    default: 'Coordination SANAD & INDH'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Opportunity', opportunitySchema);
