const Opportunity = require('../models/Opportunity');

const FALLBACK_OPPORTUNITIES = [
  {
    _id: 'opp_1',
    title: 'Programme Forsa : Accompagnement & Financement Entreprenariat Féminin',
    titleAr: 'برنامج فرصة : مواكبة وتمويل المشاريع النسائية المقاولاتية',
    organization: 'Ministère du Tourisme, de l\'Artisanat et de l\'Économie Sociale',
    organizationAr: 'وزارة السياحة والصناعة التقليدية والاقتصاد الاجتماعي',
    category: 'microfinance_forsa',
    region: 'Toutes les régions',
    city: 'National (12 Régions)',
    description: 'Prêt d\'honneur à taux 0% jusqu\'à 100 000 DH avec une subvention non remboursable de 10 000 DH et 2 mois et demi de formation en ligne et accompagnement par un mentor agréé.',
    descriptionAr: 'قرض شرف بنسبة فائدة 0% يصل إلى 100 ألف درهم مع منحة قدرها 10 آلاف درهم ومواكبة تدريبية عن بعد من طرف خبراء معتمدين.',
    requirements: ['Être âgée de plus de 18 ans', 'Avoir une idée de projet ou une coopérative en démarrage', 'Carte Nationale d\'Identité (CNIE)'],
    stipendOrSalary: 'Prêt d\'honneur à taux 0% + subvention 10.000 DH',
    contactPhone: '+212 5 37 67 92 00',
    officialLink: 'https://forsa.ma',
    verified: true,
    verifiedBy: 'Plateforme officielle Gouvernementale Forsa'
  },
  {
    _id: 'opp_2',
    title: 'Formation & Intégration en Couture Traditionnelle et Modélisme',
    titleAr: 'تكوين وتشغيل في الخياطة والفصالة التقليدية والعصرية',
    organization: 'Coopérative Féminine Al Amal & Entraide Nationale',
    organizationAr: 'تعاونية الأمل النسوية ومؤسسة التعاون الوطني',
    category: 'couture_confection',
    region: 'Casablanca-Settat',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    description: 'Cycle qualifiant de 3 à 6 mois pour femmes en réinsertion sociale. Apprentissage du caftan, djellaba et prêt-à-porter avec placement garanti dans des ateliers partenaires.',
    descriptionAr: 'دورة تكوينية وتأهيلية من 3 إلى 6 أشهر للنساء في وضعية إعادة الإدماج. تعلم خياطة القفطان والجلابة مع فرصة إدماج مهني مؤدى عنه.',
    requirements: ['Motivation', 'Disponibilité', 'Aucun diplôme préalable exigé'],
    stipendOrSalary: 'Bourse de transport + Rémunération après période d\'apprentissage',
    contactPhone: '+212 5 22 23 88 10',
    officialLink: 'https://entraide.gov.ma',
    verified: true,
    verifiedBy: 'Entraide Nationale Casablanca'
  },
  {
    _id: 'opp_3',
    title: 'Filière Cuisine & Traiteur Solidaire (Pâtisserie Marocaine)',
    titleAr: 'شعبة الطبخ والحلويات المغربية - التمكين الذاتي',
    organization: 'Association Solidarité Féminine (ASF)',
    organizationAr: 'جمعية التضامن النسوي',
    category: 'cuisine_traiteur',
    region: 'Casablanca-Settat',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    description: 'Programme certifié d\'autonomisation financière pour mères en situation vulnérable : cuisine marocaine, hygiène alimentaire HACCP et gestion de commande traiteur.',
    descriptionAr: 'برنامج معتمد للتمكين الاقتصادي للأمهات في وضعية صعبة : الطبخ المغربي، معايير السلامة الصحية، وإدارة طلبيات الحفلات والمناسبات.',
    requirements: ['Femmes et mères recherchant une autonomie financière', 'Entretien de motivation'],
    stipendOrSalary: 'Prise en charge complète + Rémunération d\'insertion',
    contactPhone: '+212 5 22 86 28 65',
    officialLink: 'https://solidarite-feminine.org',
    verified: true,
    verifiedBy: 'Association Solidarité Féminine'
  },
  {
    _id: 'opp_4',
    title: 'Coopérative Artisanale de Tissage & Huile d\'Argan',
    titleAr: 'تعاونية نسوية للصناعة التقليدية والمنتجات المجالية',
    organization: 'Union des Coopératives Féminines du Souss',
    organizationAr: 'اتحاد التعاونيات النسائية بسوس ماسة',
    category: 'artisanat_cooperative',
    region: 'Souss-Massa',
    city: 'Agadir / Taroudant',
    cityAr: 'أكادير / تارودانت',
    description: 'Activités génératrices de revenus (AGR) : valorisation de l\'argan, fabrication de cosmétiques bio et tissage berbère traditionnel. Partage équitable des bénéfices.',
    descriptionAr: 'أنشطة مدرة للدخل : تثمين الأركان والمنتجات المجالية والنسيج التقليدي مع توزيع عادل ومستدام للمداخيل.',
    requirements: ['Femmes de la région Souss-Massa', 'Volonté de travail en groupe solidaire'],
    stipendOrSalary: 'Revenu mensuel partagé selon production (1 800 à 3 500 DH)',
    contactPhone: '+212 5 28 84 55 12',
    verified: true,
    verifiedBy: 'Coordination Régionale INDH Souss'
  },
  {
    _id: 'opp_5',
    title: 'Formation aux Métiers du Numérique & Télétravail (Assistance & E-commerce)',
    titleAr: 'تكوين في المهارات الرقمية والعمل عن بعد (التجارة الإلكترونية والخدمات)',
    organization: 'Initiative Nationale pour le Développement Humain (INDH)',
    organizationAr: 'المبادرة الوطنية للتنمية البشرية',
    category: 'teletravail',
    region: 'Rabat-Salé-Kénitra',
    city: 'Rabat / Télétravail',
    cityAr: 'الرباط',
    description: 'Ateliers pratiques pour acquérir les compétences clés du travail à distance : saisie de données, gestion de boutique en ligne, relation client sur WhatsApp Business.',
    descriptionAr: 'ورشات عملية لاكتساب مهارات العمل الحر وعن بعد من المنزل : إدخال البيانات، إدارة المتاجر الإلكترونية، والتواصل مع الزبناء.',
    requirements: ['Notions de base en lecture et écriture', 'Smartphone ou ordinateur portable'],
    stipendOrSalary: 'Formation 100% gratuite + Matériel d\'apprentissage fourni',
    contactPhone: '+212 5 37 21 50 00',
    officialLink: 'https://indh.ma',
    verified: true,
    verifiedBy: 'INDH Rabat'
  },
  {
    _id: 'opp_6',
    title: 'Microcrédit Solidaire et Accompagnement de Petite Entreprise',
    titleAr: 'التمويل الأصغر التضامني ومواكبة الأنشطة الصغرى المدرة للدخل',
    organization: 'Fondation Al Amana & Attawfiq Microfinance',
    organizationAr: 'مؤسسة الأمانة والتوفيق للتمويل الأصغر',
    category: 'microfinance_forsa',
    region: 'Toutes les régions',
    city: 'Présent dans toutes les villes et provinces du Maroc',
    description: 'Financement de 2 000 à 50 000 DH adapté aux femmes artisanes, commerçantes et agricultrices, sans garantie hypothécaire, avec conseiller dédié.',
    descriptionAr: 'تمويل صغرى تضامني من 2000 إلى 50000 درهم موجه للمرأة الحرفية والتاجرة بدون ضمانات عقارية مع مواكبة ميدانية مستمرة.',
    requirements: ['Carte Nationale d\'Identité', 'Activité ou projet générateur de revenus'],
    stipendOrSalary: 'Micro-crédit souple à remboursement échelonné',
    contactPhone: '+212 5 37 77 11 00',
    officialLink: 'https://alamana.org.ma',
    verified: true,
    verifiedBy: 'Réseau National du Microcrédit CNDH'
  }
];

