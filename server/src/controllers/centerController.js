const mongoose = require('mongoose');
const SupportCenter = require('../models/SupportCenter');
const { supportCenters } = require('../utils/seedData');

const getCenters = async (req, res, next) => {
  try {
    const { city, service, language } = req.query;

    let centers = [];
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        let query = {};
        if (city && city !== 'all') {
          query.city = { $regex: new RegExp(city, 'i') };
        }
        if (service && service !== 'all') {
          query.services = { $in: [new RegExp(service, 'i')] };
        }
        if (language && language !== 'all') {
          query.languages = language;
        }
        centers = await SupportCenter.find(query);
      } catch (e) {
        centers = [];
      }
    }

    if (!isDbConnected || centers.length === 0) {
      // In-memory fallback
      centers = supportCenters.filter(c => {
        const matchesCity = !city || city === 'all' || c.city.toLowerCase() === city.toLowerCase();
        const matchesService = !service || service === 'all' || c.services.some(s => s.toLowerCase().includes(service.toLowerCase()));
        const matchesLang = !language || language === 'all' || c.languages.includes(language);
        return matchesCity && matchesService && matchesLang;
      });
    }

    // Extract unique available cities
    const allCities = [...new Set(supportCenters.map(c => c.city))];

    res.json({
      success: true,
      count: centers.length,
      cities: allCities,
      centers
    });
  } catch (error) {
    next(error);
  }
};

const getCenterById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let center = null;
    try {
      center = await SupportCenter.findById(id);
    } catch (e) {
      center = supportCenters.find((c, idx) => String(idx) === id || c.name.includes(id));
    }

    if (!center) {
      center = supportCenters.find((c, idx) => String(idx) === id);
    }

    if (!center) {
      return res.status(404).json({ success: false, message: 'Centre introuvable.' });
    }

    res.json({
      success: true,
      center
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCenters,
  getCenterById
};
