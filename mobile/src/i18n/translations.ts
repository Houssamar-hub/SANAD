export type Language = 'fr' | 'ar' | 'darija';

export const translations = {
  fr: {
    appName: 'SANAD',
    appArabicName: 'سند',
    tagline: 'Vous n\'êtes jamais seule.',
    secondaryTagline: 'Connaître ses droits, c\'est renforcer sa liberté.',
    signature: 'DROITS • PROTECTION • ACCOMPAGNEMENT',
    quickExit: 'Sortie Rapide',
    emergencySos: 'URGENCE SOS',
    emergencyConfirm: 'Voulez-vous composer le numéro d\'urgence ?',
    call: 'Appeler',
    cancel: 'Annuler',
    police: 'Police Secours (Zone urbaine)',
    gendarmerie: 'Gendarmerie Royale (Hors agglomération)',
    protectionCivile: 'Protection Civile (Ambulances / Pompiers)',
    tabs: {
      home: 'Accueil',
      legal: 'Mes Droits',
      assistant: 'Assistant IA',
      help: 'Aide & SOS'
    },
    home: {
      heroTitle: 'Vous n\'êtes jamais seule.',
      heroSubtitle: 'Comprenez vos droits, obtenez des réponses immédiates et trouvez les centres d\'accompagnement au Maroc.',
      quickActions: {
        understandRights: 'Comprendre mes droits',
        askQuestion: 'Poser une question IA',
        prevention: 'Prévention & Conseils',
        findCenter: 'Trouver un centre d\'aide'
      },
      didYouKnow: 'Le saviez-vous ?',
      didYouKnowText: 'La loi 103-13 permet au juge d\'ordonner l\'éloignement immédiat du conjoint violent du domicile conjugal pour protéger la femme et ses enfants.',
      campaignTitle: 'Campagne CNDH 2026',
      campaignDesc: 'Protection contre les violences numériques et le cyberharcèlement.',
      weeklyTip: 'Conseil de sécurité',
      weeklyTipText: 'En cas de menaces sur les réseaux, ne supprimez rien : faites des captures d\'écran incluant la date et le profil.',
      trustedContactsSection: 'Mes Contacts de Confiance',
      securityPlan: 'Mon Plan de Sécurité Personnel'
    },
    legal: {
      title: 'Bibliothèque Juridique',
      subtitle: 'Textes de loi marocains simplifiés et vérifiés',
      searchPlaceholder: 'Rechercher une loi, un article, un délit...',
      allCategories: 'Toutes les catégories',
      rightsConcerned: 'Droits protégés',
      stepsToTake: 'Démarches recommandées',
      officialSources: 'Sources officielles vérifiées',
      verifiedBy: 'Vérifié selon le droit marocain (CNDH & Ministère de la Justice)'
    },
    assistant: {
      title: 'SmartLegal AI SANAD',
      subtitle: 'Assistant juridique intelligent et confidentiel',
      welcome: 'Bonjour, je suis l\'assistant SANAD. Je peux vous aider à comprendre vos droits et vous orienter vers les ressources appropriées au Maroc. Posez-moi votre question en français, en arabe ou en Darija.',
      placeholder: 'Posez votre question en toute confidentialité...',
      send: 'Envoyer',
      suggestions: [
        'Quels sont mes droits face au harcèlement de rue ?',
        'Chno ndir ila chi wahed kayhaddedni b tsawer ?',
        'Comment demander la pension alimentaire (Nafaqa) ?',
        'Où trouver un centre d\'écoute à Casablanca ou Rabat ?'
      ],
      disclaimer: 'SANAD est un outil d\'information et de sensibilisation. Il ne se substitue pas à la consultation d\'un avocat inscrit au barreau.',
      emergencyDetected: 'ATTENTION : Situation de danger détectée. Si vous êtes menacée immédiatement, appelez le 19 ou le 177.',
      copy: 'Copier',
      helpful: 'Utile',
      notHelpful: 'Pas clair'
    },
    help: {
      title: 'Aide & Numéros d\'Urgence',
      subtitle: 'Assistance immédiate et centres d\'accueil au Maroc',
      emergencyTitle: 'Numéros d\'urgence nationaux gratuits',
      centersTitle: 'Centres d\'écoute et d\'hébergement',
      filterCity: 'Filtrer par ville',
      allCities: 'Toutes les villes',
      callCenter: 'Appeler le centre',
      viewLocation: 'Localiser',
      servicesOffered: 'Services proposés',
      verifiedCenter: 'Centre officiel vérifié'
    },
    quiz: {
      title: 'Quiz Éducatifs & Droits',
      subtitle: 'Testez vos connaissances et découvrez vos droits',
      question: 'Question',
      next: 'Question suivante',
      seeResults: 'Voir mon score',
      scoreTitle: 'Votre résultat',
      retry: 'Recommencer le quiz',
      explanationTitle: 'Explication juridique :'
    },
    safetyPlan: {
      title: 'Plan de Sécurité Personnel',
      subtitle: 'Mesures pratiques et discrètes pour vous protéger',
      step1: '1. Identifier un lieu de repli sûr (famille, amie, centre d\'hébergement)',
      step2: '2. Conserver une pochette avec documents essentiels (CIN, livret de famille, actes)',
      step3: '3. Enregistrer vos contacts de confiance dans SANAD',
      step4: '4. Connaître par cœur au moins un numéro d\'urgence (19 ou 177)'
    },
    settings: {
      title: 'Paramètres & Confidentialité',
      language: 'Langue de l\'application',
      about: 'À propos de SANAD',
      aboutText: 'SANAD (سند) est une initiative civique et technologique dédiée à l\'autonomisation juridique des femmes au Maroc, développée dans l\'esprit de la campagne nationale du CNDH.',
      clearData: 'Effacer mes données locales',
      guestMode: 'Mode invité actif (Aucune inscription obligatoire)'
    }
  },
  ar: {
    appName: 'سند',
    appArabicName: 'سند',
    tagline: 'لستِ وحدكِ أبداً.',
    secondaryTagline: 'معرفة الحقوق هي أساس الحرية والحماية.',
    signature: 'حقوق • حماية • مواكبة',
    quickExit: 'خروج سريع',
    emergencySos: 'طوارئ واستغاثة',
    emergencyConfirm: 'هل ترغبين في الاتصال برقم الطوارئ الآن ؟',
    call: 'اتصال',
    cancel: 'إلغاء',
    police: 'الشرطة (المجال الحضري)',
    gendarmerie: 'الدرك الملكي (خارج المدار الحضري)',
    protectionCivile: 'الوقاية المدنية (الإسعاف والمطافئ)',
    tabs: {
      home: 'الرئيسية',
      legal: 'حقوقي',
      assistant: 'المساعد الذكي',
      help: 'مساعدة وطوارئ'
    },
    home: {
      heroTitle: 'لستِ وحدكِ أبداً.',
      heroSubtitle: 'تعرفي على حقوقكِ، احصلي على إجابات قانونية فورية واكتشفي مراكز الاستماع والمواكبة في المغرب.',
      quickActions: {
        understandRights: 'فهم حقوقي القانونية',
        askQuestion: 'طرح سؤال على المساعد',
        prevention: 'الوقاية والنصائح',
        findCenter: 'البحث عن مركز استماع'
      },
      didYouKnow: 'هل تعلمين ؟',
      didYouKnowText: 'يمكّن القانون 103-13 القاضي من إصدار أمر حماية عاجل بإبعاد الزوج العنيف عن بيت الزوجية لحماية المرأة وأطفالها.',
      campaignTitle: 'حملة المجلس الوطني 2026',
      campaignDesc: 'الحماية من العنف الرقمي والتحرش عبر الإنترنت.',
      weeklyTip: 'نصيحة الأسبوع',
      weeklyTipText: 'في حال التعرض لتهديدات رقمية، لا تحذفي المحادثات: خذي لقطات شاشة تتضمن التاريخ ورابط الحساب.',
      trustedContactsSection: 'جهات الاتصال الموثوقة',
      securityPlan: 'خطتي الشخصية للأمان'
    },
    legal: {
      title: 'المكتبة القانونية',
      subtitle: 'نصوص القوانين المغربية مبسطة وموثوقة',
      searchPlaceholder: 'ابحثي عن قانون، فصل، أو موضوع...',
      allCategories: 'جميع الأقسام',
      rightsConcerned: 'الحقوق المضمونة',
      stepsToTake: 'الإجراءات والخطوات الموصى بها',
      officialSources: 'المصادر الرسمية المعتمدة',
      verifiedBy: 'تم التحقق وفقاً للتشريع المغربي (المجلس الوطني لحقوق الإنسان ووزارة العدل)'
    },
    assistant: {
      title: 'سند الذكي — المساعد القانوني',
      subtitle: 'مساعد ذكي وسري للإرشاد والتوجيه القانوني',
      welcome: 'مرحباً بكِ في سند. أنا مساعدكِ القانوني الذكي. يمكنني مساعدتك في فهم حقوقك وتوجيهك إلى سبل الحماية بالمغرب. يمكنك الكتابة بالعربية، بالدارجة، أو بالفرنسية.',
      placeholder: 'اكتبي سؤالكِ بسرية وأمان تام...',
      send: 'إرسال',
      suggestions: [
        'شنو هي حقوقي ضد التحرش في الشارع ؟',
        'شنو ندير إذا شي واحد كيهددني بالصور ؟',
        'كيفاش نطلب النفقة وحضانة الأبناء ؟',
        'فين نلقى مركز استماع ومساعدة في كازا أو الرباط ؟'
      ],
      disclaimer: 'تطبيق سند يقدم معلومات استرشادية وتوعوية ولا يحل محل استشارة محامٍ ممارس.',
      emergencyDetected: 'تنبيه : تم رصد حالة خطر عاجل. إذا كنتِ في خطر مباشر، اتصلي فوراً بالرقم 19 أو 177.',
      copy: 'نسخ',
      helpful: 'مفيد',
      notHelpful: 'غير واضح'
    },
    help: {
      title: 'أرقام الطوارئ والمراكز',
      subtitle: 'المساعدة الفورية ومراكز الاستماع والتكفل بالمغرب',
      emergencyTitle: 'أرقام الطوارئ الوطنية المجانية',
      centersTitle: 'مراكز الاستماع والإيواء القانوني',
      filterCity: 'تصفية حسب المدينة',
      allCities: 'كل المدن',
      callCenter: 'اتصال بالمركز',
      viewLocation: 'تحديد الموقع',
      servicesOffered: 'الخدمات المتوفرة',
      verifiedCenter: 'مركز رسمي معتمد'
    },
    quiz: {
      title: 'اختبارات توعوية تفاعلية',
      subtitle: 'اختبري معلوماتكِ واكتشفي حقوقكِ',
      question: 'السؤال',
      next: 'السؤال الموالي',
      seeResults: 'عرض النتيجة',
      scoreTitle: 'نتيجتكِ',
      retry: 'إعادة الاختبار',
      explanationTitle: 'التفسير القانوني :'
    },
    safetyPlan: {
      title: 'خطة الأمان والحماية الشخصية',
      subtitle: 'خطوات عملية واحترازية لحمايتكِ',
      step1: '1. تحديد مكان آمن للجوء إليه في حالات الطوارئ (عائلة، صديقة، أو مركز إيواء)',
      step2: '2. الاحتفاظ بملف الوثائق الرسمية المهمة (البطاقة الوطنية، الدفتر العائلي)',
      step3: '3. تسجيل أرقام جهات الاتصال الموثوقة في سند',
      step4: '4. حفظ أرقام الطوارئ الأساسية غيباً (19 و177)'
    },
    settings: {
      title: 'الإعدادات والخصوصية',
      language: 'لغة التطبيق',
      about: 'حول سند',
      aboutText: 'سند منصة رقمية مخصصة للتمكين القانوني وحماية النساء والفتيات بالمغرب، مستلهمة من أهداف الحملة الوطنية للمجلس الوطني لحقوق الإنسان.',
      clearData: 'مسح البيانات المخزنة محلياً',
      guestMode: 'وضع الضيف مفعل (استخدام مباشر بدون تسجيل)'
    }
  },
  darija: {
    appName: 'سند',
    appArabicName: 'سند',
    tagline: 'عمرك ما غادي تبقاي بوحدك.',
    secondaryTagline: 'ملي كتعرفي حقوقك، كتزيدي فقوتك وحريتك.',
    signature: 'حقوق • حماية • مواكبة',
    quickExit: 'خروج دغيا',
    emergencySos: 'طوارئ واستغاثة',
    emergencyConfirm: 'واش بغيتي تصوني لرقم الطوارئ دابا ؟',
    call: 'اتصال دابا',
    cancel: 'إلغاء',
    police: 'البوليس (داخل المدينة)',
    gendarmerie: 'الجوندارم (برا المدينة)',
    protectionCivile: 'الوقاية المدنية (الإسعاف)',
    tabs: {
      home: 'الرئيسية',
      legal: 'حقوقي',
      assistant: 'المساعد الذكي',
      help: 'مساعدة وطوارئ'
    },
    home: {
      heroTitle: 'عمرك ما غادي تبقاي بوحدك.',
      heroSubtitle: 'فهمي حقوقك، لقاي أجوبة دغيا وعقلي على الجمعيات ومراكز العون فالمغرب.',
      quickActions: {
        understandRights: 'نفهم حقوقي',
        askQuestion: 'نسول المساعد الذكي',
        prevention: 'نصائح وقاية',
        findCenter: 'نلقى مركز قريب ليا'
      },
      didYouKnow: 'واش فراسك ؟',
      didYouKnowText: 'القانون 103-13 كيعطي الحق للقاضي يجري على الراجل العنيف من الدار باش يحمي المرة ووليداتها.',
      campaignTitle: 'حملة CNDH 2026',
      campaignDesc: 'الحماية من التحرش والابتزاز فالسوشيال ميديا.',
      weeklyTip: 'نصيحة الأمان',
      weeklyTipText: 'إلا شي واحد هددك فأنستغرام ولا واتساب، ما تمسحي والو: ديري كابتور إكرون فيها التاريخ والسمية.',
      trustedContactsSection: 'الناس لي كانثيق فيهم',
      securityPlan: 'خطة الأمان ديالي'
    },
    legal: {
      title: 'مكتبة الحقوق',
      subtitle: 'القوانين المغربية مشروحة بطريقة ساهلة ومضمونة',
      searchPlaceholder: 'قلبي على قانون، مشكل، أو حق...',
      allCategories: 'كاع الأقسام',
      rightsConcerned: 'الحقوق لي كيحميك القانون بيها',
      stepsToTake: 'شنو خاصك ديري خطوة بخطوة',
      officialSources: 'المراجع القانونية الرسمية',
      verifiedBy: 'موثق على حساب القانون المغربي'
    },
    assistant: {
      title: 'سند الذكي',
      subtitle: 'مساعد ذكي وسري كيجاوبك بالدارجة وبالعربية',
      welcome: 'مرحباً بيك فسند. أنا المساعد ديالك باش تفهمي حقوقك وشنو ديري. سولي فاش ما بغيتي، كلشي كيبقى سري.',
      placeholder: 'كتبي سؤالك هنا بأمان...',
      send: 'صيفط',
      suggestions: [
        'شنو ندير إلا شي واحد كيهددني بالصور ؟',
        'واش عندي الحق نشكي إلا تحرش بيا شي واحد فالخدمة ؟',
        'كيفاش نطلب النفقة والحضانة ؟',
        'بغيت جمعية كتعاون العيالات فكازا ولا الرباط'
      ],
      disclaimer: 'سند كيعطيك معلومات باش تفهمي وتعرفي، ولكن ماشي بلاصة المحامي.',
      emergencyDetected: 'ردي البال : إلا كنتي فخطر دابا، صوني ل 19 ولا 177 فوراً.',
      copy: 'نسخ',
      helpful: 'مفيد',
      notHelpful: 'ما واضحش'
    },
    help: {
      title: 'طوارئ ومراكز المعاونة',
      subtitle: 'نمر مستعجلة ومراكز الاستماع فالمغرب',
      emergencyTitle: 'نمر الطوارئ فابور 24/24',
      centersTitle: 'مراكز الاستماع والإيواء',
      filterCity: 'اختاري المدينة',
      allCities: 'كاع المدن',
      callCenter: 'اتصال بالمركز',
      viewLocation: 'شوفي البلاصة',
      servicesOffered: 'الخدمات لي كيقدمو',
      verifiedCenter: 'مركز موثق'
    },
    quiz: {
      title: 'كويز تفاعلي',
      subtitle: 'جربي معلوماتك وتعرفي على حقوقك بطريقة ساهلة',
      question: 'السؤال',
      next: 'السؤال الموالي',
      seeResults: 'شوفي النقطة',
      scoreTitle: 'النتيجة ديالك',
      retry: 'عاودي الكويز',
      explanationTitle: 'الشرح القانوني :'
    },
    safetyPlan: {
      title: 'خطة الأمان الشخصية',
      subtitle: 'حوايج مهمين تعقلي عليهم باش تحمي راسك',
      step1: '1. شوفي بلاصة أمان لي تقدري تمشي ليها إلا وقع مشكل',
      step2: '2. خلي وراقك المهمة فبوشيطة قريبة ليك (لاكارط، الحالة المدنية)',
      step3: '3. قيدي نمر الناس لي كتيقي فيهم فسند',
      step4: '4. حفظي النمر ديال البوليس (19) والجوندارم (177)'
    },
    settings: {
      title: 'الإعدادات والسرية',
      language: 'لغة التطبيق',
      about: 'على سند',
      aboutText: 'سند تطبيق مغربي كيعاون العيالات والبنات باش يعرفو حقوقهم ويحميو راسهم.',
      clearData: 'مسح المعلومات',
      guestMode: 'خدامة كضيفة (بلا تسجيل)'
    }
  }
};
