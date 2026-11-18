import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import { colors } from '../../src/theme/colors';
import { useApp } from '../../src/store/appStore';
import {
  ArrowLeft,
  Smartphone,
  Lock,
  EyeOff,
  GraduationCap,
  CheckCircle2,
} from 'lucide-react-native';

const GUIDES = [
  {
    id: 'cyber',
    icon: Smartphone,
    color: colors.primary,
    bg: colors.primaryLight,
    title: 'Cyberharcèlement & Réseaux Sociaux',
    titleAr: 'التحرش الإلكتروني ومواقع التواصل',
    risk: 'Commentaires insultants répétés, messages menaçants, lynchage numérique.',
    riskAr: 'تعليقات مسيئة متكررة، رسائل تهديد، أو حملات تشويه رقمية.',
    actions: [
      'Ne répondez jamais à chaud : l\'agresseur cherche la provocation et l\'escalade.',
      'Faites des captures d\'écran complètes (avec profil, date, heure et URL visible).',
      'Bloquez le compte sur la plateforme après avoir sauvegardé les preuves.',
      'L\'article 447-1 du Code Pénal punit ces actes jusqu\'à 3 ans de prison ferme.',
    ],
    actionsAr: [
      'ما تجاوبيش فالحين بعصبية: المعتدي كيحاول يستفزك ويصعد الموقف.',
      'خدي لقطات شاشة (Screenshots) واضحة فيها رابط الحساب والتاريخ والوقت بدقة.',
      'ديري بلوك للحساب فالمنصة من بعد ما توثقي الأدلة فمكان آمن.',
      'الفصل 447-1 من القانون الجنائي كيعاقب بالحبس حتى لـ 3 سنوات نافذة.',
    ],
  },
  {
    id: 'chantage',
    icon: Lock,
    color: colors.terracotta,
    bg: colors.terracottaLight,
    title: 'Chantage Numérique & Sextorsion',
    titleAr: 'الابتزاز الرقمي والتهديد بنشر الصور',
    risk: 'Menace de diffuser des photos intimes en échange d\'argent ou de soumission.',
    riskAr: 'التهديد بنشر صور خاصة مقابل مبالغ مالية أو التنازل عن حقوق.',
    actions: [
      'RÈGLE D\'OR : Ne versez JAMAIS d\'argent. Le maître-chanteur demandera toujours plus.',
      'Ne supprimez pas la conversation : c\'est votre preuve matérielle devant la justice.',
      'Alertez la Brigade de lutte contre la cybercriminalité (Police 19 / Gendarmerie 177).',
      'Le chantage aggravé est puni jusqu\'à 5 ans de réclusion criminelle au Maroc.',
    ],
    actionsAr: [
      'قاعدة ذهبية: إياكِ وإرسال أي درهم! المبتز لن يتوقف وسيطالب بالمزيد دائماً.',
      'ما تمسحيش المحادثات والرسائل: راها دليلك الحاسم أمام النيابة العامة والشرطة.',
      'بلغي فرقة مكافحة الجريمة الإلكترونية (الشرطة 19 أو عبر منصة إبلاغ e-blagh).',
      'الابتزاز المشدد معاقب عليه بالسجن حتى لـ 5 سنوات في القانون المغربي.',
    ],
  },
  {
    id: 'deepfakes',
    icon: EyeOff,
    color: colors.accentOrange,
    bg: colors.accentOrangeLight,
    title: 'Photos truquées & Deepfakes IA',
    titleAr: 'الصور المركبة والذكاء الاصطناعي (ديب فيك)',
    risk: 'Montages photos ou vidéos par IA portant atteinte à votre réputation.',
    riskAr: 'تركيب صور أو مقاطع فيديو مفبركة بالذكاء الاصطناعي للتشهير والمس بالسمعة.',
    actions: [
      'Signalez immédiatement le contenu auprès de l\'hébergeur pour retrait d\'urgence.',
      'Déposez plainte pour diffamation et diffusion de fausses allégations (Art. 447-2).',
      'Faites dresser un constat d\'huissier de justice (constat numérique probant).',
    ],
    actionsAr: [
      'بلغي المنصة فوراً (Report) للمطالبة بالحذف الاستعجالي للمحتوى.',
      'ضعي شكاية بالتشهير وفبركة وقائع كاذبة بموجب الفصل 447-2 من القانون الجنائي.',
      'استعيني بمفوض قضائي لإنجاز محضر معاينة للمحتوى الرقمي قبل حذفه.',
    ],
  },
  {
    id: 'univ',
    icon: GraduationCap,
    color: colors.secondaryDark,
    bg: colors.secondaryLight,
    title: 'Foyer Universitaire & Campus',
    titleAr: 'الفضاء الجامعي والمعاهد والعمل',
    risk: 'Pression morale, chantage aux examens ou abus d\'autorité académique.',
    riskAr: 'ضغط نفسي، ابتزاز مقابل النقاط، أو استغلال للسلطة الإدارية والأكاديمية.',
    actions: [
      'Saisissez confidentiellement la cellule d\'écoute et de médiation de votre faculté.',
      'Conservez tout échange écrit (emails officiels, WhatsApp, notes vocales).',
      'L\'abus de fonction constitue une circonstance aggravante formellement sanctionnée.',
    ],
    actionsAr: [
      'تواصلي بسرية مع خلية الاستماع والوساطة بالكلية أو خلية حماية الطالبات.',
      'احتفظي بكافة المراسلات والتسجيلات والرسائل المكتوبة كأدلة قانونية.',
      'استغلال النفوذ والسلطة يعتبر ظرف تشديد صريح في القانون الجنائي المغربي.',
    ],
  },
];

