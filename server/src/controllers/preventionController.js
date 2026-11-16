const Campaign = require('../models/Campaign');
const { campaigns } = require('../utils/seedData');

const getCampaigns = async (req, res, next) => {
  try {
    const { category } = req.query;
    let list = [];
    try {
      const q = category ? { category } : {};
      list = await Campaign.find(q);
    } catch (e) {
      list = campaigns.filter(c => !category || c.category === category);
    }

    if (list.length === 0 && !category) {
      list = campaigns;
    }

    res.json({
      success: true,
      count: list.length,
      campaigns: list
    });
  } catch (error) {
    next(error);
  }
};

const getCampaignById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let campaign = null;
    try {
      campaign = await Campaign.findById(id);
    } catch (e) {
      campaign = campaigns.find((c, idx) => String(idx) === id || c.title.includes(id));
    }

    if (!campaign) {
      campaign = campaigns.find((c, idx) => String(idx) === id);
    }

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campagne introuvable.' });
    }

    res.json({
      success: true,
      campaign
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCampaigns,
  getCampaignById
};
