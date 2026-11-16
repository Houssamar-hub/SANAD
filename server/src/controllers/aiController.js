const { processUserQuery } = require('../services/ragService');
const { chatSchema } = require('../validators/schemas');

const chat = async (req, res, next) => {
  try {
    const validated = chatSchema.parse(req.body);

    const result = await processUserQuery({
      message: validated.message,
      history: validated.history || [],
      userPreferredLanguage: validated.language || req.user?.preferredLanguage || 'fr'
    });

    res.json({
      success: true,
      answer: result.answer,
      modelUsed: result.modelUsed,
      isEmergency: result.isEmergency,
      emergencyHotlines: result.emergencyHotlines,
      detectedLanguage: result.detectedLanguage,
      sources: result.sources
    });
  } catch (error) {
    next(error);
  }
};

const feedback = async (req, res) => {
  const { messageId, rating, comment } = req.body;
  // Non-intrusive logging without sensitive user details
  console.log(`[SANAD-Feedback] Message ${messageId || 'unknown'}: Rating=${rating}, Comment=${comment || 'none'}`);
  res.json({
    success: true,
    message: 'Merci pour votre retour. Vos remarques aident à améliorer SANAD.'
  });
};

module.exports = {
  chat,
  feedback
};
