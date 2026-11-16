/**
 * SANAD Safety & Emergency Detection Service
 * Conservative safety monitor designed to protect users in danger without false negatives.
 * Identifies risk level (CRITICAL, HIGH, MEDIUM, LOW, NONE), category, and provides verified guidance.
 */

const RISK_LEVELS = {
  CRITICAL: 'CRITICAL', // Imminent physical danger / life threat
  HIGH: 'HIGH',         // Recurrent physical / sexual violence, severe abuse
  MEDIUM: 'MEDIUM',     // Cyber-harassment, threats, blackmail
  LOW: 'LOW',           // Apprehension, tension, verbal dispute
  NONE: 'NONE'          // Everyday chat, legal inquiries without immediate threat
};

const EMERGENCY_HOTLINES = {
  police: '19',            // Police secours (zone urbaine - Sûreté Nationale)
  gendarmerie: '177',       // Gendarmerie Royale (zone rurale et périphérie)
  protectionCivile: '15',  // Protection Civile / Urgences médicales
  allovictime: '0800000103' // Ligne d'écoute et orientation nationale CNDH / Solidarité
};

// Imminent danger / immediate attack keywords (CRITICAL)
const CRITICAL_KEYWORDS = [
  // French (normalized without accents)
  'au secours', 'sauvez-moi', 'sauvez moi', 'il va me tuer', 'il me bat maintenant',
  'il a une arme', 'il a un couteau', 'danger immediat', 'danger immédiat', 'je saigne',
  'il veut me tuer', 'il est devant ma porte', 'il m\'a enfermee', 'il m\'a enfermée',
  'il m\'enferme', 'il me sequestre', 'il me séquestre', 'tentative de meurtre',
  'viol en cours', 'il casse tout', 'a l\'aide', 'a l aide',
  // Arabic & Darija
  'عتقوني', 'عتقوني دابا', 'كيقتلني', 'كيضربني دابا', 'عندو جنوية', 'عندو سلاح',
  'خطر كبير', 'النجدة', 'غادي يقتلني', 'حبسني فالدار', 'سد عليا', 'بغى يقتلني',
  'كيجري عليا', 'محبوسة', 'كيضرب فيا', 'كتسيل مني الدم', 'أغيثوني', 'اغيثوني',
  // Arabizi
  '3t9ouni', '3t9oni', '3at9oni', '3t9ni', 'ghadi y9telni', 'ghay9telni', 'kaydrabni daba',
  'kaydrbni daba', '3ndo jnoia', '3ando slah', 'habasni', 'sed 3lia',
  'bgha y9telni', 'kayteba3ni daba', 'kayjri 3lia', 'kantsil bdm', 'tay9talni'
];

// Severe physical violence / recurrent abuse keywords (HIGH)
const HIGH_RISK_KEYWORDS = [
  // French
  'violence conjugale', 'mon mari me frappe', 'mon pere me bat', 'mon père me bat',
  'agression physique', 'menace de mort', 'il menace de me tuer', 'coups et blessures',
  'violee', 'violée', 'viol', 'etranglement', 'étranglement', 'il m\'a etranglee',
  'il m\'a étranglée', 'yeux au beurre noir', 'fracture', 'peur de rentrer',
  'il me menace avec un couteau', 'il m\'a violentee', 'il m\'a violentée', 'battue', 'il me bat',
  // Arabic
  'عنف زوجي', 'العنف الزوجي', 'راجلي كيضربني', 'كيضربني بزاف', 'تهديد بالقتل',
  'اعتداء جسدي', 'ضرب وجرح', 'اغتصاب', 'خنقتي', 'خنقني', 'خايفة نرجع للدار',
  'كيهددني بالسلاح', 'عنف أسري', 'العنف الأسري', 'عنف جسدي', 'العنف الجسدي',
  'ضربني راجلي', 'كيعنفني', 'الضرب المتكرر', 'الزوج يضربني', 'ضربني',
  // Arabizi
  'rajli kaydrabni', 'rajli kaydrbni', 'kaydrabni bzf', 'kayhadedni blmowt',
  'kayhadedni b lmot', 'drabni', 'drbni', 'khrejna l sbitar', 'khaft nrja3 ldar',
  'kaykhna9ni', 'khna9ni', 'tghtasabt', 'i9tissab', 'kayhini'
];

