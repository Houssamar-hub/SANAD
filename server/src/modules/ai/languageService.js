/**
 * SANAD Multilingual Language Detection Service
 * Supports: Moroccan Darija (Arabic script), Arabizi (Latin script with 3, 7, 9...), Modern Standard Arabic, French.
 */

const LANGUAGES = {
  DARIJA: 'darija',
  ARABIZI: 'arabizi',
  ARABIC: 'arabic',
  FRENCH: 'fr'
};

// Moroccan Darija distinctive vocabulary in Arabic script
const DARIJA_ARABIC_WORDS = [
  'ديالي', 'ديال', 'شنو', 'علاش', 'كاين', 'كاينة', 'دابا', 'واش', 'بزاف',
  'دير', 'ندير', 'راجلي', 'بغيت', 'خفت', 'كيهددني', 'كيضربني', 'زوينة',
  'شكون', 'فين', 'كيفاش', 'شحال', 'مزيان', 'ولدي', 'بنتي', 'دارنا',
  'صاحبتي', 'الخدمة', 'محروقة', 'عافاك', 'حشومة', 'واخا', 'ماشي', 'هادشي',
  'لاباس', 'كي داير', 'كيداير', 'كيدايرة', 'كتسمعني', 'درت', 'غادي', 'غانمشي',
  'نسولك', 'شي حاجة', 'تعرضت', 'للتحرش', 'نشكي', 'مشكل', 'حقوقي', 'جمعية', 'تعاوني'
];

// Moroccan Arabizi distinctive words and number substitutions
const ARABIZI_MARKERS = [
  /\b(salam|kidayr|kidayra|labas|chokran|choukrane|merhba|marhba)\b/i,
  /\b(chno|chnou|wach|wash|ndir|kifach|kifech|3lach|3afak|3andi|dyali|dyal)\b/i,
  /\b(daba|bghit|khft|kayn|kayna|bzf|bzaf|makaynch|walou|walo|chi|haja|chi haja)\b/i,
  /\b(rajli|sahbti|khti|khoya|dar|lwalida|lwalid|wldi|bnti|m3aya|m3ak)\b/i,
  /\b(kaydrabni|kaydrbni|kayhadedni|kayhddedni|kayhddni|tsawri|tsawer|tsawir|ibtizaz|kaytaba3ni|hchouma|wakha|machi|hadchi)\b/i,
  /\b(ghadi|ghadya|nmchi|lcomissariat|lma7kama|chouhad|lmo7ami)\b/i,
  /\b(l7a9|lha9|l9anoun|lqanoun|taharouch|taharrouch|ta7aroch|ta7arrouch|i3tida2)\b/i,
  /\b(nsawlk|sawlk|nswl|sawlni|nchki|ncheki|chki|t3rdt|t3redt|7o9o9|7o9ou9|jam3iya|t3awni|mochkil|lmochkil)\b/i,
  /[235789][a-z]/i, // Arabizi numbers preceding letters (e.g., 3afak, 7a9, 9anoun, 3lik, 7o9o9)
  /[a-z][235789]/i  // Arabizi numbers following letters (e.g., tla9, sda3, t3rdt)
];

// French distinctive markers
const FRENCH_MARKERS = [
  /\b(bonjour|bonsoir|salut|merci|svp|bonjour\b|coucou)\b/i,
  /\b(est-ce|qu'est|comment|pourquoi|combien|quand|quel|quelle|quels|quelles)\b/i,
  /\b(plainte|police|gendarmerie|tribunal|avocat|loi|droit|droits|justice)\b/i,
  /\b(violence|harcelement|harcèlement|agression|menace|frapper|battre|peur)\b/i,
  /\b(mari|conjoint|femme|époux|épouse|divorce|garde|pension|travail)\b/i,
  /\b(je|tu|il|elle|nous|vous|ils|elles|mon|ma|mes|notre|votre|leur)\b/i
];

/**
 * Detect language of incoming text
 * @param {string} text
 * @param {string} [userPreference='fr']
 * @returns {{ code: string, language: string, confidence: number, script: 'arabic' | 'latin' }}
 */
function detectLanguage(text, userPreference = 'fr') {
  if (!text || typeof text !== 'string') {
    const defaultCode = userPreference || 'fr';
    return { code: defaultCode, language: defaultCode, confidence: 0.5, script: 'latin' };
  }

  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  // 1. Script detection (Arabic characters vs Latin)
  const arabicCharCount = (trimmed.match(/[\u0600-\u06FF]/g) || []).length;
  const latinCharCount = (trimmed.match(/[a-zA-Z]/g) || []).length;
  const isArabicScript = arabicCharCount > latinCharCount;

  if (isArabicScript) {
    let darijaMatches = 0;
    for (const word of DARIJA_ARABIC_WORDS) {
      if (trimmed.includes(word)) {
        darijaMatches++;
      }
    }

    if (darijaMatches > 0) {
      const confidence = Math.min(0.7 + darijaMatches * 0.1, 0.98);
      return { code: LANGUAGES.DARIJA, language: LANGUAGES.DARIJA, confidence, script: 'arabic' };
    }

    // Default Arabic script to Modern Standard Arabic
    return { code: LANGUAGES.ARABIC, language: LANGUAGES.ARABIC, confidence: 0.9, script: 'arabic' };
  }

  // 2. Latin script: Distinguish between Arabizi and French
  let arabiziScore = 0;
  for (const marker of ARABIZI_MARKERS) {
    if (marker.test(trimmed)) {
      arabiziScore += 1.5;
    }
  }

  let frenchScore = 0;
  for (const marker of FRENCH_MARKERS) {
    if (marker.test(trimmed)) {
      frenchScore += 1;
    }
  }

  // Arabizi character sequences with numbers
  if (/[235789]/.test(lower) && /[a-z]/.test(lower)) {
    arabiziScore += 2;
  }

  if (arabiziScore > frenchScore && arabiziScore > 0) {
    const confidence = Math.min(0.65 + arabiziScore * 0.1, 0.99);
    return { code: LANGUAGES.ARABIZI, language: LANGUAGES.ARABIZI, confidence, script: 'latin' };
  }

  if (frenchScore > 0) {
    const confidence = Math.min(0.7 + frenchScore * 0.08, 0.98);
    return { code: LANGUAGES.FRENCH, language: LANGUAGES.FRENCH, confidence, script: 'latin' };
  }

  // Fallback to preference or French
  const fallback = userPreference || 'fr';
  return { code: fallback, language: fallback, confidence: 0.6, script: 'latin' };
}

module.exports = {
  LANGUAGES,
  detectLanguage
};
