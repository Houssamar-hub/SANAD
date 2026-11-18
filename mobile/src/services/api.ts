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

export const FALLBACK_OPPORTUNITIES = [
  {
    _id: 'opp_1',
    title: 'Programme Forsa : Accompagnement & Financement Entreprenariat Féminin',
    titleAr: 'برنامج فرصة : مواكبة وتمويل المشاريع النسائية المقاولاتية',
    organization: 'Ministère du Tourisme et de l\'Artisanat / Forsa',
    category: 'microfinance_forsa',
    region: 'Toutes les régions',
    city: 'National (12 Régions)',
    description: 'Prêt d\'honneur à taux 0% jusqu\'à 100 000 DH avec subvention de 10 000 DH et formation par un mentor agréé.',
    stipendOrSalary: 'Prêt 0% + 10.000 DH subvention',
    contactPhone: '+212 5 37 67 92 00',
    officialLink: 'https://forsa.ma',
    verified: true
  },
  {
    _id: 'opp_2',
    title: 'Formation & Intégration en Couture Traditionnelle et Modélisme',
    titleAr: 'تكوين وتشغيل في الخياطة والفصالة التقليدية والعصرية',
    organization: 'Coopérative Al Amal & Entraide Nationale',
    category: 'couture_confection',
    region: 'Casablanca-Settat',
    city: 'Casablanca',
    description: 'Cycle qualifiant de 3 à 6 mois pour femmes en réinsertion sociale avec insertion professionnelle en atelier.',
    stipendOrSalary: 'Bourse de transport + Salaire d\'insertion',
    contactPhone: '+212 5 22 23 88 10',
    verified: true
  },
  {
    _id: 'opp_3',
    title: 'Filière Pâtisserie Marocaine & Traiteur Solidaire',
    titleAr: 'شعبة الطبخ والحلويات المغربية - التمكين الذاتي',
    organization: 'Association Solidarité Féminine (ASF)',
    category: 'cuisine_traiteur',
    region: 'Casablanca-Settat',
    city: 'Casablanca',
    description: 'Programme certifié d\'autonomisation pour femmes en situation de précarité avec garderie intégrée.',
    stipendOrSalary: 'Prise en charge complète + Rémunération',
    contactPhone: '+212 5 22 86 28 65',
    verified: true
  },
  {
    _id: 'opp_4',
    title: 'Coopérative Artisanale de Tissage & Huile d\'Argan',
    titleAr: 'تعاونية نسوية للصناعة التقليدية والمنتجات المجالية',
    organization: 'Union des Coopératives Féminines du Souss',
    category: 'artisanat_cooperative',
    region: 'Souss-Massa',
    city: 'Agadir / Taroudant',
    description: 'Activités génératrices de revenus : tissage traditionnel et valorisation des produits du terroir.',
    stipendOrSalary: 'Revenu partagé (1 800 à 3 500 DH)',
    contactPhone: '+212 5 28 84 55 12',
    verified: true
  },
  {
    _id: 'opp_5',
    title: 'Microcrédit Solidaire & Accompagnement de Proximité',
    titleAr: 'التمويل الأصغر التضامني ومواكبة الأنشطة الصغرى المدرة للدخل',
    organization: 'Fondation Al Amana & Attawfiq Microfinance',
    category: 'microfinance_forsa',
    region: 'Toutes les régions',
    city: 'Toutes les villes du Maroc',
    description: 'Financement de 2 000 à 50 000 DH sans caution hypothécaire pour artisanes et commerçantes.',
    stipendOrSalary: 'Micro-crédit souple à remboursement échelonné',
    contactPhone: '+212 5 37 77 11 00',
    verified: true
  }
];

