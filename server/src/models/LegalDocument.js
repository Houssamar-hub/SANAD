const mongoose = require('mongoose');

const legalDocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  titleAr: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'droits_fondamentaux',
      'violence_physique',
      'violence_psychologique',
      'violence_economique',
      'violence_sexuelle',
      'harcelement',
      'cyberharcelement',
      'discrimination',
      'acces_justice'
    ]
  },
  content: {
    type: String,
    required: true
  },
  contentAr: {
    type: String
  },
  simplifiedExplanation: {
    type: String,
    required: true
  },
  simplifiedExplanationAr: {
    type: String
  },
  lawNumber: {
    type: String,
    required: true,
    trim: true
  },
  articleNumber: {
    type: String,
    trim: true
  },
  rightsConcerned: [{
    type: String
  }],
  possibleSteps: [{
    step: Number,
    title: String,
    description: String,
    titleAr: String,
    descriptionAr: String
  }],
  sourceUrl: {
    type: String,
    required: true
  },
  sourceType: {
    type: String,
    default: 'adala.justice.gov.ma'
  },
  publicationDate: {
    type: String
  },
  verifiedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['verified', 'draft'],
    default: 'verified'
  }
}, {
  timestamps: true
});

legalDocumentSchema.index({ title: 'text', content: 'text', simplifiedExplanation: 'text' });

module.exports = mongoose.model('LegalDocument', legalDocumentSchema);
