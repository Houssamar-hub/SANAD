const mongoose = require('mongoose');
const env = require('../config/env');
const LegalDocument = require('../models/LegalDocument');
const SupportCenter = require('../models/SupportCenter');
const Quiz = require('../models/Quiz');
const Campaign = require('../models/Campaign');
const { legalDocuments, supportCenters, quizzes, campaigns } = require('./seedData');

const runSeed = async () => {
  try {
    console.log('[SANAD-SEED] Connexion à MongoDB:', env.MONGODB_URI);
    await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('[SANAD-SEED] Connecté avec succès.');

    console.log('[SANAD-SEED] Nettoyage des collections existantes...');
    await LegalDocument.deleteMany({});
    await SupportCenter.deleteMany({});
    await Quiz.deleteMany({});
    await Campaign.deleteMany({});

    console.log('[SANAD-SEED] Insertion des documents juridiques...');
    await LegalDocument.insertMany(legalDocuments);

    console.log('[SANAD-SEED] Insertion des centres d\'accompagnement...');
    await SupportCenter.insertMany(supportCenters);

    console.log('[SANAD-SEED] Insertion des quiz...');
    await Quiz.insertMany(quizzes);

    console.log('[SANAD-SEED] Insertion des campagnes...');
    await Campaign.insertMany(campaigns);

    console.log(`[SANAD-SEED] Terminé avec succès !`);
    console.log(`- ${legalDocuments.length} documents juridiques`);
    console.log(`- ${supportCenters.length} centres d'écoute et d'aide`);
    console.log(`- ${quizzes.length} quiz éducatifs`);
    console.log(`- ${campaigns.length} campagnes de sensibilisation`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[SANAD-SEED] Erreur de seed:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  runSeed();
}

module.exports = runSeed;