export const FALLBACK_SAFE_HOUSES = [
  {
    _id: 'sh_1',
    name: 'Dispositif d\'Hébergement d\'Urgence INJAD (Casablanca)',
    nameAr: 'آلية الإيواء المستعجل إنجاد ضد العنف (الدار البيضاء)',
    region: 'Casablanca-Settat',
    city: 'Casablanca',
    partnerOrg: 'Fédération des Ligues des Droits des Femmes (FLDF)',
    referralProcess: 'Accueil transitoire sur décision de la cellule d\'écoute d\'urgence ou réquisition judiciaire (Loi 103-13).',
    referralHotline: '+212 5 22 26 14 13',
    capacityStatus: 'places_disponibles',
    services: ['Hébergement sécurisé', 'Restauration & Soins', 'Assistance judiciaire d\'office'],
    confidentialityNotice: 'Adresse physique strictement confidentielle pour la sécurité des résidentes. Accueil assuré au siège de l\'association partenaire.',
    verified: true
  },
  {
    _id: 'sh_2',
    name: 'Centre Batha d\'Accueil et de Sécurité (Fès)',
    nameAr: 'مركز البطحاء لإيواء النساء ضحايا العنف (فاس)',
    region: 'Fès-Meknès',
    city: 'Fès',
    partnerOrg: 'Initiatives pour la Protection des Droits des Femmes (IPDF)',
    referralProcess: 'Orientation immédiate 24h/24 via brigade de police, Procureur du Roi ou permanence IPDF.',
    referralHotline: '+212 5 35 63 80 50',
    capacityStatus: 'places_disponibles',
    services: ['Hébergement d\'urgence 24h/24', 'Soutien psychologique', 'Accompagnement tribunal'],
    confidentialityNotice: 'Refuge protégé sous convention avec le Ministère de la Solidarité et l\'Entraide Nationale.',
    verified: true
  },
  {
    _id: 'sh_3',
    name: 'Foyer de Protection Annajda (Rabat)',
    nameAr: 'مركز النجدة للإيواء المؤقت والحماية (الرباط)',
    region: 'Rabat-Salé-Kénitra',
    city: 'Rabat',
    partnerOrg: 'Union de l\'Action Féministe (UAF)',
    referralProcess: 'Admission prioritaire pour femmes et enfants en situation de danger imminent.',
    referralHotline: '+212 5 37 72 19 02',
    capacityStatus: 'sur_demande_cellule',
    services: ['Mise à l\'abri immédiate', 'Médiation juridique', 'Aide aux mineurs'],
    confidentialityNotice: 'Adresse protégée. Orientation via le centre d\'écoute UAF Rabat.',
    verified: true
  },
  {
    _id: 'sh_4',
    name: 'Maison de Transition Annakhil (Marrakech)',
    nameAr: 'دار الأمان للمأوى المؤقت (مراكش)',
    region: 'Marrakech-Safi',
    city: 'Marrakech',
    partnerOrg: 'Association Annakhil pour la Femme et l\'Enfant',
    referralProcess: 'Cellule de crise conjointe avec le Tribunal de Première Instance et la Wilaya de Police.',
    referralHotline: '+212 5 24 43 65 20',
    capacityStatus: 'places_disponibles',
    services: ['Hébergement transitoire', 'Cellule médico-légale', 'Aide alimentaire'],
    confidentialityNotice: 'Lieu protégé tenu secret conformément aux protocoles de protection de la loi 103-13.',
    verified: true
  }
];

