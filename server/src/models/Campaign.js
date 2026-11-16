const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  titleAr: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  descriptionAr: {
    type: String
  },
  category: {
    type: String,
    enum: ['prevention', 'droits', 'cybersecurite', 'universite', 'cndh_campagne'],
    default: 'prevention'
  },
  image: {
    type: String,
    default: 'default_campaign.jpg'
  },
  keyTakeaways: [{
    type: String
  }],
  actionTips: [{
    type: String
  }],
  publishedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Campaign', campaignSchema);