// Cyber harassment / blackmail / psychological abuse keywords (MEDIUM)
const MEDIUM_RISK_KEYWORDS = [
  // French
  'chantage', 'sextortion', 'il menace de diffuser mes photos', 'diffusion de photos',
  'cyberharcelement', 'cyberharcèlement', 'pirate mon compte', 'menaces sur whatsapp',
  'harcelement en ligne', 'harcèlement en ligne', 'divulgation de donnees privees',
  // Arabic
  'ابتزاز', 'ابتزاز الكتروني', 'ابتزاز إلكتروني', 'كيهددني بتصاوري', 'نشر صوري',
  'صور خاصة', 'قرصنة حسابي', 'تهديد على الواتساب', 'تشهير',
  // Arabizi
  'ibtizaz', 'kayhadedni b tsawri', 'ghadi ynchr tsawri', 'tahdid b tsawar',
  'tsawri f internet', 'cyberharcelement', 'kayhdr lia b tsawri'
];

/**
 * Normalizes text to handle accents and Arabic alef variations
 */
function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[إأآا]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');
}

/**
 * Detects risk level, emergency state and category
 */
function detectSafetyRisk(text) {
  if (!text || typeof text !== 'string') {
    return {
      isEmergency: false,
      riskLevel: RISK_LEVELS.NONE,
      category: null,
      matchedKeywords: [],
      emergencyHotlines: EMERGENCY_HOTLINES
    };
  }

  const clean = text.toLowerCase();
  const normalized = normalizeText(text);

  // Check critical keywords
  const matchedCritical = CRITICAL_KEYWORDS.filter(kw => {
    const normKw = normalizeText(kw);
    return clean.includes(kw.toLowerCase()) || normalized.includes(normKw);
  });

  if (matchedCritical.length > 0) {
    return {
      isEmergency: true,
      riskLevel: RISK_LEVELS.CRITICAL,
      category: 'EMERGENCY',
      matchedKeywords: matchedCritical,
      emergencyHotlines: EMERGENCY_HOTLINES
    };
  }

  // Check high risk keywords
  const matchedHigh = HIGH_RISK_KEYWORDS.filter(kw => {
    const normKw = normalizeText(kw);
    return clean.includes(kw.toLowerCase()) || normalized.includes(normKw);
  });

  // Domestic violence indicators (any order)
  const hasPartner = /(mari|conjoint|epoux|husband|rajli|rajel|zawji|zawj|الزوج|راجلي|زوجي|دار الزوجيه|بيت الزوجيه|foyer conjugal|domicile conjugal)/i.test(clean) ||
                     /(زوج|راجلي|دار الزوجيه|بيت الزوجيه)/.test(normalized);
  const hasDomesticViolenceAction = /(tard|tred|bat|frapp|violenc|expuls|menac|kaydrb|kaydreb|kay3nf|كيعنف|كيضرب|طرد|اهانه|ضربني|حقرني)/i.test(clean) ||
                                    /(طرد|عنف|ضرب|تهديد|اهانه)/.test(normalized);
  const isDomesticMatch = hasPartner && hasDomesticViolenceAction;

  // Physical violence indicators
  const hasPhysicalAssault = /(agressee|agresse|agression physique|coups et blessures|tabassee|اعتداء جسدي|ضرب وجرح|كدمات)/i.test(clean) ||
                             /(agressee|agresse|agression physique|coups et blessures|tabassee|اعتداء جسدي|ضرب وجرح|كدمات)/i.test(normalized);

  if (matchedHigh.length > 0 || isDomesticMatch || hasPhysicalAssault) {
    const isDomestic = isDomesticMatch ||
                       /(rajli|mari|conjoint|zawji|foyer|dar|زوجي|راجلي|الزوج)/i.test(clean) ||
                       /(زوج|راجلي|دار الزوجيه)/.test(normalized);
    return {
      isEmergency: true,
      riskLevel: RISK_LEVELS.HIGH,
      category: isDomestic ? 'DOMESTIC_VIOLENCE' : 'PHYSICAL_VIOLENCE',
      matchedKeywords: isDomesticMatch ? ['violence conjugale / expulsion du foyer'] : (hasPhysicalAssault ? ['agression physique'] : matchedHigh),
      emergencyHotlines: EMERGENCY_HOTLINES
    };
  }

  // Check medium risk keywords
  const matchedMedium = MEDIUM_RISK_KEYWORDS.filter(kw => {
    const normKw = normalizeText(kw);
    return clean.includes(kw.toLowerCase()) || normalized.includes(normKw);
  });

  if (matchedMedium.length > 0) {
    return {
      isEmergency: false,
      riskLevel: RISK_LEVELS.MEDIUM,
      category: 'CYBER_HARASSMENT',
      matchedKeywords: matchedMedium,
      emergencyHotlines: EMERGENCY_HOTLINES
    };
  }

  // Low risk checks (fear, tension, verbal)
  if (/\b(peur|menace|battu|frapper|khouf|darb)\b/i.test(normalized) || /(خوف|تهديد|ضرب)/.test(normalized)) {
    return {
      isEmergency: false,
      riskLevel: RISK_LEVELS.LOW,
      category: 'LOW_RISK',
      matchedKeywords: [],
      emergencyHotlines: EMERGENCY_HOTLINES
    };
  }

  return {
    isEmergency: false,
    riskLevel: RISK_LEVELS.NONE,
    category: null,
    matchedKeywords: [],
    emergencyHotlines: EMERGENCY_HOTLINES
  };
}

