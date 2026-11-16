/**
 * SANAD - Données officielles et vérifiées de référence
 * Conformité : Droit positif marocain, CNDH, Ministère de la Justice
 */

const legalDocuments = [
  {
    title: 'Loi 103-13 : Lutte contre les violences faites aux femmes',
    titleAr: 'القانون 103-13 المتعلق بمحاربة العنف ضد النساء',
    category: 'droits_fondamentaux',
    lawNumber: 'Loi n° 103-13',
    articleNumber: 'Articles 1 à 17',
    simplifiedExplanation: 'Cette loi pionnière adoptée en 2018 définit pour la première fois légalement les violences physiques, sexuelles, psychologiques et économiques. Elle durcit les peines en cas de lien conjugal ou familial et instaure des mesures de protection d\'urgence (interdiction d\'approcher la victime, éloignement du conjoint violent).',
    simplifiedExplanationAr: 'يحدد هذا القانون لأول مرة المفهوم القانوني للعنف الجسدي والجنسي والنفسي والاقتصادي، ويشدد العقوبات إذا كان مرتكب الفعل زوجاً أو أحد الأصول، كما يتيح تدابير حمائية عاجلة كإبعاد الزوج العنيف أو منعه من الاقتراب.',
    content: 'Promulguée par le Dahir n° 1-18-19 du 5 Joumada II 1439 (22 février 2018). Elle met en place des cellules spécialisées de prise en charge des femmes victimes de violences au niveau des tribunaux de première instance, des cours d\'appel, des services de police et de gendarmerie royale, ainsi que des commissions régionales et nationales.',
    contentAr: 'صدر بتنفيذه الظهير الشريف رقم 1.18.19، ويحدث خلايا للتكفل بالنساء ضحايا العنف على صعيد المحاكم الابتدائية والاستئناف ومصالح الأمن والدرك الملكي والمستشفيات العمومية.',
    rightsConcerned: ['Droit à l\'intégrité physique', 'Droit à la sécurité', 'Droit d\'éloignement de l\'agresseur', 'Accompagnement institutionnel'],
    possibleSteps: [
      {
        step: 1,
        title: 'Contacter les services d\'urgence',
        description: 'Appeler le 19 (Police urbaine) ou le 177 (Gendarmerie hors agglomération) pour une intervention immédiate.',
        titleAr: 'الاتصال بالطوارئ',
        descriptionAr: 'الاتصال بالرقم 19 (الشرطة) أو 177 (الدرك الملكي) للتدخل الفوري.'
      },
      {
        step: 2,
        title: 'Certificat médical',
        description: 'Faire constater les violences dans un hôpital public ou auprès d\'un médecin légiste pour obtenir un certificat mentionnant l\'Incapacité Temporaire Totale (ITT).',
        titleAr: 'شهادة طبية',
        descriptionAr: 'معاينة الإصابات بمستشفى عمومي أو طبيب للحصول على شهادة تحدد مدة العجز المؤقت.'
      },
      {
        step: 3,
        title: 'Dépôt de plainte',
        description: 'Déposer plainte auprès du Procureur du Roi ou au commissariat/brigade avec les preuves et le certificat.',
        titleAr: 'تقديم شكاية',
        descriptionAr: 'إيداع شكاية لدى النيابة العامة أو الدائرة الأمنية المختصة مصحوبة بوسائل الإثبات.'
      }
    ],
    sourceUrl: 'https://adala.justice.gov.ma/production/html/Fr/168924.htm',
    sourceType: 'adala.justice.gov.ma',
    publicationDate: '2018-02-22',
    status: 'verified'
  },
  {
    title: 'Cyberharcèlement et diffusion d\'images sans consentement',
    titleAr: 'التحرش الإلكتروني ونشر الصور والمحادثات بدون إذن',
    category: 'cyberharcelement',
    lawNumber: 'Code Pénal Marocain',
    articleNumber: 'Article 447-1, 447-2 et 447-3',
    simplifiedExplanation: 'Est puni de 6 mois à 3 ans de prison toute personne qui intercepte, enregistre, diffuse ou transmet des paroles ou des images d\'une personne dans un lieu privé sans son consentement. La peine est portée de 1 à 5 ans de prison si les faits sont commis par le conjoint, ex-conjoint, fiancé ou ascendant, ou sur un mineur.',
    simplifiedExplanationAr: 'يعاقب بالحبس من 6 أشهر إلى 3 سنوات كل من قام عمداً بتثبيت أو تسجيل أو بث أو توزيع أقوال أو معلومات أو صور لشخص دون موافقته. وترتفع العقوبة من سنة إلى 5 سنوات إذا ارتكب الفعل الزوج أو الطليق أو الخطيب أو ضد قاصر.',
    content: 'Introduits par la loi 103-13 complétant le Code pénal. L\'article 447-2 sanctionne également la diffusion de fausses allégations ou de faux faits dans le but de porter atteinte à la vie privée ou de diffamer. L\'article 447-3 aggrave les peines en cas de récidive ou de lien de parenté/mariage.',
    contentAr: 'المواد 447-1 و447-2 و447-3 من مجموعة القانون الجنائي المضافة بموجب القانون 103-13 تجرم انتهاك الحياة الخاصة عبر الأنظمة المعلوماتية والتشهير والابتزاز الإلكتروني.',
    rightsConcerned: ['Respect de la vie privée', 'Droit à l\'image', 'Protection contre le chantage numérique', 'Intégrité morale'],
    possibleSteps: [
      {
        step: 1,
        title: 'Ne rien supprimer et capturer les preuves',
        description: 'Effectuer des captures d\'écran complètes incluant la date, l\'heure, le profil, le numéro de téléphone et les liens URL exacts.',
        titleAr: 'حفظ الأدلة فوراً',
        descriptionAr: 'أخذ لقطات شاشة واضحة للمحادثات أو الصور أو المنشورات مع إظهار التاريخ ورابط الحساب ورقم الهاتف.'
      },
      {
        step: 2,
        title: 'Ne pas céder au chantage',
        description: 'Ne jamais verser d\'argent ni envoyer de photos supplémentaires. Bloquer l\'accès après avoir sauvegardé les preuves.',
        titleAr: 'عدم الرضوخ للابتزاز',
        descriptionAr: 'عدم دفع أي مبلغ مالي أو إرسال أي محتوى إضافي، وحظر المبتز بعد تسجيل الأدلة.'
      },
      {
        step: 3,
        title: 'Saisir la brigade de lutte contre la cybercriminalité',
        description: 'Déposer plainte auprès du Procureur du Roi ou de la Brigade de lutte contre les crimes liés aux nouvelles technologies.',
        titleAr: 'التوجه لفرقة مكافحة الجريمة الإلكترونية',
        descriptionAr: 'تقديم شكاية إلى وكيل الملك أو إلى فرقة مكافحة الجرائم المعلوماتية بالأمن الوطني.'
      }
    ],
    sourceUrl: 'https://adala.justice.gov.ma/production/html/Fr/168924.htm',
    sourceType: 'adala.justice.gov.ma',
    publicationDate: '2018-09-12',
    status: 'verified'
  },
  {
    title: 'Harcèlement dans les espaces publics et au travail',
    titleAr: 'التحرش في الفضاءات العمومية وأماكن العمل',
    category: 'harcelement',
    lawNumber: 'Code Pénal & Code du Travail',
    articleNumber: 'Article 503-1-1 du Code Pénal',
    simplifiedExplanation: 'Le harcèlement sexuel dans les espaces publics (rue, transports, gares) est puni de 1 à 6 mois d\'emprisonnement et d\'une amende de 2 000 à 10 000 DH pour quiconque importune autrui par des actes, des gestes ou des écrits à connotation sexuelle, ou par l\'envoi de messages écrits, audio ou vidéo.',
    simplifiedExplanationAr: 'يعاقب بالحبس من شهر إلى 6 أشهر وغرامة من 2000 إلى 10000 درهم كل من أمعن في مضايقة الغير في الفضاءات العمومية أو غيرها بأفعال أو أقوال أو إشارات ذات طبيعة جنسية أو بواسطة رسائل مكتوبة أو هاتفية أو إلكترونية.',
    content: 'L\'article 503-1 du Code pénal punit l\'abus d\'autorité dans le cadre du travail pour obtenir des faveurs de nature sexuelle (1 à 2 ans d\'emprisonnement). Le Code du travail (Loi 65-99) qualifie également le harcèlement de faute grave justifiant le licenciement sans préavis ni indemnité de l\'auteur.',
    contentAr: 'المادة 503-1 تعاقب بالحبس من سنة إلى سنتين من استغل سلطته في العمل للتحرش، ومدونة الشغل تعتبر التحرش خطأ جسيماً يبرر الفصل الفوري.',
    rightsConcerned: ['Liberté de circulation', 'Droit à un espace public sécurisé', 'Droit à un environnement de travail digne'],
    possibleSteps: [
      {
        step: 1,
        title: 'Interpellation immédiate si possible',
        description: 'Alerter les agents de sécurité ou les passants, noter la description de l\'agresseur ou la plaque d\'immatriculation.',
        titleAr: 'طلب النجدة أو المساعدة',
        descriptionAr: 'تنبيه الحاضرين أو عناصر الأمن المتواجدين في المكان وتدوين مواصفات المعتدي.'
      },
      {
        step: 2,
        title: 'Signalement auprès des autorités',
        description: 'Contacter le 19 ou se rendre au poste de police le plus proche pour déposer une déclaration d\'agression.',
        titleAr: 'التبليغ لدى الأمن',
        descriptionAr: 'التوجه إلى أقرب دائرة أمنية وتقديم البلاغ مع تقديم شهود الواقعة إن وجدوا.'
      }
    ],
    sourceUrl: 'https://adala.justice.gov.ma',
    sourceType: 'adala.justice.gov.ma',
    publicationDate: '2018-09-12',
    status: 'verified'
  },
  {
    title: 'Code de la Famille (Moudawana) : Divorce pour préjudice (Chiqaq)',
    titleAr: 'مدونة الأسرة : مسطرة الطلاق للشقاق وحقوق المرأة',
    category: 'acces_justice',
    lawNumber: 'Loi n° 70-03 (Moudawana)',
    articleNumber: 'Articles 94 à 101',
    simplifiedExplanation: 'Le divorce pour discorde (Chiqaq) peut être demandé par l\'épouse sans avoir à prouver une faute grave préalable. Le tribunal tente obligatoirement une conciliation. En cas d\'échec, le juge prononce le divorce et statue sur la pension alimentaire (Nafaqa), la garde des enfants (Hadana) et le dédommagement (Mout\'a).',
    simplifiedExplanationAr: 'يمكن للزوجة طلب التطليق للشقاق دون الحاجة لإثبات الضرر المادي المسبق. تحاول المحكمة إجراء الصلح، وعند تعذره تحكم بالتطليق وتحدد مستحقات الزوجة ونفقة وحضانة الأبناء.',
    content: 'Promulguée par le Dahir 1-04-22 du 3 février 2004. Les articles 94 à 101 garantissent aux femmes le droit d\'engager la procédure. L\'assistance judiciaire gratuite peut être accordée si les ressources sont insuffisantes (Dahir 1-66-805).',
    contentAr: 'المواد 94 إلى 101 من مدونة الأسرة تضمن حق المرأة في رفع دعوى الشقاق وتحديد مستحقاتها والحصول على المساعدة القضائية عند الحاجة.',
    rightsConcerned: ['Droit de mettre fin à une union destructrice', 'Droit à la pension alimentaire (Nafaqa)', 'Droit de garde (Hadana)', 'Droit au logement pour la mère ayant la garde'],
    possibleSteps: [
      {
        step: 1,
        title: 'Dépôt de la requête',
        description: 'Déposer une requête écrite auprès de la section de la justice de la famille du tribunal de première instance compétent.',
        titleAr: 'إيداع مقال افتتاحي',
        descriptionAr: 'تقديم مقال افتتاحي لدى قسم قضاء الأسرة بالمحكمة الابتدائية المختصة.'
      },
      {
        step: 2,
        title: 'Séance de conciliation',
        description: 'Assister à la séance de réconciliation obligatoire devant le juge de la famille.',
        titleAr: 'جلسة الصلح',
        descriptionAr: 'حضور جلسة الصلح التي يجريها قاضي الأسرة بحضور الطرفين.'
      },
      {
        step: 3,
        title: 'Jugement et fixation des droits',
        description: 'En cas de désaccord persistant, le jugement est rendu fixant les indemnités et la garde dans un délai maximum de 6 mois.',
        titleAr: 'صدور الحكم وتحديد المستحقات',
        descriptionAr: 'في حال تعذر الصلح، تصدر المحكمة حكمها بتطليق الطرفين وتحديد كافة المستحقات.'
      }
    ],
    sourceUrl: 'https://adala.justice.gov.ma/production/html/Fr/168924.htm',
    sourceType: 'adala.justice.gov.ma',
    publicationDate: '2004-02-05',
    status: 'verified'
  },
  {
    title: 'Violence économique et privation de ressources',
    titleAr: 'العنف الاقتصادي والحرمان من الموارد الأساسية',
    category: 'violence_economique',
    lawNumber: 'Loi 103-13 & Code Pénal',
    articleNumber: 'Art. 1 de la loi 103-13 et Art. 480 Code Pénal',
    simplifiedExplanation: 'La loi 103-13 criminalise la violence économique, définie comme tout acte portant atteinte aux droits financiers de la femme, la privation volontaire de biens essentiels, le refus de payer la pension alimentaire, ou la spoliation de son salaire.',
    simplifiedExplanationAr: 'يعرف القانون العنف الاقتصادي بكل فعل يضر بالحقوق المالية للمرأة، كالحرمان المتعمد من النفقة أو الاستيلاء على دخلها أو ممتلكاتها بدون وجه حق.',
    content: 'L\'abandon de famille et le refus délibéré de verser la pension alimentaire ordonnée par décision de justice pendant plus d\'un mois est passible d\'un emprisonnement de trois mois à un an et d\'une amende (Art. 480 du Code pénal).',
    contentAr: 'إهمال الأسرة والامتناع عن أداء النفقة المحكوم بها قضائياً لأكثر من شهر يعاقب عليه بالحبس من 3 أشهر إلى سنة وغرامة مالية (الفصل 480 من القانون الجنائي).',
    rightsConcerned: ['Droit à l\'autonomie financière', 'Droit à la pension alimentaire', 'Protection contre la spoliation'],
    possibleSteps: [
      {
        step: 1,
        title: 'Mise en demeure ou sommation d\'huissier',
        description: 'Faire signifier le jugement de pension alimentaire par un huissier de justice.',
        titleAr: 'التبليغ والتنفيذ',
        descriptionAr: 'تبليغ حكم النفقة للطرف المحكوم عليه بواسطة مفوض قضائي.'
      },
      {
        step: 2,
        title: 'Dépôt de plainte pour abandon de famille',
        description: 'Si le non-paiement dépasse 30 jours après mise en demeure, déposer plainte auprès du Procureur du Roi pour abandon de famille.',
        titleAr: 'شكاية إهمال الأسرة',
        descriptionAr: 'في حال استمرار الامتناع عن الأداء لأكثر من 30 يوماً، تقديم شكاية بإهمال الأسرة لدى النيابة العامة.'
      }
    ],
    sourceUrl: 'https://adala.justice.gov.ma',
    sourceType: 'adala.justice.gov.ma',
    publicationDate: '2018-09-12',
    status: 'verified'
  }
];

