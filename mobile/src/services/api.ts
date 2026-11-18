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

export const MOROCCAN_REGIONS = [
  'Toutes les régions',
  'Tanger-Tétouan-Al Hoceïma',
  'L\'Oriental',
  'Fès-Meknès',
  'Rabat-Salé-Kénitra',
  'Béni Mellal-Khénifra',
  'Casablanca-Settat',
  'Marrakech-Safi',
  'Drâa-Tafilalet',
  'Souss-Massa',
  'Guelmim-Oued Noun',
  'Laâyoune-Sakia El Hamra',
  'Dakhla-Oued Ed-Dahab'
];

export const FALLBACK_CENTERS = [
  // 1. Casablanca-Settat
  {
    _id: 'cent_1',
    name: 'Association Solidarité Féminine (ASF)',
    nameAr: 'جمعية التضامن النسوي',
    region: 'Casablanca-Settat',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    type: 'association',
    category: 'autonomisation',
    address: 'Angle Bd Abdelmoumen et Rue Bachir Laalj',
    addressAr: 'ملتقى شارع عبد المومن زنقة بشير العلج، الدار البيضاء',
    phone: '+212 5 22 86 28 65',
    email: 'contact@solidarite-feminine.org',
    website: 'https://solidarite-feminine.org',
    services: ['Écoute psychologique', 'Accompagnement juridique', 'Aide mères'],
    coordinates: { latitude: 33.5731, longitude: -7.6298 },
    verified: true,
    sourceName: 'Site officiel / CNDH'
  },
  {
    _id: 'cent_2',
    name: 'Association Tahadi pour l\'Égalité (ATEC)',
    nameAr: 'جمعية التحدي للمساواة والمواطنة',
    region: 'Casablanca-Settat',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    type: 'association',
    category: 'cyberharcelement',
    address: 'Quartier Derb Ghallef, Rue 12, N° 45',
    addressAr: 'حي درب غلف، زنقة 12، رقم 45، الدار البيضاء',
    phone: '+212 5 22 23 88 10',
    email: 'atec.maroc@gmail.com',
    website: 'https://atec.ma',
    services: ['Cellule cyberharcèlement', 'Assistance juridique', 'Écoute'],
    coordinates: { latitude: 33.5684, longitude: -7.6351 },
    verified: true,
    sourceName: 'Site officiel ATEC'
  },
  // 2. Rabat-Salé-Kénitra
  {
    _id: 'cent_3',
    name: 'Association Démocratique des Femmes du Maroc (ADFM)',
    nameAr: 'الجمعية الديمقراطية لنساء المغرب',
    region: 'Rabat-Salé-Kénitra',
    city: 'Rabat',
    cityAr: 'الرباط',
    type: 'association',
    category: 'droits_femmes',
    address: '6, Rue Melilia, Hassan, Rabat',
    addressAr: '6، زنقة مليلية، حسان، الرباط',
    phone: '+212 5 37 73 71 65',
    email: 'contact@adfm.ma',
    website: 'https://adfm.ma',
    services: ['Assistance juridique', 'Orientation tribunaux', 'Écoute'],
    coordinates: { latitude: 34.0209, longitude: -6.8416 },
    verified: true,
    sourceName: 'Portail ADFM'
  },
  {
    _id: 'cent_4',
    name: 'Cellule Prise en Charge Femmes - Tribunal Rabat',
    nameAr: 'خلية التكفل بالنساء ضحايا العنف - المحكمة الابتدائية بالرباط',
    region: 'Rabat-Salé-Kénitra',
    city: 'Rabat',
    cityAr: 'الرباط',
    type: 'institution',
    category: 'assistance_juridique',
    address: 'Palais de Justice, Avenue Mehdi Ben Barka, Rabat',
    addressAr: 'قصر العدالة، شارع المهدي بن بركة، الرباط',
    phone: '+212 5 37 71 33 00',
    services: ['Enregistrement des plaintes', 'Ordonnance de protection', 'Assistance judiciaire d\'office'],
    coordinates: { latitude: 34.0041, longitude: -6.8475 },
    verified: true,
    sourceName: 'Ministère de la Justice / Loi 103-13'
  },
  // 3. Tanger-Tétouan-Al Hoceïma
  {
    _id: 'cent_5',
    name: 'Union de l\'Action Féminine (UAF Tanger)',
    nameAr: 'اتحاد العمل النسائي - مركز النجدة (طنجة)',
    region: 'Tanger-Tétouan-Al Hoceïma',
    city: 'Tanger',
    cityAr: 'طنجة',
    type: 'association',
    category: 'lutte_violence',
    address: 'Rue de Fès, Résidence Al Manar, Tanger',
    addressAr: 'شارع فاس، إقامة المنار، طنجة',
    phone: '+212 5 39 94 40 18',
    email: 'uaf.tanger@gmail.com',
    services: ['Centre d\'écoute', 'Assistance juridique', 'Refuges transitoires'],
    coordinates: { latitude: 35.7725, longitude: -5.8118 },
    verified: true,
    sourceName: 'Réseau National UAF'
  },
  // 4. Fès-Meknès
  {
    _id: 'cent_6',
    name: 'Centre Batha d\'Accueil et de Sécurité (IPDF Fès)',
    nameAr: 'مركز البطحاء لإيواء النساء ضحايا العنف (فاس)',
    region: 'Fès-Meknès',
    city: 'Fès',
    cityAr: 'فاس',
    type: 'association',
    category: 'hebergement',
    address: 'Place Batha, Médina de Fès',
    addressAr: 'ساحة البطحاء، فاس المدينة',
    phone: '+212 5 35 63 80 50',
    email: 'ipdf.maroc@gmail.com',
    services: ['Hébergement d\'urgence 24/24', 'Assistance juridique', 'Soins médicaux'],
    coordinates: { latitude: 34.0601, longitude: -4.9818 },
    verified: true,
    sourceName: 'Plateforme IPDF / Entraide Nationale'
  },
  // 5. Marrakech-Safi
  {
    _id: 'cent_7',
    name: 'Association Annakhil pour la Femme et l\'Enfant',
    nameAr: 'جمعية النخيل للمرأة والطفل (مراكش)',
    region: 'Marrakech-Safi',
    city: 'Marrakech',
    cityAr: 'مراكش',
    type: 'association',
    category: 'droits_femmes',
    address: 'Avenue Yacoub El Mansour, Guéliz, Marrakech',
    addressAr: 'شارع يعقوب المنصور، جيليز، مراكش',
    phone: '+212 5 24 43 65 20',
    email: 'annakhil.marrakech@gmail.com',
    website: 'https://association-annakhil.org',
    services: ['Centre d\'écoute Najat', 'Médiation familiale', 'Aide juridique'],
    coordinates: { latitude: 31.6295, longitude: -7.9811 },
    verified: true,
    sourceName: 'Portail Association Annakhil'
  },
  // 6. Souss-Massa
  {
    _id: 'cent_8',
    name: 'Association Voix de Femmes Marocaines (Agadir)',
    nameAr: 'جمعية صوت النساء المغربيات (أكادير)',
    region: 'Souss-Massa',
    city: 'Agadir',
    cityAr: 'أكادير',
    type: 'association',
    category: 'lutte_violence',
    address: 'Avenue Hassan II, Immeuble Iguider, Agadir',
    addressAr: 'شارع الحسن الثاني، عمارة إكيدر، أكادير',
    phone: '+212 5 28 84 55 12',
    email: 'voixdefemmes.agadir@gmail.com',
    services: ['Écoute en Amazigh et Darija', 'Accompagnement judiciaire', 'Aide sociale'],
    coordinates: { latitude: 30.4278, longitude: -9.5981 },
    verified: true,
    sourceName: 'Réseau Anaruz / CNDH Souss'
  },
  // 7. L'Oriental
  {
    _id: 'cent_9',
    name: 'Association Ain Ghazal 2000 (Oujda)',
    nameAr: 'جمعية عين غزال 2000 (وجدة)',
    region: 'L\'Oriental',
    city: 'Oujda',
    cityAr: 'وجدة',
    type: 'association',
    category: 'droits_femmes',
    address: 'Rue Ibn Khaldoun, Quartier Al Wahda, Oujda',
    addressAr: 'زنقة ابن خلدون، حي الوحدة، وجدة',
    phone: '+212 5 36 68 04 22',
    email: 'ainghazal2000@gmail.com',
    services: ['Centre d\'écoute', 'Assistance juridique frontalière', 'Médiation'],
    coordinates: { latitude: 34.6814, longitude: -1.9086 },
    verified: true,
    sourceName: 'CNDH Région de l\'Oriental'
  },
  // 8. Béni Mellal-Khénifra
  {
    _id: 'cent_10',
    name: 'Association Femmes et Avenir pour le Développement (Béni Mellal)',
    nameAr: 'جمعية نساء والمستقبل للتنمية (بني ملال)',
    region: 'Béni Mellal-Khénifra',
    city: 'Béni Mellal',
    cityAr: 'بني ملال',
    type: 'association',
    category: 'autonomisation',
    address: 'Boulevard Mohamed V, Résidence Atlas, Béni Mellal',
    addressAr: 'شارع محمد الخامس، إقامة الأطلس، بني ملال',
    phone: '+212 5 23 48 30 15',
    email: 'afad.benimellal@gmail.com',
    services: ['Écoute pour femmes en montagne', 'Orientation juridique', 'Soutien mères célibataires'],
    coordinates: { latitude: 32.3394, longitude: -6.3608 },
    verified: true,
    sourceName: 'Annuaire CNDH Béni Mellal'
  },
  // 9. Drâa-Tafilalet
  {
    _id: 'cent_11',
    name: 'Association Féminine pour la Solidarité et le Développement (Errachidia)',
    nameAr: 'الجمعية النسائية للتضامن والتنمية (الرشيدية)',
    region: 'Drâa-Tafilalet',
    city: 'Errachidia',
    cityAr: 'الرشيدية',
    type: 'association',
    category: 'lutte_violence',
    address: 'Avenue Moulay Ali Chérif, Errachidia',
    addressAr: 'شارع مولاي علي الشريف، الرشيدية',
    phone: '+212 5 35 57 24 01',
    email: 'afsd.errachidia@gmail.com',
    services: ['Écoute femmes oasiennes', 'Orientation juridique TPI', 'Aide d\'urgence'],
    coordinates: { latitude: 31.9315, longitude: -4.4244 },
    verified: true,
    sourceName: 'CNDH Drâa-Tafilalet'
  },
  // 10. Guelmim-Oued Noun
  {
    _id: 'cent_12',
    name: 'Association Espoir pour la Femme et l\'Enfant (Guelmim)',
    nameAr: 'جمعية الأمل للمرأة والطفل (كلميم)',
    region: 'Guelmim-Oued Noun',
    city: 'Guelmim',
    cityAr: 'كلميم',
    type: 'association',
    category: 'droits_femmes',
    address: 'Avenue des FAR, Quartier Administratif, Guelmim',
    addressAr: 'شارع القوات المسلحة الملكية، الحي الإداري، كلميم',
    phone: '+212 5 28 87 19 33',
    email: 'espoir.femme.guelmim@gmail.com',
    services: ['Écoute et médiation', 'Orientation juridique Saharienne', 'Assistance sociale'],
    coordinates: { latitude: 28.9882, longitude: -10.0574 },
    verified: true,
    sourceName: 'Entraide Nationale Guelmim'
  },
  // 11. Laâyoune-Sakia El Hamra
  {
    _id: 'cent_13',
    name: 'Association Horizon pour la Femme Sahraouie (Laâyoune)',
    nameAr: 'جمعية أفق للمرأة الصحراوية (العيون)',
    region: 'Laâyoune-Sakia El Hamra',
    city: 'Laâyoune',
    cityAr: 'العيون',
    type: 'association',
    category: 'autonomisation',
    address: 'Boulevard Mekka, Quartier Al Qods, Laâyoune',
    addressAr: 'شارع مكة، حي القدس، العيون',
    phone: '+212 5 28 89 44 20',
    email: 'horizon.femme.laayoune@gmail.com',
    services: ['Écoute Hassanie et Darija', 'Accompagnement juridique', 'Autonomisation'],
    coordinates: { latitude: 27.1536, longitude: -13.2033 },
    verified: true,
    sourceName: 'CNDH Commission Régionale Laâyoune'
  },
  // 12. Dakhla-Oued Ed-Dahab
  {
    _id: 'cent_14',
    name: 'Association Femme et Développement Oued Eddahab (Dakhla)',
    nameAr: 'جمعية المرأة والتنمية بوادي الذهب (الداخلة)',
    region: 'Dakhla-Oued Ed-Dahab',
    city: 'Dakhla',
    cityAr: 'الداخلة',
    type: 'association',
    category: 'autonomisation',
    address: 'Boulevard Mohammed V, Centre-ville, Dakhla',
    addressAr: 'شارع محمد الخامس، وسط المدينة، الداخلة',
    phone: '+212 5 28 89 82 10',
    email: 'femme.developpement.dakhla@gmail.com',
    services: ['Accueil et orientation', 'Assistance juridique', 'Formation professionnelle'],
    coordinates: { latitude: 23.7136, longitude: -15.9355 },
    verified: true,
    sourceName: 'Commission Régionale CNDH Dakhla'
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