export default function PreventionScreen() {
  const router = useRouter();
  const { isRTL, language } = useApp();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header />

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <ArrowLeft size={16} color={colors.primary} strokeWidth={2.4} />
          <Text style={styles.backBtnText}>Accueil</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageHeader}>
          <Text style={styles.pageTag}>SÉCURITÉ & ANTICIPATION</Text>
          <Text style={[styles.pageTitle, isRTL && styles.rtl]}>
            Guides Pratiques de Protection
          </Text>
          <Text style={[styles.pageSub, isRTL && styles.rtl]}>
            Protocoles concrets face aux violences numériques et au harcèlement.
          </Text>
        </View>

        <View style={styles.guidesStack}>
          {GUIDES.map((guide) => {
            const IconComp = guide.icon;
            const title = (language === 'ar' || language === 'darija') && guide.titleAr ? guide.titleAr : guide.title;
            const risk = (language === 'ar' || language === 'darija') && guide.riskAr ? guide.riskAr : guide.risk;
            const actions = (language === 'ar' || language === 'darija') && guide.actionsAr ? guide.actionsAr : guide.actions;
            const label = (language === 'ar' || language === 'darija') ? 'الإجراءات الوقائية الموصى بها :' : 'CONDUITE RECOMMANDÉE :';

            return (
              <View key={guide.id} style={styles.guideCard}>
                <View style={[styles.cardTop, isRTL && styles.rowReverse]}>
                  <View style={[styles.iconBox, { backgroundColor: guide.bg }]}>
                    <IconComp size={22} color={guide.color} />
                  </View>
                  <View style={styles.titleCol}>
                    <Text style={[styles.guideTitle, isRTL && styles.rtl]}>{title}</Text>
                    <Text style={[styles.guideRisk, isRTL && styles.rtl]}>{risk}</Text>
                  </View>
                </View>

                <View style={styles.stepsBox}>
                  <Text style={[styles.stepsBoxLabel, isRTL && styles.rtl]}>{label}</Text>
                  {actions.map((act, i) => (
                    <View key={i} style={[styles.stepItem, isRTL && styles.rowReverse]}>
                      <CheckCircle2
                        size={15}
                        color={colors.secondaryDark}
                        style={{ marginTop: 2 }}
                      />
                      <Text style={[styles.stepItemText, isRTL && styles.rtl]}>{act}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },
  rtl: { textAlign: 'right' },
  rowReverse: { flexDirection: 'row-reverse' },

  navBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.chalk,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },

  pageHeader: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.chalk,
  },
  pageTag: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.ink,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  pageSub: {
    fontSize: 13,
    color: colors.mist,
    lineHeight: 18,
  },

  guidesStack: {
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 14,
  },
  guideCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.chalk,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleCol: { flex: 1 },
  guideTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -0.2,
  },
  guideRisk: {
    fontSize: 12,
    color: colors.mist,
    marginTop: 3,
    lineHeight: 17,
  },

  stepsBox: {
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.chalk,
  },
  stepsBoxLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 0.8,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  stepItemText: {
    flex: 1,
    fontSize: 12.5,
    color: colors.slate,
    lineHeight: 18,
  },
});