const supportCenters = [
  {
    name: 'Association Solidarité Féminine (Casablanca)',
    nameAr: 'جمعية التضامن النسوي (الدار البيضاء)',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    address: 'Angle Boulevard Abdelmoumen et Rue Bachir Laalj, Casablanca',
    addressAr: 'ملتقى شارع عبد المومن وزنقة بشير العلج، الدار البيضاء',
    phone: '+212 5 22 86 28 65',
    emergencyPhone: '+212 6 61 40 25 10',
    services: ['Écoute et soutien psychologique', 'Accompagnement juridique', 'Aide aux mères célibataires', 'Formation professionnelle'],
    languages: ['ar', 'darija', 'fr'],
    coordinates: { latitude: 33.5731, longitude: -7.6298 },
    openingHours: 'Lundi - Vendredi: 08:30 - 16:30',
    sourceUrl: 'https://solidarite-feminine.org',
    verified: true
  },
  {
    name: 'Association Tahadi pour l\'Égalité et la Citoyenneté (ATEC - Casablanca)',
    nameAr: 'جمعية التحدي للمساواة والمواطنة (الدار البيضاء)',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    address: 'Quartier Derb Ghallef, Rue 12, N° 45, Casablanca',
    addressAr: 'حي درب غلف، زنقة 12، رقم 45، الدار البيضاء',
    phone: '+212 5 22 23 88 10',
    emergencyPhone: '+212 6 63 70 85 41',
    services: ['Accompagnement juridique', 'Cellule anti-cyberharcèlement', 'Écoute psychologique', 'Assistance sociale'],
    languages: ['ar', 'darija', 'fr'],
    coordinates: { latitude: 33.5684, longitude: -7.6351 },
    openingHours: 'Lundi - Vendredi: 09:00 - 17:00',
    sourceUrl: 'https://atec.ma',
    verified: true
  },
  {
    name: 'Association Démocratique des Femmes du Maroc (ADFM - Rabat)',
    nameAr: 'الجمعية الديمقراطية لنساء المغرب (الرباط)',
    city: 'Rabat',
    cityAr: 'الرباط',
    address: '6, Rue Melilia, Hassan, Rabat',
    addressAr: '6، زنقة مليلية، حسان، الرباط',
    phone: '+212 5 37 73 71 65',
    emergencyPhone: '+212 6 61 35 12 80',
    services: ['Assistance juridique', 'Plaidoyer', 'Orientation vers les tribunaux', 'Écoute'],
    languages: ['ar', 'darija', 'fr', 'amazigh'],
    coordinates: { latitude: 34.0209, longitude: -6.8416 },
    openingHours: 'Lundi - Vendredi: 09:00 - 16:30',
    sourceUrl: 'https://adfm.ma',
    verified: true
  },
  {
    name: 'Centre Batha d\'Accueil et de Prise en Charge (Fès)',
    nameAr: 'مركز البطحاء لإيواء النساء ضحايا العنف (فاس)',
    city: 'Fès',
    cityAr: 'فاس',
    address: 'Place Batha, Médina de Fès',
    addressAr: 'ساحة البطحاء، المدينة العتيقة، فاس',
    phone: '+212 5 35 63 80 50',
    emergencyPhone: '+212 6 62 14 30 22',
    services: ['Hébergement d\'urgence sécurisé', 'Accompagnement juridique', 'Soutien psychologique', 'Soins médicaux'],
    languages: ['ar', 'darija', 'fr'],
    coordinates: { latitude: 34.0601, longitude: -4.9818 },
    openingHours: 'Accueil 24h/24 pour l\'urgence',
    sourceUrl: 'https://batha-centre.ma',
    verified: true
  },
  {
    name: 'Association Annakhil pour la Femme et l\'Enfant (Marrakech)',
    nameAr: 'جمعية النخيل للمرأة والطفل (مراكش)',
    city: 'Marrakech',
    cityAr: 'مراكش',
    address: 'Avenue Yacoub El Mansour, Résidence Al Andalous, Marrakech',
    addressAr: 'شارع يعقوب المنصور، إقامة الأندلس، مراكش',
    phone: '+212 5 24 43 65 20',
    emergencyPhone: '+212 6 64 22 18 90',
    services: ['Centre d\'écoute', 'Médiation familiale', 'Aide juridique devant la justice', 'Assistance sociale'],
    languages: ['ar', 'darija', 'fr', 'amazigh'],
    coordinates: { latitude: 31.6295, longitude: -7.9811 },
    openingHours: 'Lundi - Vendredi: 08:30 - 16:30',
    sourceUrl: 'https://annakhil.org',
    verified: true
  },
  {
    name: 'Union de l\'Action Féminine - UAF (Tanger)',
    nameAr: 'اتحاد العمل النسائي (طنجة)',
    city: 'Tanger',
    cityAr: 'طنجة',
    address: 'Rue de Fès, Résidence Al Manar, Tanger',
    addressAr: 'شارع فاس، إقامة المنار، طنجة',
    phone: '+212 5 39 94 40 18',
    emergencyPhone: '+212 6 61 78 50 12',
    services: ['Centre d\'écoute Najat', 'Assistance juridique', 'Orientation vers les refuges', 'Sensibilisation'],
    languages: ['ar', 'darija', 'fr'],
    coordinates: { latitude: 35.7725, longitude: -5.8118 },
    openingHours: 'Lundi - Vendredi: 09:00 - 17:00',
    sourceUrl: 'https://uaf.ma',
    verified: true
  },
  {
    name: 'Association Voix de Femmes Maroc (Agadir)',
    nameAr: 'جمعية صوت النساء المغرب (أكادير)',
    city: 'Agadir',
    cityAr: 'أكادير',
    address: 'Quartier Dakhla, Rue 2 Mars, Agadir',
    addressAr: 'حي الداخلة، زنقة 2 مارس، أكادير',
    phone: '+212 5 28 22 15 30',
    emergencyPhone: '+212 6 62 44 90 15',
    services: ['Écoute et orientation', 'Assistance juridique en Amazigh et Darija', 'Soutien aux femmes rurales'],
    languages: ['amazigh', 'darija', 'ar', 'fr'],
    coordinates: { latitude: 30.4278, longitude: -9.5981 },
    openingHours: 'Lundi - Vendredi: 08:30 - 16:30',
    sourceUrl: 'https://voixfemmes-agadir.org',
    verified: true
  },
  {
    name: 'Association Ain Ghazal 2000 (Oujda)',
    nameAr: 'جمعية عين غزال 2000 (وجدة)',
    city: 'Oujda',
    cityAr: 'وجدة',
    address: 'Boulevard Mohammed V, Immeuble Al Baraka, Oujda',
    addressAr: 'شارع محمد الخامس، عمارة البركة، وجدة',
    phone: '+212 5 36 68 12 40',
    emergencyPhone: '+212 6 61 90 22 11',
    services: ['Accompagnement juridique frontalier', 'Écoute psychologique', 'Médiation familiale'],
    languages: ['ar', 'darija', 'fr'],
    coordinates: { latitude: 34.6814, longitude: -1.9086 },
    openingHours: 'Lundi - Vendredi: 09:00 - 16:30',
    sourceUrl: 'https://ainghazal.ma',
    verified: true
  }
];