exports.getOpportunities = async (req, res) => {
  try {
    const { category, region, search } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }
    if (region && region !== 'all' && region !== 'Toutes les régions') {
      query.region = new RegExp(region, 'i');
    }
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { titleAr: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { organization: new RegExp(search, 'i') }
      ];
    }

    let list;
    try {
      list = await Opportunity.find(query).sort({ createdAt: -1 });
    } catch (e) {
      list = [...FALLBACK_OPPORTUNITIES];
      if (category && category !== 'all') {
        list = list.filter(o => o.category === category);
      }
      if (region && region !== 'all' && region !== 'Toutes les régions') {
        list = list.filter(o => o.region.includes(region) || o.region.includes('Toutes'));
      }
      if (search) {
        const s = search.toLowerCase();
        list = list.filter(o => o.title.toLowerCase().includes(s) || o.description.toLowerCase().includes(s));
      }
    }

    return res.json({
      success: true,
      count: list.length,
      opportunities: list
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOpportunityById = async (req, res) => {
  try {
    const { id } = req.params;
    let item;
    try {
      item = await Opportunity.findById(id);
    } catch (e) {
      item = FALLBACK_OPPORTUNITIES.find(o => o._id === id);
    }

    if (!item) {
      return res.status(404).json({ success: false, message: 'Offre introuvable.' });
    }
    return res.json({ success: true, opportunity: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createOpportunity = async (req, res) => {
  try {
    const opp = new Opportunity(req.body);
    await opp.save();
    return res.status(201).json({ success: true, opportunity: opp });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