function getEmergencyHotlines() {
  return EMERGENCY_HOTLINES;
}

function getSafetyGuidance(category = 'EMERGENCY', language = 'fr') {
  if (language === 'darija' || language === 'arabizi') {
    return [
      'سلامتك أولاً: بعدي من بلاصة الخطر وسيري عند الجيران، العائلة ولا أقرب كوميسارية.',
      'عيطي فوراً للأرقام المجانية: 19 (الشرطة) أو 177 (الدرك الملكي) أو 15 (الإسعاف).',
      'يلا كاين ضرب، سيري للسبيطار دالمخزن خودي شهادة طبية بالمجان كاتتبت الضرر الجسدي والنفسي.',
      'يلا كان ابتزاز إلكتروني: ما تمسحي حتى ميساج ولا تصويرة، وما تصيفطيش الفلوس أبداً.'
    ];
  }
  if (language === 'arabic') {
    return [
      'سلامتكِ وأمانكِ هما الأولوية: توجهي فوراً إلى مكان آمن (عائلة، جيران، أو أقرب مركز أمني).',
      'الاتصال الفوري بأرقام الطوارئ المجانية: 19 (الشرطة)، 177 (الدرك الملكي)، 15 (الوقاية المدنية).',
      'في حالة الاعتداء الجسدي: التوجه للمستشفى العمومي للحصول على شهادة طبية شرعية تعاين الإصابات بدقة.',
      'في حالة الابتزاز الإلكتروني: الاحتفاظ بكافة الرسائل والصور كأدلة رسمية وعدم الرضوخ لأي تهديد مالي.'
    ];
  }
  return [
    'Votre sécurité avant tout : mettez-vous en lieu sûr (proches, voisins, espace public ou commissariat).',
    'Composez immédiatement les numéros gratuits : 19 (Police), 177 (Gendarmerie), 15 (Protection Civile).',
    'En cas de violences physiques : rendez-vous à l’hôpital public pour obtenir un certificat médical attestant des lésions.',
    'En cas de chantage numérique : conservez toutes les captures d’écran et messages, ne supprimez rien et ne versez jamais d’argent.'
  ];
}

module.exports = {
  RISK_LEVELS,
  EMERGENCY_HOTLINES,
  CRITICAL_KEYWORDS,
  HIGH_RISK_KEYWORDS,
  MEDIUM_RISK_KEYWORDS,
  detectSafetyRisk,
  assessSafety: detectSafetyRisk,
  getEmergencyHotlines,
  getSafetyGuidance
};
