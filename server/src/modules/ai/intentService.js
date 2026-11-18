/**
 * SANAD AI Assistant - Intent Detection Service
 * Recognizes 12 core intents across Moroccan Darija (Arabic script), Arabizi (Latin script), Arabic, and French.
 */

const { detectLanguage } = require('./languageService');
const { detectSafetyRisk, RISK_LEVELS } = require('./safetyService');

const INTENTS = {
  GENERAL_CONVERSATION: 'GENERAL_CONVERSATION',
  LEGAL_QUESTION: 'LEGAL_QUESTION',
  DOMESTIC_VIOLENCE: 'DOMESTIC_VIOLENCE',
  PHYSICAL_VIOLENCE: 'PHYSICAL_VIOLENCE',
  SEXUAL_HARASSMENT: 'SEXUAL_HARASSMENT',
  WORKPLACE_HARASSMENT: 'WORKPLACE_HARASSMENT',
  CYBER_HARASSMENT: 'CYBER_HARASSMENT',
  DISCRIMINATION: 'DISCRIMINATION',
  LEGAL_PROCEDURE: 'LEGAL_PROCEDURE',
  REQUEST_SUPPORT: 'REQUEST_SUPPORT',
  EMERGENCY: 'EMERGENCY',
  OTHER: 'OTHER'
};

function normalize(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[إأآا]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');
}