export const FALLBACK_RECIPES = [
  {
    id: 'rec_1',
    title: 'Tajine de Veau aux Pruneaux et Amandes',
    titleAr: 'طاجين اللحم بالبرقوق واللوز المقلي',
    category: 'Tajines',
    prepTime: '25 min',
    cookTime: '1h 30 min',
    difficulty: 'Moyen',
    rating: 4.9,
    servings: '4 personnes',
    calories: '620 kcal',
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      '800g de viande de veau (épaule ou jarret)',
      '2 oignons émincés finement',
      '2 gousses d\'ail écrasées',
      '250g de pruneaux séchés',
      '50g d\'amandes mondées et frites',
      '1 cuillère à café de gingembre moulu',
      '1 cuillère à café de curcuma',
      '1/2 cuillère à café de cannelle',
      '1 cuillère à soupe de miel pur',
      'Quelques pistils de safran pur',
      'Huile d\'olive et beurre clarifié (Smen)',
      'Graines de sésame grillées'
    ],
    instructions: [
      'Faire dorer les morceaux de veau dans le tajine avec l\'huile d\'olive, l\'ail, les oignons et les épices (gingembre, curcuma, safran).',
      'Ajouter un petit verre d\'eau tiède, couvrir et laisser mijoter à feu doux pendant environ 1 heure jusqu\'à ce que la viande devienne fondante.',
      'Dans une petite casserole, pocher les pruneaux dans un peu de bouillon du tajine avec une pincée de cannelle et le miel jusqu\'à caramélisation.',
      'Dresser les pruneaux chauds sur la viande, parsemer d\'amandes croustillantes et de graines de sésame dorées. Servir avec du pain marocain frais.'
    ]
  },
  {
    id: 'rec_2',
    title: 'Couscous Royal aux Sept Légumes',
    titleAr: 'الكسكس المغربي التقليدي بالسبع خضار',
    category: 'Couscous',
    prepTime: '40 min',
    cookTime: '1h 45 min',
    difficulty: 'Traditionnel',
    rating: 5.0,
    servings: '6 personnes',
    calories: '580 kcal',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      '500g de semoule de blé dur moyenne',
      '700g de viande de bœuf ou agneau',
      'Courgettes, carottes, navets, potiron rouge',
      '1/2 chou vert pommé',
      '1 bol de pois chiches trempés la veille',
      '2 tomates mûres râpées',
      '1 cuillère de smen (beurre rance marocain)',
      'Gingembre, poivre noir, safran, sel'
    ],
    instructions: [
      'Dans le bas du couscoussier, saisir la viande avec les oignons, tomates, pois chiches, smen et épices, puis couvrir d\'eau bouillante.',
      'Humidifier la semoule avec un filet d\'eau et d\'huile, puis la cuire à la vapeur au-dessus de la marmite (1ère vapeur 20 min).',
      'Travailler la graine avec de l\'eau tiède salée. Ajouter les légumes fermes (carottes, navets, chou) dans le bouillon.',
      'Remettre la semoule pour une 2ème puis 3ème cuisson vapeur. Ajouter les courgettes et le potiron 15 min avant la fin.',
      'Dresser en dôme, creuser le centre pour la viande et disposer les légumes harmonieusement avec le bouillon chaud.'
    ]
  },
  {
    id: 'rec_3',
    title: 'Pastilla Fassie au Poulet et Amandes',
    titleAr: 'البسطيلة الفاسية الأصيلة بالدجاج واللوز المحمر',
    category: 'Pastillas',
    prepTime: '50 min',
    cookTime: '1h 15 min',
    difficulty: 'Avancé',
    rating: 4.9,
    servings: '8 personnes',
    calories: '690 kcal',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      '1 poulet entier découpé',
      '1 kg d\'oignons émincés',
      '6 œufs battus',
      '300g d\'amandes mondées, frites et concassées',
      '1 paquet de feuilles de pastilla (ou ouarka)',
      'Cannelle de Ceylan, sucre glace, eau de fleur d\'oranger',
      'Beurre fondu pour badigeonner les feuilles'
    ],
    instructions: [
      'Cuire le poulet avec les oignons, persil, coriandre, gingembre, safran et cannelle jusqu\'à ce que la chair se détache.',
      'Désosser et effilocher finement le poulet. Faire réduire la sauce aux oignons jusqu\'à épaississement puis incorporer les œufs battus.',
      'Mélanger les amandes concassées avec du sucre glace, de la cannelle et une cuillère d\'eau de fleur d\'oranger.',
      'Monter la pastilla dans un moule rond en superposant les feuilles beurrées, la couche de poulet, la préparation aux œufs puis les amandes.',
      'Fermer hermétiquement, dorer au four à 180°C pendant 30 min. Décorer de sucre glace et de cannelle.'
    ]
  },
  {
    id: 'rec_4',
    title: 'Harira Traditionnelle & Dattes Majhoul',
    titleAr: 'الحريرة المغربية الأصيلة مع التمر المجهول والشباكية',
    category: 'Soupes',
    prepTime: '20 min',
    cookTime: '50 min',
    difficulty: 'Facile',
    rating: 4.8,
    servings: '6 personnes',
    calories: '340 kcal',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      '200g de dés de viande de veau',
      '1 bol de pois chiches trempés et émondés',
      '1/2 bol de lentilles brunes',
      'Céleri branche (krafes), persil et coriandre hachés',
      '1 kg de tomates fraîches mixées',
      '2 cuillères de concentré de tomate',
      '1 bol de levain ou farine délayée (Tadwira)',
      'Cheveux d\'ange (vermicelle)'
    ],
    instructions: [
      'Mettre la viande, pois chiches, lentilles, oignon râpé, céleri, persil, coriandre et épices dans une marmite avec 2L d\'eau.',
      'Laisser cuire 35 min jusqu\'à tendreté des légumineuses.',
      'Ajouter la purée de tomate et le concentré. Porter à ébullition.',
      'Verser la Tadwira en remuant sans arrêt pour velouter la soupe.',
      'Ajouter les vermicelles 5 min avant d\'éteindre. Servir fumant avec des quartiers de citron et des dattes.'
    ]
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
