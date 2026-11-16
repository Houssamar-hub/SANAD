const mongoose = require('mongoose');
const LegalDocument = require('../models/LegalDocument');
const { legalDocuments } = require('../utils/seedData');

const CATEGORIES_METADATA = [
  { id: 'droits_fondamentaux', labelFr: 'Droits Fondamentaux', labelAr: 'الحقوق الأساسية', icon: 'Shield' },
  { id: 'violence_physique', labelFr: 'Violence Physique', labelAr: 'العنف الجسدي', icon: 'AlertTriangle' },
  { id: 'violence_psychologique', labelFr: 'Violence Psychologique', labelAr: 'العنف النفسي', icon: 'HeartHandshake' },
  { id: 'violence_economique', labelFr: 'Violence Économique', labelAr: 'العنف الاقتصادي', icon: 'Coins' },
  { id: 'violence_sexuelle', labelFr: 'Violence Sexuelle', labelAr: 'العنف الجنسي', icon: 'Lock' },
  { id: 'harcelement', labelFr: 'Harcèlement de rue & travail', labelAr: 'التحرش بالشارع والعمل', icon: 'Users' },
  { id: 'cyberharcelement', labelFr: 'Cyberharcèlement & Réseaux', labelAr: 'التحرش الإلكتروني', icon: 'Smartphone' },
  { id: 'discrimination', labelFr: 'Discrimination', labelAr: 'التمييز', icon: 'Scale' },
  { id: 'acces_justice', labelFr: 'Accès à la Justice & Procédures', labelAr: 'الولوج إلى العدالة', icon: 'Gavel' }
];

const getCategories = (req, res) => {
  res.json({
    success: true,
    categories: CATEGORIES_METADATA
  });
};

const getLegalDocuments = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    let query = {};
    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { titleAr: { $regex: search, $options: 'i' } },
        { simplifiedExplanation: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    let docs = [];
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        docs = await LegalDocument.find(query).sort({ createdAt: -1 });
      } catch (e) {
        docs = [];
      }
    }

    if (!isDbConnected || docs.length === 0) {
      // In-memory fallback
      docs = legalDocuments.filter(d => {
        const matchesCategory = !category || category === 'all' || d.category === category;
        const matchesSearch = !search || 
          d.title.toLowerCase().includes(search.toLowerCase()) ||
          (d.titleAr && d.titleAr.includes(search)) ||
          d.simplifiedExplanation.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
      });
    }

    res.json({
      success: true,
      count: docs.length,
      documents: docs
    });
  } catch (error) {
    next(error);
  }
};

const getLegalDocumentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let doc = null;
    try {
      doc = await LegalDocument.findById(id);
    } catch (e) {
      // Try finding in seedData by lawNumber or index
      doc = legalDocuments.find((d, idx) => String(idx) === id || d.lawNumber === id || d._id === id);
    }

    if (!doc) {
      // Also check seed fallback
      doc = legalDocuments.find((d, idx) => String(idx) === id || d.title.includes(id));
    }

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document juridique introuvable.' });
    }

    res.json({
      success: true,
      document: doc
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getLegalDocuments,
  getLegalDocumentById
};