// Patterns for each intent (applied to normalized text)
const INTENT_PATTERNS = {
  [INTENTS.EMERGENCY]: [
    /\b(3t9oni|3at9oni|3t9ni|3awnoni|3ta9|najda|sos|urgent|urgence|danger|khatar|khatir)\b/i,
    /\b(tay9talni|kay9talni|kaymot|ghadi y9telni|ghay9telni|ghadi idrbni|ghadi i9tlni)\b/i,
    /\b(3aytolo|3ayto li|police|chorta|bouliss|darake|gendarmerie|pompiers)\b/i,
    /\b(au secours|sauvez moi|a l'aide|a l aide|danger de mort|il va me tuer|menace de mort|massacrer)\b/i,
    /(النجده|عتقوني|عتقني|خطر دابا|غادي يقتلني|عيطو للبوليس|محبوسه|اغيثوني|بالدم)/i
  ],
  [INTENTS.DOMESTIC_VIOLENCE]: [
    /\b(rajli|rajel|zawji|zawj|partner|mari|conjoint|epoux|husband)\b.*\b(kaydrbni|kaydrebni|kayhini|kay3nfni|drbni|ta3nif|battue|frapper|violence|m'insulte|insulte|expulsee)\b/i,
    /\b(kaydrbni|kaydrebni|kayhini|kay3nfni|drbni)\b.*\b(rajli|zawji|mari)\b/i,
    /\b(violence conjugale|violence domestique|mon mari me frappe|mon conjoint|foyer conjugal|violence familiale|mari me bat)\b/i,
    /(راجلي كيضربني|راجلي كيعنفني|العنف الزوجي|عنف زوجي|زوجي يضربني|العنف الاسري|ضربني راجلي|طردني راجلي|الزوج يضربني|العنف الزوجي والضرب)/i,
    /\b(tardani|tredni rajli|jraw 3lia mn dar|violence au foyer)\b/i
  ],
  [INTENTS.PHYSICAL_VIOLENCE]: [
    /\b(drbni|drebni|kaydrb|3nfni|l3onf ljassadi|agression physique|violence physique|coup|blessure|drbouha|coups et blessures)\b/i,
    /(ضربني|كيضربني|العنف الجسدي|اعتداء جسدي|ضرب وجرح|كدمات|عنف جسدي|جروح)/i,
    /\b(coups et blessures|agressee physiquement|agression physique|tabassee|frappee|volontaires)\b/i
  ],
  [INTENTS.SEXUAL_HARASSMENT]: [
    /\b(taharrouch|taharouch|taharrush|ta7aroch|ta7arrouch|kaytaharach|kayt7rech|harcelement sexuel|agression sexuelle|igtisab|viol|attouchement|kay9isni|t3rdt|t3redt)\b/i,
    /(تحرش|التحرش|تحرش جنسي|التحرش الجنسي|اعتداء جنسي|اغتصاب|هتك عرض|لمسني بزز|تحرش بي|التحرش في الفضاء|تعرضت للتحرش|تعرضت للتحرش الجنسي)/i,
    /\b(harcelement de rue|taharouch f chari3|kaytbe3ni f chari3|propos et gestes|gestes deplaces|transports publics)\b/i
  ],
  [INTENTS.WORKPLACE_HARASSMENT]: [
    /\b(khdma|khedma|patron|chaf|chef|travail|boulot|harcelement moral|harcelement au travail|licenciement abusif|salaire)\b/i,
    /\b(taharrouch f lkhdma|chef dyali kayhdr m3aya|patron kaydghat 3lia|3tani wara9a|menaces de licenciement)\b/i,
    /(تحرش في العمل|التحرش المهني|طرد تعسفي|مشغلي|المدير في العمل|قانون الشغل|حقوقي في العمل|في الخدمه)/i,
    /\b(harcelement au travail|harcelement moral|mon patron|mon employeur|discrimination au travail)\b/i
  ],
  [INTENTS.CYBER_HARASSMENT]: [
    /\b(ibtizaz|ibtizaaz|chantage|sextortion|tsawri|tsawar|photos|facebook|instagram|whatsapp|snapchat|piratage|reseaux sociaux)\b/i,
    /\b(kayhdr lia b tsawri|ghadi ynchr tsawri|tahdid b tsawar|chantage numerique|cyberharcelement|cyber harcelement|extorsion)\b/i,
    /(ابتزاز|ابتزاز الكتروني|ابتزاز الكتروني|تهديد بنشر الصور|نشر صوري|صور خاصه|قرصنه|تشهير|واتساب|فيسبوك)/i
  ],
  [INTENTS.LEGAL_PROCEDURE]: [
    /\b(plainte|chkaya|chkawa|procedur|procedure|chihada tibiya|certificat medical|commissariat|mahkama|tribunal|wakil lmalik|procureur)\b/i,
    /\b(kifach ndir chkaya|kifach ndfe3 plainte|fin nmchi|kifach ncheki|kifach nchki|nchki|ncheki|bghit nchki|comment porter plainte|deposer plainte|demarches|etapes pour deposer)\b/i,
    /(شكايه|كيفاش ندير شكايه|كيفاش نحط شكايه|وكيل الملك|المحكمه|شهاده طبيه|اجراءات رفع دعوي|المسطره القانونيه|كيف اشتكي|كيفاش نشكي|بغيت نشكي|المحكمه الابتدائيه)/i
  ],
  [INTENTS.REQUEST_SUPPORT]: [
    /\b(centre|jam3iya|jam3iyat|association|hebergement|iwa2|mouhami|avocat|psycologue|psy|tabib)\b/i,
    /\b(centre d[' ]ecoute|centre d[' ]hebergement|mosa3ada|aide juridique|aide psychologique|orientation|femmes battues|soutien juridique|t3awni|chi jam3iya)\b/i,
    /\b(fin n9der nl9a|fin nl9a|fin nl9a chi jam3iya|trouver une association|besoin d'une association)\b/i,
    /(جمعيه|جمعيات|مركز استماع|مراكز الاستماع|ايواء|مركز ايواء|مساعده قانونيه|محامي بالمجان|طبيب نفسي|اين اجد مساعده|اين اجد مركز|شي جمعيه|جمعيه تعاوني)/i
  ],
  [INTENTS.DISCRIMINATION]: [
    /\b(discrimination|tamyiz|irtt|tarka|mirat|inegalite|sexisme|inégalités|inegalites)\b/i,
    /(تمييز|التمييز|التمييز علي اساس الجنس|الارث|الميراث|حقوق المراه والمساواه|الترقيه والاجور)/i
  ],
  [INTENTS.LEGAL_QUESTION]: [
    /\b(7o9o9|7o9ou9|ho9oq|9anoun|qanoun|loi|droit|droits|code|article|articles|moudawana|moudawwana|modawana|103-13|103\.13|nafa9a|hadana|talaq|tala9|ch9a9|khol3)\b/i,
    /\b(validite|contrat|mariage|divorce|garde des enfants|pension alimentaire|droits de la femme|code penal|wash 3andi chi 7o9o9|wach 3andi chi 7o9o9)\b/i,
    /(قانون|القانون|حقوق|حقوقي|واش عندي شي حقوق|مدونه الاسره|القانون 103-13|القانون الجنائي|طلاق|شقاق|نفقه|حضانه|خلع|ثبوت الزوجيه|عقوبه)/i,
    /\b(chnowa kay9ol l9anoun|chhal l3o9oba|chhal l3o9ouba|quelle est la peine|que dit la loi|mes droits|dispositions|sanctionnant)\b/i
  ],
  [INTENTS.GENERAL_CONVERSATION]: [
    /^(salam|salamo alaykom|slm|salut|bonjour|bonsoir|coucou|hello|hi|hey|ahlan|marhaba|sbah lkhir|msa lkhir|labas|kidayr|kidayra|ca va|merci|chokran|choukran)\b/i,
    /^(qui es-tu|qui es tu|c'est quoi sanad|chkon nta|chkon nti|chnou kadir|comment tu t'appelles)\b/i,
    /^(merci|chokran|barak allaho fik|bonne journee|au revoir|bslama|bye)\b/i,
    /^(السلام|السلام عليكم|اهلا|مرحبا|صباح الخير|مساء الخير|كيف دايره|لاباس|شكرا|شكرا جزيلا|شكون نتي|بسلامه|مع السلامه)$/i
  ]
};

/**
 * Classify user input intent.
 */
function classifyIntent(text, language = null) {
  if (!text || typeof text !== 'string') {
    return {
      primaryIntent: INTENTS.OTHER,
      confidence: 0,
      scores: {},
      isEmergency: false,
      mode: 'MODE_A'
    };
  }

  const clean = text.trim();
  const lower = clean.toLowerCase();
  const normalized = normalize(clean);
  const detectedLang = language || detectLanguage(clean);
  const safety = detectSafetyRisk(clean);

  // 1. Direct Emergency Override if Safety Risk is CRITICAL
  if (safety.riskLevel === RISK_LEVELS.CRITICAL) {
    return {
      primaryIntent: INTENTS.EMERGENCY,
      confidence: 0.98,
      scores: { [INTENTS.EMERGENCY]: 0.98 },
      isEmergency: true,
      mode: 'MODE_C',
      safety
    };
  }

  // 2. Strict check for pure greetings & small talk
  const isPureGreeting = isGreetingOrSmallTalk(lower, normalized);
  if (isPureGreeting && safety.riskLevel === RISK_LEVELS.NONE) {
    return {
      primaryIntent: INTENTS.GENERAL_CONVERSATION,
      confidence: 0.96,
      scores: { [INTENTS.GENERAL_CONVERSATION]: 0.96 },
      isEmergency: false,
      mode: 'MODE_A',
      safety
    };
  }

  // 3. Multi-intent scoring based on regex pattern hits
  const scores = {};
  for (const intent of Object.values(INTENTS)) {
    scores[intent] = 0;
  }

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(clean) || pattern.test(normalized)) {
        scores[intent] += 1;
      }
    }
  }

  // Boost based on safety detection results
  if (safety.riskLevel === RISK_LEVELS.HIGH) {
    if (safety.category === 'DOMESTIC_VIOLENCE') {
      scores[INTENTS.DOMESTIC_VIOLENCE] += 3;
    } else {
      scores[INTENTS.PHYSICAL_VIOLENCE] += 3;
    }
  }
  if (safety.category === 'CYBER_HARASSMENT') {
    scores[INTENTS.CYBER_HARASSMENT] += 3;
  }

  // Boost REQUEST_SUPPORT when specific support terms are used
  if (/\b(centre|jam3iya|association|hebergement|مراكز|جمعية|مركز)\b/i.test(clean) ||
      /\b(centre|jam3iya|association|hebergement|مراكز|جمعيه|مركز)\b/i.test(normalized)) {
    scores[INTENTS.REQUEST_SUPPORT] += 2;
  }

  // Determine highest scoring intent
  let topIntent = INTENTS.GENERAL_CONVERSATION;
  let maxScore = 0;

  for (const [intent, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      topIntent = intent;
    }
  }

  // Fallbacks if no patterns matched
  if (maxScore === 0) {
    if (isLegalGeneralQuery(lower, normalized)) {
      topIntent = INTENTS.LEGAL_QUESTION;
      maxScore = 1;
    } else if (clean.length < 25 && !lower.includes('droit') && !lower.includes('loi')) {
      topIntent = INTENTS.GENERAL_CONVERSATION;
      maxScore = 0.7;
    } else {
      topIntent = INTENTS.OTHER;
      maxScore = 0.5;
    }
  }

  const confidence = Math.min(0.99, Number((0.55 + maxScore * 0.15).toFixed(2)));

  // Mode assignment
  let mode = 'MODE_A';
  if ([INTENTS.EMERGENCY, INTENTS.DOMESTIC_VIOLENCE, INTENTS.PHYSICAL_VIOLENCE].includes(topIntent) && safety.riskLevel !== RISK_LEVELS.NONE) {
    mode = 'MODE_C';
  } else if ([
    INTENTS.LEGAL_QUESTION,
    INTENTS.LEGAL_PROCEDURE,
    INTENTS.SEXUAL_HARASSMENT,
    INTENTS.WORKPLACE_HARASSMENT,
    INTENTS.DISCRIMINATION,
    INTENTS.CYBER_HARASSMENT,
    INTENTS.REQUEST_SUPPORT,
    INTENTS.DOMESTIC_VIOLENCE,
    INTENTS.PHYSICAL_VIOLENCE
  ].includes(topIntent)) {
    mode = 'MODE_B';
  }

  return {
    primaryIntent: topIntent,
    confidence,
    scores,
    isEmergency: topIntent === INTENTS.EMERGENCY || safety.riskLevel === RISK_LEVELS.CRITICAL,
    mode,
    language: detectedLang,
    safety
  };
}

