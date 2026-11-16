/**
 * SANAD AI Assistant - Controller
 */

const aiService = require('./ai.service');
const { getSafetyGuidance } = require('./safetyService');
const { chatSchema, detectIntentSchema, legalSearchSchema, safetyGuidanceSchema } = require('./ai.validators');

/**
 * Multi-turn AI Chat Endpoint
 * POST /api/ai/chat
 */
async function chat(req, res, next) {
  try {
    const parseResult = chatSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: parseResult.error.errors[0].message
      });
    }

    const { message, history, language } = parseResult.data;
    const user = req.user || null;

    const result = await aiService.handleChat({
      message,
      history,
      languageOverride: language,
      user
    });

    return res.status(200).json({
      success: true,
      data: result,
      // Top-level aliases for seamless backward-compatibility
      answer: result.response,
      response: result.response,
      mode: result.mode,
      isEmergency: result.safety.isEmergency,
      emergencyHotlines: result.safety.emergencyHotlines,
      sources: result.sources,
      suggestedQuestions: result.suggestedQuestions,
      detectedLanguage: result.detectedLanguage?.code === 'arabizi' ? 'darija_arabizi' : (result.detectedLanguage?.code || 'fr')
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Dedicated Intent Detection Endpoint
 * POST /api/ai/detect-intent
 */
async function detectIntent(req, res, next) {
  try {
    const parseResult = detectIntentSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: parseResult.error.errors[0].message
      });
    }

    const { text } = parseResult.data;
    const detectedLang = aiService.detectLanguage(text);
    const intentResult = aiService.classifyIntent(text, detectedLang);
    const safetyResult = aiService.detectSafetyRisk(text);

    return res.status(200).json({
      success: true,
      data: {
        text,
        detectedLanguage: detectedLang,
        intent: intentResult.primaryIntent,
        confidence: intentResult.confidence,
        mode: intentResult.mode,
        isEmergency: intentResult.isEmergency,
        safety: safetyResult
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Grounded Legal Search Endpoint
 * POST /api/ai/legal-search
 */
async function legalSearch(req, res, next) {
  try {
    const parseResult = legalSearchSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: parseResult.error.errors[0].message
      });
    }

    const { query, category, language } = parseResult.data;
    const results = await aiService.searchLegalDatabase(query, { category, language });

    return res.status(200).json({
      success: true,
      data: {
        query,
        count: results.length,
        results
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Safety & Emergency Guidance Endpoint
 * POST /api/ai/safety-guidance
 */
async function safetyGuidance(req, res, next) {
  try {
    const parseResult = safetyGuidanceSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: parseResult.error.errors[0].message
      });
    }

    const { category, language } = parseResult.data;
    const hotlines = aiService.getEmergencyHotlines();
    const guidance = getSafetyGuidance(category, language);

    return res.status(200).json({
      success: true,
      data: {
        hotlines,
        guidance
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Official Moroccan Legal Portals and Corpus Reference Endpoint
 * GET /api/ai/sources
 */
async function getSources(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      data: {
        officialDomains: aiService.OFFICIAL_DOMAINS,
        verifiedSources: [
          {
            name: 'Portail Juridique Adala - Ministère de la Justice',
            url: 'https://adala.justice.gov.ma',
            coverage: 'Codes marocains (Pénal, Procédure, Travail) et jurisprudence'
          },
          {
            name: 'Secrétariat Général du Gouvernement (SGG)',
            url: 'http://www.sgg.gov.ma',
            coverage: 'Bulletin Officiel (BO) et textes de lois promulgués (Loi 103-13, Moudawana)'
          },
          {
            name: 'Conseil National des Droits de l’Homme (CNDH)',
            url: 'https://www.cndh.ma',
            coverage: 'Rapports, droits des femmes et campagnes nationales de prévention'
          },
          {
            name: 'Ministère de la Solidarité, de l’Insertion Sociale et de la Famille',
            url: 'https://social.gov.ma',
            coverage: 'Centres de prise en charge et hébergement d’urgence'
          }
        ],
        indexedCorpusCount: aiService.VERIFIED_LEGAL_CORPUS.length
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Feedback Endpoint
 * POST /api/ai/feedback
 */
async function feedback(req, res) {
  const { messageId, rating, comment } = req.body || {};
  console.log(`[SANAD-Feedback] Message ${messageId || 'unknown'}: Rating=${rating}, Comment=${comment || 'none'}`);
  return res.status(200).json({
    success: true,
    message: 'Merci pour votre retour. Vos remarques aident à améliorer SANAD.'
  });
}

module.exports = {
  chat,
  detectIntent,
  legalSearch,
  safetyGuidance,
  getSources,
  feedback
};
