const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  questionAr: {
    type: String
  },
  options: [{
    text: { type: String, required: true },
    textAr: { type: String }
  }],
  correctAnswerIndex: {
    type: Number,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  explanationAr: {
    type: String
  },
  legalReference: {
    type: String
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  titleAr: {
    type: String
  },
  description: {
    type: String
  },
  descriptionAr: {
    type: String
  },
  category: {
    type: String,
    enum: ['droits_fondamentaux', 'harcelement_rue', 'cybersecurite', 'travail', 'famille_moudawana'],
    default: 'droits_fondamentaux'
  },
  questions: [questionSchema],
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);
