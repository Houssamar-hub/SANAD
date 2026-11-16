const LegalDocument = require('../models/LegalDocument');
const { searchLegalSources } = require('./tavilyService');
const { generateLegalResponse } = require('./geminiService');
const seedData = require('../utils/seedData');

// Emergency keywords detection in FR, AR, and Darija/Arabizi
const EMERGENCY_KEYWORDS = [
  'urgence', 'secours', 'danger', 'il me bat', 'il va me tuer', 'au secours',
  'sauvez moi', 'menace de mort', 'viol', 'agression immédiate', 'sang',
  'خطر', 'عتقوني', 'نجدة', 'كيضربني', 'كيقتلني', 'تهديد بالقتل', 'اعتداء',
  '3t9ouni', 'kaydrabni daba', 'daba', 'danger', 'urgent', 'kayhaddedni blmowt',
  'ghadi y9telni', 'mote'
];

/**
 * Detect language: 'ar', 'darija_arabizi', 'fr'
 */
const detectLanguage = (text) => {
  if (!text) return 'fr';
  const arabicRegex = /[\u0600-\u06FF]/;
  if (arabicRegex.test(text)) {
    // Check if contains Moroccan Darija markers in Arabic
    if (/ديالي|شنو|علاش|كاين|دابا|واش|بزاف|دير|ندير/.test(text)) {
      return 'darija';
    }
    return 'ar';
  }

  // Arabizi check (numbers 3, 7, 9 with darija phonetics)
  const arabiziMarkers = /\b(chno|chnou|ndir|wach|3andi|3afak|l7a9|chikwa|dyali|daba|kayn|kayna|bghit|kifech|kifach|khti|salam|ila|hada|hadi|chi|wahed)\b|[23579][a-z]/i;
  if (arabiziMarkers.test(text)) {
    return 'darija_arabizi';
  }

  return 'fr';
};

/**
 * Check if the message indicates an imminent emergency
 */
const checkEmergency = (text) => {
  if (!text) return false;
  const lower = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some(kw => lower.includes(kw.toLowerCase()));
};

/**
 * Search local verified legal documents from MongoDB or in-memory fallback
 */
const searchLocalLegalDocs = async (query) => {
  const queryLower = query.toLowerCase();
  const mongoose = require('mongoose');

  // Try MongoDB first if connected
  if (mongoose.connection.readyState === 1) {
    try {
      const mongoDocs = await LegalDocument.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { simplifiedExplanation: { $regex: query, $options: 'i' } },
          { rightsConcerned: { $in: [new RegExp(query, 'i')] } }
        ]
      }).limit(4);

      if (mongoDocs && mongoDocs.length > 0) {
        return mongoDocs;
      }
    } catch (err) {
      // MongoDB error, fallback to seedData
    }
  }

  // Fallback in-memory search in seedData
  return (seedData.legalDocuments || []).filter(doc => {
    const searchable = `${doc.title} ${doc.content} ${doc.simplifiedExplanation} ${(doc.rightsConcerned || []).join(' ')}`.toLowerCase();
    const words = queryLower.split(' ').filter(w => w.length > 2);
    return words.some(w => searchable.includes(w));
  }).slice(0, 4);
};

/**
 * Main RAG query handler
 */
