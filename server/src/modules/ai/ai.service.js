/**
 * SANAD AI Assistant - Master AI Service Orchestrator
 * Seamlessly integrates:
 * 1. Multilingual Language Detection (Darija, Arabizi, Arabic, French)
 * 2. Conservative Safety & Emergency Monitoring
 * 3. 12-Intent Multi-tier Classification
 * 4. Grounded Moroccan Legal RAG & Official Citations
 * 5. Operating Modes: Mode A (General), Mode B (Legal), Mode C (Safety)
 * 6. Multi-turn Conversation Generation
 */

const { detectLanguage } = require('./languageService');
const { detectSafetyRisk, RISK_LEVELS, getEmergencyHotlines } = require('./safetyService');
const { classifyIntent, INTENTS } = require('./intentService');
const { searchLegalDatabase, VERIFIED_LEGAL_CORPUS } = require('./legalRagService');
const { searchOfficialSources, OFFICIAL_DOMAINS } = require('./searchService');
const { generateAiResponse } = require('./conversationService');

/**
 * Main chat handler for multi-turn conversational AI
 */
async function handleChat({ message, history = [], languageOverride = null, user = null }) {
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    throw new Error('Message is required');
  }

  const cleanMessage = message.trim();

  // 1. Language Detection
  const language = languageOverride ? { code: languageOverride, confidence: 1.0 } : detectLanguage(cleanMessage);

  // 2. Safety Risk Assessment
  const safety = detectSafetyRisk(cleanMessage);

  // 3. Intent Classification
  const intentResult = classifyIntent(cleanMessage, language);

  // 4. Determine Active Operating Mode
  // Priority: Mode C (Safety) > Mode B (Legal) > Mode A (General)
  let activeMode = intentResult.mode || 'MODE_A';

  if (safety.riskLevel === RISK_LEVELS.CRITICAL || safety.riskLevel === RISK_LEVELS.HIGH) {
    activeMode = 'MODE_C';
  }

  // 5. Context Gathering
  const context = {
    safety,
    intent: intentResult.primaryIntent,
    legalSources: [],
    liveSources: [],
    emergencyHotlines: getEmergencyHotlines()
  };

  // If in Legal Mode (or legal question), gather grounded legal documents
  if (activeMode === 'MODE_B' || intentResult.primaryIntent === INTENTS.LEGAL_QUESTION || intentResult.primaryIntent === INTENTS.LEGAL_PROCEDURE) {
    const legalDocs = await searchLegalDatabase(cleanMessage, {
      language: language.code,
      limit: 3
    });
    context.legalSources = legalDocs;

    // Optional background live search on official domains
    if (process.env.TAVILY_API_KEY) {
      try {
        const liveRes = await searchOfficialSources(cleanMessage, 2);
        context.liveSources = liveRes.results || [];
      } catch (err) {
        // Continue with local grounded database
      }
    }
  }

  // 6. Generate AI Response
  const aiResult = await generateAiResponse({
    mode: activeMode,
    language: language.code,
    message: cleanMessage,
    history,
    context
  });

  // 7. Format Source Citations
  const sources = [];
  if (activeMode === 'MODE_B' && context.legalSources.length > 0) {
    for (const doc of context.legalSources) {
      sources.push({
        id: doc.id,
        code: doc.code,
        article: doc.article,
        title: doc.title,
        url: doc.officialSource,
        sourceName: doc.sourceName
      });
    }
  }

  // 8. Generate Contextual Suggested Follow-up Questions
  const suggestedQuestions = generateSuggestedQuestions(activeMode, intentResult.primaryIntent, language.code);

  return {
    response: aiResult.text,
    mode: activeMode,
    detectedLanguage: language,
    intent: {
      primaryIntent: intentResult.primaryIntent,
      confidence: intentResult.confidence
    },
    safety: {
      riskLevel: safety.riskLevel,
      isEmergency: safety.riskLevel === RISK_LEVELS.CRITICAL || safety.riskLevel === RISK_LEVELS.HIGH,
      category: safety.category,
      emergencyHotlines: (activeMode === 'MODE_C' || safety.riskLevel !== RISK_LEVELS.NONE) ? context.emergencyHotlines : undefined
    },
    sources,
    suggestedQuestions,
    timestamp: new Date().toISOString()
  };
}

/**
 * Generates dynamic follow-up questions tailored to mode and language
 */
function generateSuggestedQuestions(mode, intent, lang) {
  if (mode === 'MODE_C') {
    if (lang === 'darija' || lang === 'arabizi') {
      return [
        'أرقام الطوارئ في المغرب',
        'كيفاش ناخد شهادة طبية؟',
        'مراكز الاستماع القريبة مني'
      ];
    }
    if (lang === 'arabic') {
      return [
        'ما هي أرقام الطوارئ المعتمدة؟',
        'كيف أحصل على شهادة طبية شرعية؟',
        'أقرب مركز استماع وإيواء'
      ];
    }
    return [
      'Numéros d’urgence au Maroc',
      'Comment obtenir un certificat médical ?',
      'Centres d’écoute et d’hébergement'
    ];
  }

  if (mode === 'MODE_B') {
    if (lang === 'darija' || lang === 'arabizi') {
      return [
        'شنو كايقول القانون 103-13؟',
        'كيفاش نحط شكاية عند وكيل الملك؟',
        'شنو هي حقوقي في النفقة؟'
      ];
    }
    if (lang === 'arabic') {
      return [
        'ما هي عقوبة التحرش في القانون المغربي؟',
        'إجراءات رفع دعوى طلاق الشقاق',
        'حقوق الحضانة والنفقة للأم'
      ];
    }
    return [
      'Que prévoit la Loi 103-13 ?',
      'Comment déposer plainte au tribunal ?',
      'Quels sont les recours en cas de harcèlement ?'
    ];
  }

  // Mode A (General)
  if (lang === 'darija' || lang === 'arabizi') {
    return [
      'شنو هو تطبيق سند؟',
      'شنو كتعرفي على حقوق المرأة؟',
      'كيفاش تقدري تعاونيني؟'
    ];
  }
  if (lang === 'arabic') {
    return [
      'ما هي خدمات تطبيق سند؟',
      'كيف يمكنني الاستفادة من التطبيق؟',
      'أخبريني عن حقوق المرأة في المغرب'
    ];
  }
  return [
    'Comment fonctionne l’application SANAD ?',
    'Quelles sont tes fonctionnalités ?',
    'Parle-moi des droits des femmes au Maroc'
  ];
}

module.exports = {
  handleChat,
  detectLanguage,
  detectSafetyRisk,
  classifyIntent,
  searchLegalDatabase,
  searchOfficialSources,
  getEmergencyHotlines,
  OFFICIAL_DOMAINS,
  VERIFIED_LEGAL_CORPUS
};
