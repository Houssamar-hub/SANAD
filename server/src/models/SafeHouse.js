const mongoose = require('mongoose');

const safeHouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  nameAr: {
    type: String,
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
  partnerOrg: {
    type: String,
    required: true
  },
  partnerOrgAr: {
    type: String,
    default: ''
  },
  referralProcess: {
    type: String,
    default: 'Orientation d\'urgence via cellule d\'écoute ou Procureur du Roi (Loi 103-13)'
  },
  referralProcessAr: {
    type: String,
    default: 'توجيه مستعجل عبر خلية الاستماع أو النيابة العامة بالمحكمة الابتدائية (القانون 103-13)'
  },
  referralHotline: {
    type: String,
    required: true
  },
  capacityStatus: {
    type: String,
    enum: ['places_disponibles', 'complet_orientation_urgente', 'sur_demande_cellule'],
    default: 'places_disponibles'
  },
  services: [{
    type: String
  }],
  confidentialityNotice: {
    type: String,
    default: 'Adresse résidentielle confidentielle pour la sécurité des résidentes. Accueil assuré au point de contact partenaire officiel.'
  },
  verified: {
    type: Boolean,
    default: true
  },
  verificationAuthority: {
    type: String,
    default: 'Entraide Nationale / Ministère de la Solidarité / CNDH'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SafeHouse', safeHouseSchema);