const processUserQuery = async ({ message, history = [], userPreferredLanguage = 'fr' }) => {
  const detectedLang = detectLanguage(message);
  const effectiveLang = detectedLang !== 'fr' ? detectedLang : userPreferredLanguage;
  const isEmergency = checkEmergency(message);

  // Search local knowledge base
  const localLegalDocs = await searchLocalLegalDocs(message);

  // If local docs are low or message is specific, query Tavily for official Moroccan laws
  let webResults = [];
  if (localLegalDocs.length < 2) {
    try {
      webResults = await searchLegalSources(message);
    } catch (err) {
      console.warn('[SANAD-RAG] Tavily search error:', err.message);
    }
  }

  // Call Gemini with context
  let aiResult = null;
  try {
    aiResult = await generateLegalResponse({
      message,
      history,
      legalContext: localLegalDocs,
      webResults,
      language: effectiveLang
    });
  } catch (error) {
    console.warn('[SANAD-RAG] Gemini error, using fallback curated response:', error.message);
    
    // Curated local fallback response when offline or API key unavailable
    let fallbackText = '';
    if (effectiveLang === 'ar' || effectiveLang === 'darija') {
      fallbackText = `مرحباً بك في سند (SANAD). بناءً على القانون المغربي (القانون 103-13 المتعلق بمحاربة العنف ضد النساء ومجموعة القانون الجنائي) :

1. الحماية القانونية : يجرّم القانون المغربي كل أشكال العنف (الجسدي، النفسي، الجنسي والاقتصادي) والتحرش الإلكتروني.
2. الإجراءات الممكنة :
   - تسجيل الأدلة (رسائل، تسجيلات، صور).
   - التوجه إلى أقرب دائرة شرطة أو درك ملكي، أو إلى خلية التكفل بالنساء ضحايا العنف بالمحكمة الابتدائية.
   - الاتصال بالأرقام المباشرة : 19 (الشرطة في المجال الحضري)، 177 (الدرك الملكي خارج المدار الحضري)، 15 (الوقاية المدنية).
3. تذكير : هذه المعلومات للإرشاد والتوجيه ولا تعوض استشارة محامٍ متخصص.`;
    } else if (effectiveLang === 'darija_arabizi') {
      fallbackText = `Merhba bik f SANAD. 3la hsab l9anoun lmeghribi (Loi 103-13 w lcode pénal) :

1. L7imaya dyalk : L9anoun kayjrem koul anwa3 l3onf (ljesdi, nafsi, ljinsi, i9tisadi w taharouch f internet).
2. Chno t9dri diri :
   - Khlli les preuves (screenshots, messages, audios).
   - T9dri tmchi l comissariat wla lgendarm, wla lkheliya dyal nsa f lma7kama l'ibtida'iya.
   - Nwamr dyal l'urgence : 19 (Police f mdina), 177 (Gendarme barra lmdina), 15 (Wiqaya lmadaniya).
3. Tanbih : Had lma3loumat l tawjih w matay3wdouch lmo7ami.`;
    } else {
      fallbackText = `Bienvenue sur SANAD. D'après la législation marocaine (notamment la Loi n° 103-13 relative à la lutte contre les violences faites aux femmes et le Code Pénal marocain) :

1. Protection juridique : Le droit marocain réprime sévèrement toutes les formes de violence (physique, psychologique, sexuelle, économique) ainsi que le cyberharcèlement (Art. 447-1 et suivants).
2. Démarches recommandées :
   - Conserver les preuves matérielles (captures d'écran, messages, certificats médicaux le cas échéant).
   - Déposer plainte auprès des services de Police (19 en zone urbaine) ou de la Gendarmerie Royale (177 hors agglomération), ou directement auprès du Procureur du Roi (cellule de prise en charge des femmes et enfants victimes de violences).
   - Contacter un centre d'écoute et d'accompagnement spécialisé.
3. Rappel légal : Ces informations sont fournies à titre indicatif et ne remplacent pas la consultation d'un avocat inscrit au barreau.`;
    }

    aiResult = {
      answer: fallbackText,
      modelUsed: 'local_curated_knowledge_base',
      sources: localLegalDocs.map(d => ({ title: d.title, lawNumber: d.lawNumber, url: d.sourceUrl }))
    };
  }

  return {
    answer: aiResult.answer,
    modelUsed: aiResult.modelUsed,
    isEmergency,
    emergencyHotlines: isEmergency ? {
      police: '19',
      gendarmerie: '177',
      protectionCivile: '15',
      note: 'En cas de danger immédiat, composez directement ces numéros.'
    } : null,
    detectedLanguage: detectedLang,
    sources: aiResult.sources || []
  };
};

module.exports = {
  processUserQuery,
  detectLanguage,
  checkEmergency,
  searchLocalLegalDocs
};