const quizzes = [
  {
    title: 'Mes Droits face au Harcèlement dans l\'Espace Public',
    titleAr: 'حقوقي ضد التحرش في الفضاء العام',
    description: 'Testez vos connaissances sur la loi 103-13 et les démarches pour se protéger.',
    descriptionAr: 'اختبري معلوماتك حول القانون 103-13 وطرق الحماية القانونية.',
    category: 'harcelement_rue',
    questions: [
      {
        question: 'Le harcèlement verbal ou les remarques insistantes dans la rue sont-ils punis par la loi marocaine ?',
        questionAr: 'هل التحرش اللفظي أو المضايقات المتكررة في الشارع يعاقب عليها القانون المغربي ؟',
        options: [
          { text: 'Non, seules les agressions physiques sont punies.', textAr: 'لا، فقط الاعتداء الجسدي هو المعاقب عليه.' },
          { text: 'Oui, la loi 103-13 punit le harcèlement de 1 à 6 mois de prison et d\'amende.', textAr: 'نعم، القانون 103-13 يعاقب على التحرش بالحبس من شهر إلى 6 أشهر وغرامة.' },
          { text: 'Uniquement si cela se passe la nuit.', textAr: 'فقط إذا وقع ذلك خلال الليل.' }
        ],
        correctAnswerIndex: 1,
        explanation: 'L\'article 503-1-1 du Code Pénal (introduit par la loi 103-13) sanctionne les propos, actes ou messages importuns à connotation sexuelle de 1 à 6 mois d\'emprisonnement et 2 000 à 10 000 DH d\'amende.',
        explanationAr: 'الفصل 503-1-1 من القانون الجنائي يعاقب على التحرش بالحبس من شهر إلى 6 أشهر وغرامة من 2000 إلى 10000 درهم.',
        legalReference: 'Art. 503-1-1 du Code Pénal'
      },
      {
        question: 'Quel est le numéro d\'urgence de la Police en zone urbaine au Maroc ?',
        questionAr: 'ما هو الرقم الهاتفي المجاني للشرطة في المجال الحضري بالمغرب ؟',
        options: [
          { text: '177', textAr: '177' },
          { text: '19', textAr: '19' },
          { text: '15', textAr: '15' }
        ],
        correctAnswerIndex: 1,
        explanation: 'Le 19 est le numéro direct et gratuit de la Police nationale en zone urbaine. Le 177 est celui de la Gendarmerie Royale hors zone urbaine, et le 15 celui de la Protection Civile.',
        explanationAr: 'الرقم 19 مخصص للشرطة بالمجال الحضري، 177 للدرك الملكي، و15 للوقاية المدنية.',
        legalReference: 'Numéros d\'urgence officiels Royaume du Maroc'
      },
      {
        question: 'Si quelqu\'un diffuse une photo privée de vous sur les réseaux sociaux sans votre accord :',
        questionAr: 'إذا قام شخص بنشر صورة شخصية لك على شبكات التواصل دون موافقتك :',
        options: [
          { text: 'Ce n\'est pas illégal s\'il a pris la photo lui-même.', textAr: 'ليس فعلاً غير قانوني إذا كان هو من التقط الصورة.' },
          { text: 'C\'est un délit passible de 6 mois à 3 ans de prison selon l\'article 447-1.', textAr: 'يعتبر جنحة يعاقب عليها بالحبس من 6 أشهر إلى 3 سنوات وفق الفصل 447-1.' },
          { text: 'Il faut simplement signaler le compte sur le réseau social sans recours légal.', textAr: 'يجب فقط إبلاغ إدارة التطبيق ولا يوجد أي متابعة قضائية.' }
        ],
        correctAnswerIndex: 1,
        explanation: 'L\'article 447-1 du Code Pénal punit sévèrement la captation, la diffusion ou le partage de photos ou vidéos privées sans consentement préalable.',
        explanationAr: 'الفصل 447-1 من مجموعة القانون الجنائي يجرم نشر الصور أو المحادثات الخاصة دون موافقة مسبقة.',
        legalReference: 'Art. 447-1 du Code Pénal'
      },
      {
        question: 'Que doit-on faire en premier en cas de chantage numérique (menace de diffuser des photos intimes) ?',
        questionAr: 'ما هو التصرف الأول الضروري في حال التعرض للابتزاز الإلكتروني ؟',
        options: [
          { text: 'Payer la somme demandée pour éviter la diffusion.', textAr: 'دفع المبلغ المطلوب لتجنب النشر.' },
          { text: 'Supprimer toutes les conversations et formater son téléphone.', textAr: 'مسح المحادثات وتهيئة الهاتف فوراً.' },
          { text: 'Prendre des captures d\'écran détaillées (preuves) et refuser tout paiement.', textAr: 'أخذ لقطات شاشة للأدلة ورفض دفع أي مبلغ والتواصل مع الشرطة.' }
        ],
        correctAnswerIndex: 2,
        explanation: 'Ne jamais payer car le maître-chanteur demandera toujours plus. Sauvegarder impérativement les captures d\'écran avec dates et identifiants avant de saisir la cellule anti-cybercriminalité.',
        explanationAr: 'عدم دفع أي مبلغ أبداً وحفظ لقطات الشاشة كأدلة رسمية والتوجه لفرقة مكافحة الجريمة الإلكترونية.',
        legalReference: 'Guide CNDH de protection numérique'
      },
      {
        question: 'Existe-t-il des cellules d\'écoute et d\'accueil des femmes victimes de violences dans les tribunaux ?',
        questionAr: 'هل توجد خلايا خاصة بالتكفل بالنساء ضحايا العنف داخل المحاكم الابتدائية ؟',
        options: [
          { text: 'Oui, instituées par la loi 103-13 dans chaque tribunal de 1ère instance et cour d\'appel.', textAr: 'نعم، أحدثها القانون 103-13 في كل محكمة ابتدائية ومحكمة استئناف.' },
          { text: 'Non, les victimes doivent passer uniquement par les commissariats.', textAr: 'لا، الاستقبال مقتصر فقط على الدوائر الأمنية.' },
          { text: 'Seulement à Casablanca et Rabat.', textAr: 'فقط في الدار البيضاء والرباط.' }
        ],
        correctAnswerIndex: 0,
        explanation: 'La loi 103-13 a généralisé les cellules de prise en charge des femmes et enfants victimes de violences au sein de toutes les juridictions du Royaume.',
        explanationAr: 'القانون 103-13 فرض إحداث خلايا متخصصة في كافة محاكم المملكة لاستقبال وتوجيه النساء الضحايا.',
        legalReference: 'Loi 103-13, Art. 10'
      }
    ]
  }
];

