/**
 * SANAD AI Assistant - Grounded Legal RAG Service
 * Provides verified citations, articles, and explanations from Moroccan Law:
 * - Loi 103-13 (Lutte contre les violences faites aux femmes)
 * - Code Pénal Marocain
 * - Code de la Famille (Moudawana)
 * - Code du Travail (Loi 65-99)
 * - Loi 09-08 / Loi 07-03 (Cybercriminalité et protection des données)
 */

const mongoose = require('mongoose');
const { KNOWLEDGE_BASE } = require('./knowledgeBase');

/**
 * Text Normalizer for Arabic, Darija and Arabizi with number conversions
 */
function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  let str = text.toLowerCase().trim();

  // Remove diacritics / tashkeel
  str = str.replace(/[\u064B-\u065F\u0670]/g, '');

  // Normalize Arabic letters
  str = str.replace(/[إأآا]/g, 'ا')
           .replace(/[ىي]/g, 'ي')
           .replace(/ة/g, 'ه')
           .replace(/ؤ/g, 'و')
           .replace(/ئ/g, 'ي');

  // Strip punctuation but keep Arabizi numbers 2, 3, 5, 7, 8, 9
  str = str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'«»]/g, ' ');

  // Collapse multiple whitespaces
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * Generates transliterated tokens for Arabizi <-> Darija matching
 */
function getSearchTokens(text) {
  const normalized = normalizeText(text);
  const words = normalized.split(/\s+/).filter(w => w.length >= 2);
  const tokenSet = new Set(words);

  // Common Arabizi to phonetic roots
  for (const word of words) {
    // 3 -> 3/a/e (ع)
    // 7 -> 7/h (ح)
    // 9 -> 9/q/k (ق)
    // 5 -> 5/kh (خ)
    // ch -> ch/sh (ش)
    const simplified = word
      .replace(/ch/g, 'sh')
      .replace(/ou/g, 'u')
      .replace(/3/g, 'a')
      .replace(/7/g, 'h')
      .replace(/9/g, 'q')
      .replace(/5/g, 'kh');
    tokenSet.add(simplified);
  }

  return Array.from(tokenSet);
}

/**
 * Searches the 100+ Q&A Knowledge Base for the best matching entry
 */
