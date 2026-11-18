const SafeHouse = require('../models/SafeHouse');

const FALLBACK_SAFE_HOUSES = [
  {
    _id: 'sh_1',
    name: 'Dispositif d\'Hébergement d\'Urgence INJAD (Casablanca)',
    nameAr: 'آلية الإيواء المستعجل إنجاد ضد العنف (الدار البيضاء)',
    region: 'Casablanca-Settat',
    city: 'Casablanca',
    partnerOrg: 'Fédération des Ligues des Droits des Femmes (FLDF)',
    partnerOrgAr: 'فدرالية رابطة حقوق النساء - شبكة إنجاد',
    referralProcess: 'Accueil transitoire sur décision de la cellule d\'écoute d\'urgence ou réquisition judiciaire (Art. 103-13). Prise en charge psychosociale et médicale.',
    referralProcessAr: 'إيواء انتقالي بناء على تقييم خلية الاستماع أو أمر قضائي بالإيواء. تكفل صحي ونفسي مجاني.',
    referralHotline: '+212 5 22 26 14 13',
    capacityStatus: 'places_disponibles',
    services: ['Hébergement sécurisé', 'Restauration & Soins', 'Assistance judiciaire d\'office', 'Garde d\'enfants'],
    confidentialityNotice: 'Pour garantir la sécurité physique absolue des femmes et enfants accueillis, l\'adresse du refuge est strictement confidentielle. Le point d\'accueil officiel est situé au siège de la FLDF Casablanca.',
    verified: true,
    verificationAuthority: 'Réseau INJAD / CNDH'
  },
  {
    _id: 'sh_2',
    name: 'Centre Batha d\'Accueil et de Sécurité pour Femmes (Fès)',
    nameAr: 'مركز البطحاء لإيواء النساء ضحايا العنف (فاس)',
    region: 'Fès-Meknès',
    city: 'Fès',
    partnerOrg: 'Initiatives pour la Protection des Droits des Femmes (IPDF) & Entraide Nationale',
    partnerOrgAr: 'مبادرات لحماية حقوق النساء والتعاون الوطني',
    referralProcess: 'Orientation immédiate 24h/24 via la brigade de police spécialisée ou le Procureur du Roi ou l\'association IPDF.',
    referralProcessAr: 'توجيه فوري 24/24 عبر خلية التكفل بالأمن الوطني أو النيابة العامة أو الجمعية المسيرة.',
    referralHotline: '+212 5 35 63 80 50',
    capacityStatus: 'places_disponibles',
    services: ['Hébergement d\'urgence 24h/24', 'Soutien psychologique', 'Accompagnement tribunal', 'Ateliers de réinsertion'],
    confidentialityNotice: 'Refuge ultra-sécurisé sous convention avec le Ministère de la Solidarité et l\'Entraide Nationale.',
    verified: true,
    verificationAuthority: 'Entraide Nationale & Ministère de la Solidarité'
  },
  {
    _id: 'sh_3',
    name: 'Foyer d\'Urgence et de Protection Annajda (Rabat)',
    nameAr: 'مركز النجدة للإيواء المؤقت والحماية (الرباط)',
    region: 'Rabat-Salé-Kénitra',
    city: 'Rabat',
    partnerOrg: 'Union de l\'Action Féministe (UAF)',
    partnerOrgAr: 'اتحاد العمل النسائي',
    referralProcess: 'Admission prioritaire pour les femmes victimes de violences conjugales graves ou en danger physique imminent avec leurs enfants.',
    referralProcessAr: 'استقبال عاجل للنساء المعنفات وأطفالهن في حالة الخطر الداهم وتوفير المأوى والمؤازرة القانونية.',
    referralHotline: '+212 5 37 72 19 02',
    capacityStatus: 'sur_demande_cellule',
    services: ['Hébergement transitoire', 'Médiation juridique', 'Aide aux mineurs', 'Suivi médical'],
    confidentialityNotice: 'Adresse protégée. Orientation via le centre d\'écoute UAF Rabat.',
    verified: true,
    verificationAuthority: 'Réseau National UAF'
  },
  {
    _id: 'sh_4',
    name: 'Maison de Transition et de Sécurité Annakhil (Marrakech)',
    nameAr: 'دار الأمان للمأوى المؤقت (مراكش)',
    region: 'Marrakech-Safi',
    city: 'Marrakech',
    partnerOrg: 'Association Annakhil pour la Femme et l\'Enfant',
    partnerOrgAr: 'جمعية النخيل للمرأة والطفل',
    referralProcess: 'Cellule de crise conjointe avec le Tribunal de Première Instance de Marrakech et la Wilaya de Police.',
    referralProcessAr: 'تنسيق مشترك بين النيابة العامة بالمحكمة الابتدائية بمراكش وجمعية النخيل للتكفل السريع.',
    referralHotline: '+212 5 24 43 65 20',
    capacityStatus: 'places_disponibles',
    services: ['Mise à l\'abri immédiate', 'Cellule médico-légale', 'Aide alimentaire', 'Assistance sociale'],
    confidentialityNotice: 'Lieu protégé tenu secret conformément aux protocoles de protection des victimes de la loi 103-13.',
    verified: true,
    verificationAuthority: 'Commission Régionale CNDH Marrakech-Safi'
  },
  {
    _id: 'sh_5',
    name: 'Dispositif d\'Hébergement d\'Urgence Souss-Massa (Agadir)',
    nameAr: 'فضاء الحماية والإيواء لنساء سوس ماسة (أكادير)',
    region: 'Souss-Massa',
    city: 'Agadir',
    partnerOrg: 'Association Voix de Femmes Marocaines & Entraide Nationale Agadir',
    partnerOrgAr: 'جمعية صوت النساء المغربيات والتعاون الوطني',
    referralProcess: 'Orientation pour femmes du milieu urbain et rural du Grand Souss. Accueil plurilingue (Amazigh, Darija, Arabe).',
    referralProcessAr: 'استقبال وتوجيه لنساء المناطق القروية والحضرية بجهة سوس ماسة مع مواكبة باللغتين الأمازيغية والدارجة.',
    referralHotline: '+212 5 28 84 55 12',
    capacityStatus: 'places_disponibles',
    services: ['Hébergement sécurisé', 'Médiation en Amazigh et Darija', 'Accompagnement judiciaire', 'Secours d\'urgence'],
    confidentialityNotice: 'Protocole de confidentialité strict. Contact direct via la permanence téléphonique.',
    verified: true,
    verificationAuthority: 'Entraide Nationale Région Souss-Massa'
  }
];

exports.getSafeHouses = async (req, res) => {
  try {
    const { region } = req.query;
    let query = {};
    if (region && region !== 'all' && region !== 'Toutes les régions') {
      query.region = new RegExp(region, 'i');
    }

    let list;
    try {
      list = await SafeHouse.find(query);
    } catch (e) {
      list = [...FALLBACK_SAFE_HOUSES];
      if (region && region !== 'all' && region !== 'Toutes les régions') {
        list = list.filter(s => s.region.toLowerCase().includes(region.toLowerCase()));
      }
    }

    return res.json({
      success: true,
      count: list.length,
      protocol: 'Les adresses physiques précises des foyers sont rigoureusement confidentielles pour la sécurité des résidentes. Les admissions se font via les permanences téléphoniques partenaires officielles.',
      shelters: list
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
