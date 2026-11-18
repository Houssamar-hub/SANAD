const mongoose = require('mongoose');
const SupportCenter = require('../models/SupportCenter');
const { supportCenters, MOROCCAN_REGIONS } = require('../utils/seedData');

const CATEGORIES = [
  { id: 'all', label: 'Toutes les catégories', labelAr: 'جميع الفئات' },
  { id: 'lutte_violence', label: 'Lutte contre les violences', labelAr: 'مناهضة العنف' },
  { id: 'assistance_juridique', label: 'Assistance juridique', labelAr: 'المساعدة القانونية' },
  { id: 'ecoute_psychologique', label: 'Écoute & Soutien psy', labelAr: 'الاستماع والدعم النفسي' },
  { id: 'hebergement', label: 'Hébergement d\'urgence', labelAr: 'الإيواء الاستعجالي' },
  { id: 'droits_femmes', label: 'Droits des femmes & Plaidoyer', labelAr: 'حقوق النساء والترافع' },
  { id: 'autonomisation', label: 'Autonomisation & Réinsertion', labelAr: 'التمكين الاقتصادي' }
];

const getCenters = async (req, res, next) => {
  try {
    const { region, city, category, service, type, search } = req.query;

    let centers = [];
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        let query = {};

        // 1. Region filter
        if (region && region !== 'all') {
          query.region = { $regex: new RegExp(`^${escapeRegex(region)}$`, 'i') };
        }

        // 2. City filter
        if (city && city !== 'all') {
          query.city = { $regex: new RegExp(`^${escapeRegex(city)}$`, 'i') };
        }

        // 3. Category / Service filter
        if (category && category !== 'all') {
          query.category = category;
        }
        if (service && service !== 'all') {
          query.services = { $in: [new RegExp(escapeRegex(service), 'i')] };
        }

        // 4. Type filter (association vs institution)
        if (type && type !== 'all') {
          query.type = type;
        }

        // 5. Search text filter
        if (search && search.trim().length > 0) {
          const s = escapeRegex(search.trim());
          query.$or = [
            { name: { $regex: s, $options: 'i' } },
            { nameAr: { $regex: s, $options: 'i' } },
            { description: { $regex: s, $options: 'i' } },
            { descriptionAr: { $regex: s, $options: 'i' } },
            { city: { $regex: s, $options: 'i' } },
            { address: { $regex: s, $options: 'i' } },
            { services: { $in: [new RegExp(s, 'i')] } }
          ];
        }

        centers = await SupportCenter.find(query).sort({ verified: -1, region: 1, name: 1 }).lean();
      } catch (e) {
        centers = [];
      }
    }

    // In-memory fallback if DB empty or disconnected
    if (!isDbConnected || centers.length === 0) {
      centers = supportCenters.filter(c => {
        const matchesRegion = !region || region === 'all' || (c.region && c.region.toLowerCase() === region.toLowerCase());
        const matchesCity = !city || city === 'all' || (c.city && c.city.toLowerCase() === city.toLowerCase());
        const matchesCat = !category || category === 'all' || c.category === category;
        const matchesServ = !service || service === 'all' || (c.services && c.services.some(s => s.toLowerCase().includes(service.toLowerCase())));
        const matchesType = !type || type === 'all' || c.type === type;

        let matchesSearch = true;
        if (search && search.trim().length > 0) {
          const s = search.trim().toLowerCase();
          matchesSearch =
            (c.name && c.name.toLowerCase().includes(s)) ||
            (c.nameAr && c.nameAr.toLowerCase().includes(s)) ||
            (c.description && c.description.toLowerCase().includes(s)) ||
            (c.city && c.city.toLowerCase().includes(s)) ||
            (c.services && c.services.some(srv => srv.toLowerCase().includes(s)));
        }

        return matchesRegion && matchesCity && matchesCat && matchesServ && matchesType && matchesSearch;
      });
    }

    // Dynamic cities list based on selected region
    let availableCities = [];
    const sourceList = supportCenters;
    if (region && region !== 'all') {
      availableCities = [...new Set(sourceList.filter(c => c.region && c.region.toLowerCase() === region.toLowerCase()).map(c => c.city))];
    } else {
      availableCities = [...new Set(sourceList.map(c => c.city))];
    }

    res.json({
      success: true,
      count: centers.length,
      regions: MOROCCAN_REGIONS,
      cities: availableCities,
      categories: CATEGORIES,
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

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

module.exports = {
  getCenters,
  getCenterById
};
