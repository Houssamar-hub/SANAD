const env = require('../config/env');

/**
 * System instruction tailored for SANAD - Moroccan Legal and Support Assistant
 */
const SANAD_SYSTEM_PROMPT = `Tu es l'assistant juridique intelligent de l'application SANAD (سند).
SANAD est une plateforme marocaine de sensibilisation, de protection et d'accompagnement juridique des femmes et des filles, s'inscrivant dans la campagne nationale du CNDH (Conseil National des Droits de l'Homme) contre les violences faites aux femmes.

Principes cardinaux et déontologie :
1. Tu n'es PAS un avocat et tu ne représentes pas un cabinet juridique. Tes réponses ont une vocation strictement informative, pédagogique et d'orientation.
2. Tu t'exprimes avec empathie, respect, bienveillance et rigueur. Ne juge jamais la situation.
3. RÈGLE D'OR : N'invente JAMAIS d'articles de loi, de numéros de téléphone, de procédures ou d'institutions. Base-toi uniquement sur le droit positif marocain (notamment la Loi 103-13 relative à la lutte contre les violences faites aux femmes, le Dahir formant Code Pénal marocain, le Code du Travail, le Code de la Famille / Moudawana, la Loi 09-08 relative à la protection des données personnelles).
4. Prise en charge linguistique :
   - Si l'utilisatrice écrit en français, réponds en français clair et accessible.
   - Si l'utilisatrice écrit en arabe standard, réponds en arabe standard clair.
   - Si l'utilisatrice écrit en Darija marocaine (en caractères arabes ou en Arabizi latinisé avec 3, 7, 9 comme "chno ndir", "wach 3andi l7a9"), réponds chaleureusement en Darija marocaine compréhensible et rassurante !
5. Structure de ta réponse :
   - **Explication & Soutien** : Mots rassurants et validation de la situation.
   - **Ce que prévoit le droit marocain** : Textes et articles applicables précis.
   - **Démarches concrètes** : Étapes simples et pratiques (dépôt de plainte, certificat médical si nécessaire, conservation des preuves, cellule d'accueil au tribunal).
   - **Contacts et ressources** : Numéros officiels (Police 19 en ville, Gendarmerie 177 en milieu rural, Protection Civile 15) et cellules d'assistance.
   - **Avertissement** : Mention claire rappelant que ce conseil ne remplace pas une consultation auprès d'un avocat inscrit au barreau ou d'un centre d'écoute spécialisé.
`;

/**
 * Call Gemini API with contextual legal data and history
 */
const generateLegalResponse = async ({ message, history = [], legalContext = [], webResults = [], language = 'fr' }) => {
  if (!env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY non configurée');
  }

  // Format context
  let contextText = '';
  if (legalContext.length > 0) {
    contextText += '\n--- TEXTES DE LOI ET DONNÉES JURIDIQUES VÉRIFIÉES SANAD ---\n';
    legalContext.forEach((doc, idx) => {
      contextText += `[Doc ${idx + 1}] ${doc.title} (${doc.lawNumber || ''} ${doc.articleNumber || ''}): ${doc.simplifiedExplanation || doc.content}\nDémarches: ${(doc.possibleSteps || []).map(s => s.title || s.description).join('; ')}\nSources: ${doc.sourceUrl || ''}\n\n`;
    });
  }

  if (webResults.length > 0) {
    contextText += '\n--- SOURCES OFFICIELLES DU WEB ---\n';
    webResults.forEach((w, idx) => {
      contextText += `[Web ${idx + 1}] ${w.title} (${w.url}): ${w.content}\n`;
    });
  }

  const promptContent = `
${contextText}

Message de l'utilisatrice :
"${message}"

Langue détectée ou préférée : ${language}

Rédige une réponse complète, structurée, rassurante et juridiquement exacte en respectant scrupuleusement les lois marocaines et les consignes du système.`;

  // We can try gemini-1.5-flash or gemini-flash-latest
  const modelToTry = env.GEMINI_MODEL || 'gemini-3.5-flash';
  const models = [modelToTry, 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

  let lastError = null;
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': env.GEMINI_API_KEY
        },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${SANAD_SYSTEM_PROMPT}\n\n${promptContent}` }]
            }
          ],
          generationConfig: {
            temperature: 0.3, // Low temperature for high precision and zero hallucinations
            topP: 0.8,
            maxOutputTokens: 1200
          }
        })
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Gemini status ${res.status}: ${errBody}`);
      }

      const data = await res.json();
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (answer) {
        return {
          answer,
          modelUsed: model,
          sources: [
            ...legalContext.map(d => ({ title: d.title, lawNumber: d.lawNumber, url: d.sourceUrl })),
            ...webResults.map(w => ({ title: w.title, url: w.url }))
          ]
        };
      }
    } catch (err) {
      lastError = err;
      console.warn(`[SANAD-Gemini] Échec avec le modèle ${model}: ${err.message}`);
    }
  }

  throw lastError || new Error('Impossible de contacter le service IA Gemini');
};

module.exports = {
  generateLegalResponse,
  SANAD_SYSTEM_PROMPT
};