const campaigns = [
  {
    title: 'Campagne CNDH : Ensemble contre les violences numériques',
    titleAr: 'حملة المجلس الوطني لحقوق الإنسان : معاً ضد العنف الرقمي',
    description: 'Le cyberharcèlement, la diffamation en ligne et le chantage aux photos sont des délits passibles de peines de prison fermes. Apprenez à sécuriser vos comptes et à faire valoir vos droits.',
    descriptionAr: 'التحرش الإلكتروني، التشهير، والابتزاز بالصور جرائم يعاقب عليها القانون بالحبس النافذ. تعرفي على سبل حماية حساباتك وحقوقك القانونية.',
    category: 'cndh_campagne',
    image: 'campaign_cyber.jpg',
    keyTakeaways: [
      'Vos messages et images intimes vous appartiennent.',
      'Le chantage est un crime : ne cédez jamais.',
      'Les brigades cybercriminalité marocaines traitent les plaintes avec discrétion.',
      'Conservez les preuves avant tout blocage.'
    ],
    actionTips: [
      'Activez l\'authentification à deux facteurs sur WhatsApp et Instagram.',
      'Ne partagez jamais vos mots de passe, même avec vos proches.',
      'Utilisez le coffre-fort SANAD pour sécuriser vos captures de preuves.',
      'En cas d\'urgence, appelez immédiatement le 19 ou le 177.'
    ],
    status: 'active'
  },
  {
    title: 'Campagne Universitaire : Pour des campus respectueux et sécurisés',
    titleAr: 'حملة جامعية : من أجل فضاءات جامعية آمنة وتحترم الجميع',
    description: 'Sensibilisation des étudiantes et des équipes pédagogiques sur la prévention du harcèlement en milieu universitaire et l\'accès aux cellules d\'écoute des facultés.',
    descriptionAr: 'توعية الطالبات والأطر التعليمية للوقاية من التحرش داخل الفضاء الجامعي والتعريف بخلايا الاستماع.',
    category: 'universite',
    image: 'campaign_univ.jpg',
    keyTakeaways: [
      'Chaque étudiante a droit à des études libres de toute pression.',
      'Le chantage aux notes ou examens constitue une faute grave et un délit pénal.',
      'Des canaux de signalement anonymes et sécurisés existent.'
    ],
    actionTips: [
      'Rapprochez-vous de la cellule d\'écoute de votre faculté.',
      'Conservez les e-mails et messages échangés.',
      'N\'hésitez pas à solliciter l\'assistance juridique gratuite de SANAD.'
    ],
    status: 'active'
  }
];

module.exports = {
  legalDocuments,
  supportCenters,
  quizzes,
  campaigns
};