function findBestKnowledgeMatch(query, language = 'fr') {
  if (!query || typeof query !== 'string') return null;

  const cleanQuery = normalizeText(query);
  const queryTokens = getSearchTokens(query);

  let bestEntry = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;

    // Check exact question matches
    const qDarijaNorm = normalizeText(entry.questionDarija);
    const qArabiziNorm = normalizeText(entry.questionArabizi);
    const qArNorm = normalizeText(entry.questionAr);
    const qFrNorm = normalizeText(entry.questionFr);

    if (cleanQuery === qDarijaNorm || cleanQuery === qArabiziNorm || cleanQuery === qArNorm || cleanQuery === qFrNorm) {
      score += 100;
    }

    // Check alternative formulations
    for (const alt of entry.alternativeFormulations || []) {
      const altNorm = normalizeText(alt);
      if (cleanQuery.includes(altNorm) || altNorm.includes(cleanQuery)) {
        score += 40;
      }
    }

    // Check token overlaps
    const entryText = `${qDarijaNorm} ${qArabiziNorm} ${qArNorm} ${qFrNorm} ${(entry.alternativeFormulations || []).join(' ')} ${entry.category}`.toLowerCase();
    
    for (const token of queryTokens) {
      if (entryText.includes(token)) {
        score += token.length >= 4 ? 6 : 3;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  // Minimum threshold to consider a reliable match
  if (bestEntry && bestScore >= 6) {
    let localizedAnswer = bestEntry.answerFr;
    let localizedQuestion = bestEntry.questionFr;

    if (language === 'arabizi') {
      localizedAnswer = bestEntry.answerArabizi || bestEntry.answerDarija;
      localizedQuestion = bestEntry.questionArabizi;
    } else if (language === 'darija') {
      localizedAnswer = bestEntry.answerDarija;
      localizedQuestion = bestEntry.questionDarija;
    } else if (language === 'arabic') {
      localizedAnswer = bestEntry.answerAr;
      localizedQuestion = bestEntry.questionAr;
    }

    return {
      match: bestEntry,
      score: bestScore,
      localizedAnswer,
      localizedQuestion,
      legalReference: bestEntry.legalReference,
      source: bestEntry.source,
      verified: true
    };
  }

  return null;
}

// Verified Official Legal Database for SANAD
const VERIFIED_LEGAL_CORPUS = [
  {
    id: 'loi-103-13-harcelement',
    code: 'Loi 103-13',
    article: 'Article 503-1-1 (Code Pénal via Loi 103-13)',
    titleFr: 'Harcèlement sexuel dans les espaces publics ou numériques',
    titleAr: 'التحرش الجنسي في الفضاء العام أو الإلكتروني',
    summaryFr: 'Punit le harcèlement sexuel (propos, gestes, messages écrits ou électroniques à caractère sexuel) d’un emprisonnement de 1 à 6 mois et d’une amende de 2.000 à 10.000 DH (peine doublée si l’auteur a autorité ou en cas de récidive).',
    summaryAr: 'يعاقب بالحبس من شهر واحد إلى ستة أشهر وغرامة من 2000 إلى 10000 درهم كل من أمعن في مضايقة الغير في الفضاءات العمومية أو غيرها، بأفعال أو أقوال أو إشارات ذات طبيعة جنسية أو بواسطة رسائل إلكترونية أو تسجيلات. وتضاعف العقوبة إذا كان الجاني زميلاً في العمل أو وصياً أو أحد الأصول.',
    summaryDarija: 'القانون كيعاقب على التحرش الجنسي سواء فالشارع أو فمواقع التواصل من شهر حتى لـ 6 شهور ديال الحبس وغرامة من 2000 حتى لـ 10000 درهم، والعقوبة كتدوبل يلا كان فالحبس أو فالبلاصة دالخدمة.',
    category: 'HARASSMENT',
    keywords: ['taharouch', 'harcelement', 'تحرش', 'harcelement sexuel', 'chari3', 'espace public', 'rue'],
    officialSource: 'https://adala.justice.gov.ma',
    sourceName: 'Portail Juridique Adala (Ministère de la Justice)'
  },
  {
    id: 'loi-103-13-expulsion-foyer',
    code: 'Loi 103-13',
    article: 'Article 480-1 (Code Pénal via Loi 103-13)',
    titleFr: 'Expulsion du domicile conjugal',
    titleAr: 'طرد أحد الزوجين من بيت الزوجية',
    summaryFr: 'Interdit formellement l’expulsion d’un conjoint du domicile conjugal. L’auteur est puni de 1 à 3 mois de prison et de 2.000 à 5.000 DH d’amende. Le procureur ou le tribunal peut ordonner la réintégration immédiate.',
    summaryAr: 'يعاقب بالحبس من شهر إلى ثلاثة أشهر وغرامة من 2000 إلى 5000 درهم كل من طرد زوجه من بيت الزوجية أو منعه من الرجوع إليه. وتتخذ النيابة العامة أو المحكمة تدبيراً بإرجاع المطرود فوراً إلى بيت الزوجية.',
    summaryDarija: 'ممنوع على الراجل يطرد مرتو من دار الزوجية. القانون كيعاقب بالحبس من شهر لـ 3 أشهر وغرامة، والنيابة العامة كترجع الزوجة فالبلاصة لدارها.',
    category: 'DOMESTIC_VIOLENCE',
    keywords: ['tard', 'dar', 'foyer conjugal', 'domicile', 'طرد', 'طردني راجلي', 'خرجني من الدار'],
    officialSource: 'http://www.sgg.gov.ma/BulletinOfficiel.aspx',
    sourceName: 'Secrétariat Général du Gouvernement (Bulletin Officiel n° 6655)'
  },
  {
    id: 'loi-103-13-mesures-protection',
    code: 'Loi 103-13',
    article: 'Article 82-5 (Code de Procédure Pénale via Loi 103-13)',
    titleFr: 'Mesures de protection immédiate (Ordonnance d’éloignement)',
    titleAr: 'تدابير الحماية الفورية وأمر الابتعاد',
    summaryFr: 'Permet au Procureur du Roi ou au Juge d’interdire à l’agresseur d’approcher la victime, de son domicile ou de ses enfants, et d’ordonner sa prise en charge psychologique.',
    summaryAr: 'يمكن لوكيل الملك أو قاضي التحقيق أو المحكمة منع المعتدي من الاقتراب من الضحية أو من سكنها أو أبنائها، وتوجيه المعتدي للخضوع لعلاج نفسي، وإشعار المعتدي بأنه في حال خرق المنع سيتعرض لعقوبات حبسية مشددة.',
    summaryDarija: 'وكيل الملك ولا المحكمة كيقدر يخرج أمر يمنع المعتدي يقرب من الضحية ولا من الدار ولا ولادها، وفحالة خرق هاد الأمر كيتعاقب بالحبس.',
    category: 'PROTECTION',
    keywords: ['protection', 'mesure de protection', 'éloignement', 'ordonnance', 'حماية', 'إبعاد', 'وكيل الملك'],
    officialSource: 'https://adala.justice.gov.ma',
    sourceName: 'Ministère de la Justice - Adala'
  },
  {
    id: 'penal-cyber-diffamation',
    code: 'Code Pénal',
    article: 'Article 447-1 et 447-2 (via Loi 103-13)',
    titleFr: 'Diffusion non consentie d’images, photos et chantage électronique',
    titleAr: 'بث أو نشر ادعاءات أو صور شخصية دون موافقة والابتزاز',
    summaryFr: 'Punit de 6 mois à 3 ans de prison toute personne captant, enregistrant ou diffusant des images, paroles ou photos d’une personne sans son consentement. La peine passe de 1 à 5 ans si l’auteur est le conjoint ou un ex-conjoint.',
    summaryAr: 'يعاقب بالحبس من 6 أشهر إلى 3 سنوات وغرامة كل من قام عمداً بالتقاط أو تسجيل أو بث أو توزيع صور شخص دون موافقته. وترتفع العقوبة من سنة إلى 5 سنوات وسجن مشدد إذا كان مرتكب الفعل هو الزوج أو الطليق أو الخطيب.',
    summaryDarija: 'يلا شي حد نشر تصاورك ولا فيديوهاتك بلا خبارك ولا كيهددك بيهم (الابتزاز الإلكتروني)، القانون كيعاقب بالحبس من 6 شهور حتى لـ 3 سنين، وكتوصل لـ 5 سنين يلا كان راجلك ولا خطيبك.',
    category: 'CYBER_HARASSMENT',
    keywords: ['ibtizaz', 'tsawar', 'photos', 'chantage', 'sextortion', 'ابتزاز', 'صور', 'فيسبوك', 'واتساب', 'نشر'],
    officialSource: 'https://adala.justice.gov.ma',
    sourceName: 'Code Pénal Marocain - Adala'
  },
  {
    id: 'moudawana-chiqaq',
    code: 'Code de la Famille (Moudawana)',
    article: 'Articles 94 à 97 (Moudawana)',
    titleFr: 'Divorce pour discorde (Chiqaq)',
    titleAr: 'الطلاق للشقاق',
    summaryFr: 'Permet à l’épouse de demander la dissolution du mariage sans devoir prouver la violence ou la faute du conjoint. La procédure dure environ 3 à 6 mois. Le tribunal tente la réconciliation puis fixe les droits financiers de l’épouse et des enfants.',
    summaryAr: 'حق مضمون لكل من الزوجين لطلب حل ميثاق الزوجية بسبب النزاع واستحكام الخلاف دون الحاجة لإثبات الضرر المادي. تحدد المحكمة بعد جلسات الصلح مستحقات الزوجة والأبناء (المتعة، النفقة، السكنى، الحضانة).',
    summaryDarija: 'طلاق الشقاق كيعطي الحق للزوجة تطلب الطلاق يلا كان خلاف وما محتاجاش تبين دليل ولا شهود على العنف باش تاخد الطلاق. المحكمة كتحدد مستحقات الزوجة (المتعة، السكنى، ونفقة الولاد).',
    category: 'FAMILY_LAW',
    keywords: ['chiqaq', 'ch9a9', 'talaq', 'divorce', 'طلاق', 'شقاق', 'نفقة', 'حضانة'],
    officialSource: 'http://www.sgg.gov.ma/Legislation/TextesLegaux.aspx',
    sourceName: 'Secrétariat Général du Gouvernement - Code de la Famille'
  },
  {
    id: 'moudawana-nafaqa',
    code: 'Code de la Famille (Moudawana)',
    article: 'Articles 187 à 193 (Moudawana)',
    titleFr: 'Pension alimentaire (Nafaqa) et Fonds d’Entraide Familiale',
    titleAr: 'النفقة وصندوق التكافل العائلي',
    summaryFr: 'La pension alimentaire comprend le logement, la nourriture, l’habillement et les soins médicaux de l’épouse et des enfants. En cas de non-paiement ou d’insolvabilité du père, le Fonds de Solidarité Familiale (Takaful 3aïli) verse les montants directement à la mère.',
    summaryAr: 'تشمل النفقة الغذاء والكسوة والعلاج والتعليم وسكنى الأبناء. وفي حال امتناع الأب عن الأداء أو تعذر التنفيذ، يتدخل صندوق التكافل العائلي التابع لوزارة العدل لصرف مبالغ النفقة مباشرة للأم الحاضنة.',
    summaryDarija: 'النفقة واجبة على الأب وكتشمل الماكلة، اللباس، الكرا والمدرسة، ويلا ما بغاش يخلص كاين صندوق التكافل العائلي كيعطي الفلوس للأم مباشرة باش يعاونها.',
    category: 'FAMILY_LAW',
    keywords: ['nafaqa', 'pension', 'نفقة', 'صندوق التكافل العائلي', 'أولاد', 'ولاد', 'فلوس'],
    officialSource: 'https://justice.gov.ma',
    sourceName: 'Ministère de la Justice - Guide du Fonds de Solidarité'
  },
  {
    id: 'travail-harcelement',
    code: 'Code du Travail (Loi 65-99)',
    article: 'Articles 40, 53 et 346 (Loi 65-99)',
    titleFr: 'Harcèlement et discrimination sur le lieu de travail',
    titleAr: 'التحرش الجنسي والتمييز في العمل',
    summaryFr: 'Considère le harcèlement sexuel commis par l’employeur ou un supérieur comme une faute grave (article 40), permettant à la salariée de quitter son travail tout en obtenant des indemnités de licenciement abusif et de porter plainte pénale.',
    summaryAr: 'يعتبر التحرش الجنسي الصادر عن المشغل أو رئيس العمل خطأ جسيماً يرتكبه المشغل ضد الأجيرة، ويخولها مغادرة العمل مع الحصول على جميع تعويضات الطرد التعسفي مع المتابعة الجنائية للمعتدي.',
    summaryDarija: 'يلا تعرضتي للتحرش فالبلاصة دالخدمة من عند الباطرون ولا الشاف، القانون كيعتبر هادشي خطأ جسيم من عند المشغل وكيعطيك الحق تاخدي تعويض كامل على الطرد التعسفي ومتابعة قانونية.',
    category: 'LABOR_LAW',
    keywords: ['khdma', 'travail', 'patron', 'khedma', 'شغل', 'عمل', 'مشغل', 'طرد تعسفي', 'licenciement'],
    officialSource: 'https://adala.justice.gov.ma',
    sourceName: 'Code du Travail Marocain - Adala'
  },
  {
    id: 'procedure-plainte-violences',
    code: 'Procédure Pénale',
    article: 'Procédure de Dépôt de Plainte et Certificat Médical',
    titleFr: 'Procédure de plainte pour violences et examen médical',
    titleAr: 'مسطرة تقديم شكاية العنف والحصول على الشهادة الطبية',
    summaryFr: 'La victime de violence peut s’adresser directement à la cellule de prise en charge des femmes victimes de violence au Tribunal de Première Instance, au commissariat ou à la brigade de gendarmerie. Un certificat médical (même sans durée d’ITT) doit être joint pour constater les lésions physiques ou psychologiques.',
    summaryAr: 'تتوجه الضحية إلى خلية التكفل بالنساء ضحايا العنف بالمحكمة الابتدائية أو بمقر الشرطة أو الدرك الملكي، مع إرفاق الشكاية بشهادة طبية تحدد مدة العجز أو معاينة الآثار الجسدية والنفسية، والشهادة تسلم مجاناً في المستشفيات العمومية.',
    summaryDarija: 'باش تحطي شكاية: كتمشي لخلية التكفل بالنساء ضحايا العنف فالمحكمة الابتدائية ولا فالكوميسارية ولا الجوندارم، وكتاخدي شهادة طبية من السبيطار دالمخزن بالمجان كتبين الضرب ولا الضرر النفسي.',
    category: 'LEGAL_PROCEDURE',
    keywords: ['plainte', 'chkaya', 'chihada tibiya', 'certificat medical', 'procédure', 'شكاية', 'شهادة طبية', 'وكيل الملك', 'محكمة'],
    officialSource: 'https://justice.gov.ma/services/cellules-femmes',
    sourceName: 'Cellules de prise en charge des femmes victimes de violence (Ministère de la Justice)'
  }
];

/**
 * Searches grounded Moroccan legal corpus matching user query keywords and intent
 */
async function searchLegalDatabase(query, options = {}) {
  const { category, limit = 3, language = 'fr' } = options;
  const clean = (query || '').toLowerCase().trim();

  // Try fetching dynamic legal documents from MongoDB if available
  let dynamicDocs = [];
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const LegalDocument = mongoose.models.LegalDocument || mongoose.model('LegalDocument');
      if (LegalDocument) {
        const mongoResults = await LegalDocument.find({
          $or: [
            { title: { $regex: clean, $options: 'i' } },
            { description: { $regex: clean, $options: 'i' } },
            { tags: { $in: [clean] } }
          ]
        }).limit(limit).lean();

        if (mongoResults && mongoResults.length > 0) {
          dynamicDocs = mongoResults.map(doc => ({
            id: doc._id.toString(),
            code: doc.category || 'Loi Marocaine',
            article: doc.articles ? doc.articles.join(', ') : 'Articles de loi',
            titleFr: doc.title,
            titleAr: doc.titleAr || doc.title,
            summaryFr: doc.description,
            summaryAr: doc.descriptionAr || doc.description,
            summaryDarija: doc.descriptionDarija || doc.description,
            category: doc.category,
            officialSource: doc.sourceUrl || 'https://adala.justice.gov.ma',
            sourceName: 'Portail Adala / SANAD Base'
          }));
        }
      }
    }
  } catch (err) {
    // Graceful fallback to verified static corpus
  }

  // Combine static and dynamic documents
  const allDocs = [...dynamicDocs, ...VERIFIED_LEGAL_CORPUS];

  // Score each document based on term matches
  const tokens = clean.split(/\s+/).filter(t => t.length >= 3);
  const scored = allDocs.map(doc => {
    let score = 0;
    const docText = `${doc.code} ${doc.article} ${doc.titleFr} ${doc.titleAr} ${doc.summaryFr} ${doc.summaryAr} ${(doc.keywords || []).join(' ')}`.toLowerCase();

    for (const token of tokens) {
      if (docText.includes(token)) {
        score += 2;
      }
    }

    if (category && doc.category === category) {
      score += 3;
    }

    return { doc, score };
  });

  // Sort by score descending and take top matches
  scored.sort((a, b) => b.score - a.score);
  const topMatches = scored.filter(s => s.score > 0).slice(0, limit).map(s => s.doc);

  // If no direct score match, return general relevant document (e.g. Loi 103-13 overview)
  if (topMatches.length === 0) {
    topMatches.push(VERIFIED_LEGAL_CORPUS[0]);
  }

  return topMatches.map(doc => formatLegalItem(doc, language));
}

function formatLegalItem(doc, language) {
  let title = doc.titleFr;
  let summary = doc.summaryFr;

  if (language === 'darija' || language === 'arabizi') {
    title = doc.titleAr || doc.titleFr;
    summary = doc.summaryDarija || doc.summaryAr || doc.summaryFr;
  } else if (language === 'arabic') {
    title = doc.titleAr;
    summary = doc.summaryAr;
  }

  return {
    id: doc.id,
    code: doc.code,
    article: doc.article,
    title,
    summary,
    officialSource: doc.officialSource,
    sourceName: doc.sourceName,
    category: doc.category
  };
}

module.exports = {
  VERIFIED_LEGAL_CORPUS,
  KNOWLEDGE_BASE,
  searchLegalDatabase,
  findBestKnowledgeMatch
};
