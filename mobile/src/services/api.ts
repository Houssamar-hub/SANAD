import axios from 'axios';
import { Platform } from 'react-native';

// EXPO_PUBLIC_API_URL overrides the default (e.g. http://192.168.x.x:5000/api for a physical phone).
// Otherwise: Android emulator uses 10.0.2.2, web/iOS use localhost.
const DEV_API_URL = process.env.EXPO_PUBLIC_API_URL || Platform.select({
  android: 'http://10.0.2.2:5000/api',
  default: 'http://localhost:5000/api'
});

export const apiClient = axios.create({
  baseURL: DEV_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Seed data fallbacks ensuring zero blank screens even if server is offline
export const FALLBACK_LEGAL_DOCS = [
  {
    _id: 'leg_1',
    title: 'Loi 103-13 : Lutte contre les violences faites aux femmes',
    titleAr: 'القانون 103-13 المتعلق بمحاربة العنف ضد النساء',
    category: 'droits_fondamentaux',
    lawNumber: 'Loi n° 103-13',
    articleNumber: 'Articles 1 à 17',
    simplifiedExplanation: 'Définit légalement les violences physiques, sexuelles, psychologiques et économiques. Prévoit l\'éloignement du conjoint violent et des mesures de protection immédiates.',
    simplifiedExplanationAr: 'يحدد القانون المفهوم القانوني للعنف الجسدي والجنسي والنفسي والاقتصادي، ويمنح القاضي حق إصدار أمر فوري بإبعاد الزوج المعتدي.',
    rightsConcerned: ['Intégrité physique', 'Sécurité du foyer', 'Éloignement de l\'agresseur'],
    possibleSteps: [
      { step: 1, title: 'Appeler le 19 ou 177', description: 'Intervention d\'urgence de la police ou gendarmerie.' },
      { step: 2, title: 'Constat médical', description: 'Obtenir un certificat avec ITT dans un hôpital public.' },
      { step: 3, title: 'Dépôt de plainte', description: 'Déposer plainte auprès du Procureur du Roi ou au commissariat.' }
    ],
    sourceUrl: 'https://adala.justice.gov.ma',
    sourceType: 'adala.justice.gov.ma'
  },
  {
    _id: 'leg_2',
    title: 'Cyberharcèlement et diffusion d\'images sans consentement',
    titleAr: 'التحرش الإلكتروني ونشر الصور والمحادثات بدون إذن',
    category: 'cyberharcelement',
    lawNumber: 'Code Pénal Marocain',
    articleNumber: 'Art. 447-1, 447-2, 447-3',
    simplifiedExplanation: 'Punit de 6 mois à 3 ans de prison toute diffusion ou enregistrement de photos/propos privés sans accord. Peine portée de 1 à 5 ans si commis par conjoint ou sur mineur.',
    simplifiedExplanationAr: 'يعاقب بالحبس من 6 أشهر إلى 3 سنوات كل من نشر أو سجل صوراً أو محادثات شخصية دون إذن، وترتفع إلى 5 سنوات للزوج أو الطليق.',
    rightsConcerned: ['Respect de la vie privée', 'Droit à l\'image', 'Protection contre le chantage'],
    possibleSteps: [
      { step: 1, title: 'Sauvegarder les preuves', description: 'Faire des captures d\'écran claires avec liens et numéros.' },
      { step: 2, title: 'Ne pas céder au chantage', description: 'Ne jamais payer ni négocier.' },
      { step: 3, title: 'Plainte cybercriminalité', description: 'Saisir la brigade de lutte contre les crimes informatiques.' }
    ],
    sourceUrl: 'https://adala.justice.gov.ma',
    sourceType: 'adala.justice.gov.ma'
  },
  {
    _id: 'leg_3',
    title: 'Harcèlement dans les espaces publics et transports',
    titleAr: 'التحرش في الفضاءات العمومية ووسائل النقل',
    category: 'harcelement',
    lawNumber: 'Code Pénal Marocain',
    articleNumber: 'Art. 503-1-1',
    simplifiedExplanation: 'Punit de 1 à 6 mois de prison et de 2 000 à 10 000 DH d\'amende toute personne qui importune autrui par des paroles, gestes ou messages à caractère sexuel.',
    simplifiedExplanationAr: 'يعاقب بالحبس من شهر إلى 6 أشهر وغرامة من 2000 إلى 10000 درهم كل من تحرش بالغير في الفضاءات العمومية.',
    rightsConcerned: ['Liberté d\'aller et venir', 'Dignité dans l\'espace public'],
    possibleSteps: [
      { step: 1, title: 'Alerter les témoins', description: 'Demander de l\'aide aux passants ou agents de sécurité.' },
      { step: 2, title: 'Signaler au 19', description: 'Contacter immédiatement la police avec la description.' }
    ],
    sourceUrl: 'https://adala.justice.gov.ma',
    sourceType: 'adala.justice.gov.ma'
  },
  {
    _id: 'leg_4',
    title: 'Code de la Famille (Moudawana) : Divorce pour discorde (Chiqaq)',
    titleAr: 'مدونة الأسرة : مسطرة الشقاق وحقوق الزوجة والأبناء',
    category: 'acces_justice',
    lawNumber: 'Loi n° 70-03 (Moudawana)',
    articleNumber: 'Art. 94 à 101',
    simplifiedExplanation: 'Permet à l\'épouse de demander la rupture du mariage sans avoir à justifier de violences préalables si la vie commune devient insupportable. Fixation de la pension et garde.',
    simplifiedExplanationAr: 'يتيح للزوجة طلب التطليق للشقاق دون الحاجة لإثبات الضرر، مع الحكم لها بالنفقة والحضانة ومستحقاتها.',
    rightsConcerned: ['Droit de recours', 'Pension alimentaire (Nafaqa)', 'Garde des enfants (Hadana)'],
    possibleSteps: [
      { step: 1, title: 'Dépôt de la demande', description: 'Au tribunal de première instance, section de la famille.' },
      { step: 2, title: 'Séance de conciliation', description: 'Tentative obligatoire devant le juge.' },
      { step: 3, title: 'Jugement sous 6 mois', description: 'Prononcé du divorce et liquidation des droits financiers.' }
    ],
    sourceUrl: 'https://adala.justice.gov.ma',
    sourceType: 'adala.justice.gov.ma'
  }
];

export const FALLBACK_CENTERS = [
  {
    _id: 'cent_1',
    name: 'Association Solidarité Féminine',
    nameAr: 'جمعية التضامن النسوي',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    address: 'Angle Bd Abdelmoumen et Rue Bachir Laalj',
    addressAr: 'شارع عبد المومن، الدار البيضاء',
    phone: '+212 5 22 86 28 65',
    services: ['Écoute psychologique', 'Accompagnement juridique', 'Aide mères'],
    coordinates: { latitude: 33.5731, longitude: -7.6298 },
    verified: true
  },
  {
    _id: 'cent_2',
    name: 'Association Démocratique des Femmes du Maroc (ADFM)',
    nameAr: 'الجمعية الديمقراطية لنساء المغرب',
    city: 'Rabat',
    cityAr: 'الرباط',
    address: '6, Rue Melilia, Hassan, Rabat',
    addressAr: '6، زنقة مليلية، حسان، الرباط',
    phone: '+212 5 37 73 71 65',
    services: ['Assistance juridique', 'Orientation tribunaux', 'Écoute'],
    coordinates: { latitude: 34.0209, longitude: -6.8416 },
    verified: true
  },
  {
    _id: 'cent_3',
    name: 'Centre Batha d\'Accueil et de Sécurité',
    nameAr: 'مركز البطحاء لإيواء النساء',
    city: 'Fès',
    cityAr: 'فاس',
    address: 'Place Batha, Médina de Fès',
    addressAr: 'ساحة البطحاء، فاس',
    phone: '+212 5 35 63 80 50',
    services: ['Hébergement d\'urgence 24/24', 'Aide juridique', 'Soins'],
    coordinates: { latitude: 34.0601, longitude: -4.9818 },
    verified: true
  },
  {
    _id: 'cent_4',
    name: 'Association Annakhil pour la Femme et l\'Enfant',
    nameAr: 'جمعية النخيل للمرأة والطفل',
    city: 'Marrakech',
    cityAr: 'مراكش',
    address: 'Avenue Yacoub El Mansour, Marrakech',
    addressAr: 'شارع يعقوب المنصور، مراكش',
    phone: '+212 5 24 43 65 20',
    services: ['Centre d\'écoute', 'Médiation familiale', 'Aide juridique'],
    coordinates: { latitude: 31.6295, longitude: -7.9811 },
    verified: true
  },
  {
    _id: 'cent_5',
    name: 'Union de l\'Action Féminine (UAF)',
    nameAr: 'اتحاد العمل النسائي',
    city: 'Tanger',
    cityAr: 'طنجة',
    address: 'Rue de Fès, Résidence Al Manar, Tanger',
    addressAr: 'شارع فاس، طنجة',
    phone: '+212 5 39 94 40 18',
    services: ['Écoute Najat', 'Assistance juridique', 'Refuges'],
    coordinates: { latitude: 35.7725, longitude: -5.8118 },
    verified: true
  }
];

export const FALLBACK_QUIZZES = [
  {
    _id: 'quiz_1',
    title: 'Mes Droits face au Harcèlement',
    titleAr: 'حقوقي ضد التحرش والابتزاز',
    questions: [
      {
        question: 'Le harcèlement verbal dans la rue est-il puni par la loi marocaine ?',
        questionAr: 'هل التحرش اللفظي في الشارع يعاقب عليه القانون المغربي ؟',
        options: [
          { text: 'Non, seules les agressions physiques sont punies.', textAr: 'لا، فقط الاعتداء الجسدي.' },
          { text: 'Oui, la loi 103-13 punit de 1 à 6 mois de prison et amende.', textAr: 'نعم، القانون 103-13 يعاقب بالحبس من شهر لـ 6 أشهر وغرامة.' },
          { text: 'Uniquement la nuit.', textAr: 'فقط بالليل.' }
        ],
        correctAnswerIndex: 1,
        explanation: 'L\'article 503-1-1 du Code Pénal sanctionne les propos, actes ou messages importuns à caractère sexuel.'
      },
      {
        question: 'Quel est le numéro direct et gratuit de la Police Secours en ville ?',
        questionAr: 'ما هو رقم الشرطة المجاني في المجال الحضري بالمغرب ؟',
        options: [
          { text: '177', textAr: '177' },
          { text: '19', textAr: '19' },
          { text: '15', textAr: '15' }
        ],
        correctAnswerIndex: 1,
        explanation: 'Le 19 est le numéro d\'urgence de la Police nationale en zone urbaine.'
      },
      {
        question: 'En cas de chantage numérique (menace de diffuser des photos intimes) :',
        questionAr: 'في حال التعرض لابتزاز بنشر صور خاصة عبر الإنترنت :',
        options: [
          { text: 'Payer discrètement ce qui est demandé.', textAr: 'دفع المبلغ المطلوب بسرعة.' },
          { text: 'Supprimer son compte et formater son téléphone.', textAr: 'مسح الهاتف والحساب.' },
          { text: 'Faire des captures d\'écran détaillées et saisir la brigade cybercriminalité.', textAr: 'أخذ لقطات شاشة للأدلة والتوجه لفرقة الجرائم الإلكترونية.' }
        ],
        correctAnswerIndex: 2,
        explanation: 'Ne jamais payer car le maître-chanteur recommencera. Conserver impérativement les captures d\'écran comme preuves.'
      }
    ]
  }
];