/**
 * Checks if input is an everyday greeting or general small talk
 */
function isGreetingOrSmallTalk(lower, normalized) {
  const pureGreetings = [
    'salam', 'slm', 'salut', 'bonjour', 'bonsoir', 'hello', 'hi', 'hey',
    'marhaba', 'ahlan', 'labas', 'ca va', 'kidayr', 'kidayra',
    'salamo alaykom', 'salam alikoum', 'salam alaykoum',
    'ash khbark', 'ach khbark', 'sbah lkhir', 'msa lkhir',
    'merci', 'chokran', 'choukran', 'thx', 'barak allaho fik',
    'au revoir', 'bslama', 'bsslama', 'bye', 'bonne journee', 'bonne nuit',
    'bghit nsawlk', 'bghit nsawlk 3la chi haja', 'bghit nswl', '3andi soual', 'j\'ai une question',
    'السلام', 'السلام عليكم', 'اهلا', 'مرحبا', 'صباح الخير', 'مساء الخير',
    'لاباس', 'كيف الحال', 'شكرا', 'شكرا جزيلا', 'بسلامه', 'مع السلامه',
    'بغيت نسولك', 'بغيت نسولك على شي حاجة', 'عندي سؤال'
  ];

  if (pureGreetings.includes(lower) || pureGreetings.includes(normalized)) {
    return true;
  }

  // Conversational openings (e.g. "Bghit nsawlk 3la chi haja", "Salam, labas 3lik?")
  const conversationalOpeningPattern = /^(bghit nsawlk|bghit nswl|3andi soual|j'ai une question|est-ce que je peux te poser|بغيت نسولك|عندي سؤال)(\s.*)?$/i;
  if (conversationalOpeningPattern.test(lower) || conversationalOpeningPattern.test(normalized)) {
    // Only if it doesn't contain a specific crime or urgent violence term
    if (!/(drbni|kaydrbni|9telni|taharoch|taharouch|viol|agression|plainte|chkaya|يقتلني|ضرب|اعتداء|عنف)/i.test(lower)) {
      return true;
    }
  }

  // Starts with greeting and doesn't contain legal terms
  const greetingPattern = /^(salam|slm|bonjour|salut|coucou|hello|hi|ahlan|marhaba|السلام|صباح الخير|مساء الخير|اهلا|مرحبا)(\s|$)/i;
  const noLegalTerms = !/(loi|droit|avocat|plainte|chkaya|rajli|kaydrbni|ضرب|قانون|طلاق|نفقة|تحرش|viol|police|19|177)/i.test(lower) &&
                       !/(قانون|شكايه|طلاق|ضرب|عنف|تحرش|بوليس|محكمه)/.test(normalized);

  if (greetingPattern.test(lower) || greetingPattern.test(normalized)) {
    if (lower.split(/\s+/).length <= 6 && noLegalTerms) {
      return true;
    }
  }

  // Identity inquiries
  if (/^(qui es[- ]tu|c'est quoi sanad|chkon nta|chkon nti|chnou kadir|chnou kat3ref|comment tu t'appelles|شكون نتي|ما هو سند)\??$/i.test(lower) ||
      /^(شكون نتي|ما هو سند|من انت)\??$/.test(normalized)) {
    return true;
  }

  return false;
}

function isLegalGeneralQuery(lower, normalized) {
  return /(loi|droit|droits|article|code|juridique|tribunal|juge|avocat|police|plainte|justice)/i.test(lower) ||
         /(قانون|حق|حقوق|محكمه|قاضي|محامي|شرطه|شكايه|عداله)/.test(normalized);
}

module.exports = {
  INTENTS,
  classifyIntent
};
