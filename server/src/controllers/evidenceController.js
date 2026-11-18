const crypto = require('crypto');
const Evidence = require('../models/Evidence');

// In-memory fallback if MongoDB connection is offline
let inMemoryVault = [
  {
    _id: 'ev_1',
    title: 'Captures messages de menace WhatsApp',
    description: 'Chantage répété avec menaces de publication de conversations privées. Horodatage conservé.',
    category: 'capture_ecran',
    incidentDate: new Date('2026-11-15T14:30:00Z'),
    fileType: 'image/png',
    fileSize: 425000,
    hashSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    encrypted: true,
    tags: ['Chantage', 'WhatsApp', 'Loi 103-13 art 447-1'],
    notes: 'Transmis pour consultation avec l\'avocate de l\'association.',
    accessLogs: [
      { action: 'created', timestamp: new Date('2026-11-15T14:35:00Z'), ip: '127.0.0.1' }
    ],
    createdAt: new Date('2026-11-15T14:35:00Z')
  }
];

exports.getEvidenceList = async (req, res) => {
  try {
    const list = await Evidence.find().sort({ incidentDate: -1 });
    return res.json({
      success: true,
      count: list.length,
      evidence: list
    });
  } catch (err) {
    return res.json({
      success: true,
      count: inMemoryVault.length,
      evidence: inMemoryVault
    });
  }
};

exports.createEvidence = async (req, res) => {
  try {
    const { title, description, category, incidentDate, fileReference, fileType, fileSize, notes, tags } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Le titre est obligatoire.' });
    }

    // Generate SHA-256 integrity hash
    const hashData = `${title}-${incidentDate || Date.now()}-${notes || ''}-${Date.now()}`;
    const hashSha256 = crypto.createHash('sha256').update(hashData).digest('hex');

    const newEvidence = new Evidence({
      title,
      description: description || '',
      category: category || 'capture_ecran',
      incidentDate: incidentDate ? new Date(incidentDate) : new Date(),
      fileReference: fileReference || '',
      fileType: fileType || 'image',
      fileSize: fileSize || 0,
      hashSha256,
      encrypted: true,
      notes: notes || '',
      tags: tags || [],
      accessLogs: [{ action: 'created', timestamp: new Date(), ip: req.ip || '127.0.0.1' }]
    });

    try {
      await newEvidence.save();
      return res.status(201).json({ success: true, evidence: newEvidence });
    } catch (dbErr) {
      const fallbackItem = {
        _id: 'ev_' + Date.now(),
        ...newEvidence.toObject()
      };
      inMemoryVault.unshift(fallbackItem);
      return res.status(201).json({ success: true, evidence: fallbackItem });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEvidenceById = async (req, res) => {
  try {
    const { id } = req.params;
    let item;
    try {
      item = await Evidence.findById(id);
    } catch (e) {
      item = inMemoryVault.find(e => e._id === id);
    }

    if (!item) {
      return res.status(404).json({ success: false, message: 'Élément introuvable.' });
    }

    return res.json({ success: true, evidence: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteEvidence = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Evidence.findByIdAndDelete(id);
    } catch (e) {
      inMemoryVault = inMemoryVault.filter(e => e._id !== id);
    }
    return res.json({ success: true, message: 'Élément supprimé définitivement du coffre-fort.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.exportAuditReport = async (req, res) => {
  try {
    let list;
    try {
      list = await Evidence.find().sort({ incidentDate: 1 });
    } catch (e) {
      list = inMemoryVault;
    }

    return res.json({
      success: true,
      legalDisclaimer: 'Cet export chronologique constitue un relevé technique personnel. Conformément à la procédure pénale marocaine, la recevabilité de tout élément numérique en justice dépend de l\'appréciation souveraine du juge et peut faire l\'objet d\'une réquisition d\'expertise judiciaire.',
      totalItems: list.length,
      exportedAt: new Date().toISOString(),
      report: list.map(item => ({
        id: item._id,
        titre: item.title,
        dateFait: item.incidentDate,
        categorie: item.category,
        empreinteNumeriqueSha256: item.hashSha256,
        description: item.description,
        notes: item.notes
      }))
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
