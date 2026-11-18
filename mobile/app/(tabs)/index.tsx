import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import { AudioQuickRecord } from '../../src/components/AudioQuickRecord';
import { colors } from '../../src/theme/colors';
import { useApp } from '../../src/store/appStore';
import {
  Scale,
  Sparkles,
  ShieldCheck,
  Building2,
  HelpCircle,
  ArrowRight,
  FolderLock,
  PhoneCall,
  CheckCircle2,
  ChevronRight,
  Shield,
  Smartphone,
  Home as HomeIcon,
  Briefcase,
  ChefHat,
  Lock,
} from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { t, isRTL, openSos, panicExit } = useApp();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <Header />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── TOP HERO CARD (Inspired by Screen 1/2 Purple Card) ── */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroBadge}>
              <Shield size={12} color={colors.white} />
              <Text style={styles.heroBadgeText}>CNDH MAROC · CAMPAGNE NATIONALE</Text>
            </View>
            <Text style={styles.heroArabicDeco}>سند</Text>
          </View>

          <Text style={[styles.heroTitle, isRTL && styles.rtl]}>
            {t.home.heroTitle}
          </Text>
          <Text style={[styles.heroSubtitle, isRTL && styles.rtl]}>
            {t.home.heroSubtitle}
          </Text>

          {/* SOS Emergency Hotline Pill Inside Hero */}
          <TouchableOpacity
            style={styles.sosHeroBtn}
            onPress={openSos}
            activeOpacity={0.88}
          >
            <View style={styles.sosIconBox}>
              <PhoneCall size={18} color={colors.white} />
            </View>
            <View style={styles.sosTextCol}>
              <Text style={styles.sosHeroTitle}>SOS URGENCE · 19 / 177 / 15</Text>
              <Text style={styles.sosHeroSub}>Police, Gendarmerie & Secours 24h/24</Text>
            </View>
            <View style={styles.sosArrowBox}>
              <ArrowRight size={16} color={colors.white} />
            </View>
          </TouchableOpacity>
        </View>

        {/* ── STATUS TOGGLE BAR (Click to switch to Cooking Camouflage) ── */}
        <TouchableOpacity
          style={styles.statusBarCard}
          onPress={panicExit}
          activeOpacity={0.85}
        >
          <View style={styles.statusLeft}>
            <View style={styles.statusDot} />
            <View>
              <Text style={styles.statusTitle}>Protection discrète active</Text>
              <Text style={styles.statusSub}>Appuyez pour basculer vers les recettes de cuisine</Text>
            </View>
          </View>
          <View style={styles.toggleActive}>
            <View style={styles.toggleThumb} />
          </View>
        </TouchableOpacity>

        {/* ── PROMINENT HOME AUDIO QUICK-RECORD WIDGET ── */}
        <AudioQuickRecord />

        {/* ── 2x2 CORE ACTIONS GRID (Inspired by Screen 1 4 Cards: Transfers, History, Deposit, Financial) ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtl]}>Accès Direct</Text>
          <Text style={styles.sectionBadge}>4 Services</Text>
        </View>

        <View style={styles.gridContainer}>
          {/* 1. Mes Droits (Scale) */}
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => router.push('/(tabs)/legal')}
            activeOpacity={0.8}
          >
            <View style={[styles.gridIconCircle, { backgroundColor: colors.primaryLight }]}>
              <Scale size={22} color={colors.primary} />
            </View>
            <Text style={[styles.gridTitle, isRTL && styles.rtl]}>
              {t.home.quickActions.understandRights}
            </Text>
            <Text style={[styles.gridSub, isRTL && styles.rtl]}>
              Loi 103-13 & Code Pénal
            </Text>
          </TouchableOpacity>

          {/* 2. Assistant IA (Sparkles) */}
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => router.push('/(tabs)/assistant')}
            activeOpacity={0.8}
          >
            <View style={[styles.gridIconCircle, { backgroundColor: '#F0EEFF' }]}>
              <Sparkles size={22} color={colors.primary} />
            </View>
            <Text style={[styles.gridTitle, isRTL && styles.rtl]}>
              {t.home.quickActions.askQuestion}
            </Text>
            <Text style={[styles.gridSub, isRTL && styles.rtl]}>
              FR, Arabe & Darija
            </Text>
          </TouchableOpacity>

          {/* 3. Trouver un Centre (Building2) */}
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => router.push('/(tabs)/help')}
            activeOpacity={0.8}
          >
            <View style={[styles.gridIconCircle, { backgroundColor: colors.secondaryLight }]}>
              <Building2 size={22} color={colors.secondaryDark} />
            </View>
            <Text style={[styles.gridTitle, isRTL && styles.rtl]}>
              {t.home.quickActions.findCenter}
            </Text>
            <Text style={[styles.gridSub, isRTL && styles.rtl]}>
              Centres vérifiés par ville
            </Text>
          </TouchableOpacity>

          {/* 4. Prévention Numérique (ShieldCheck) */}
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => router.push('/prevention' as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.gridIconCircle, { backgroundColor: colors.accentOrangeLight }]}>
              <ShieldCheck size={22} color={colors.accentOrange} />
            </View>
            <Text style={[styles.gridTitle, isRTL && styles.rtl]}>
              {t.home.quickActions.prevention}
            </Text>
            <Text style={[styles.gridSub, isRTL && styles.rtl]}>
              Chantage & Cyber-sécurité
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── LIST SECTION (Inspired by Screen 2 "History" List with colored squircles) ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtl]}>Outils Personnels & Sécurité</Text>
        </View>

        <View style={styles.listContainer}>
          {/* Dar L-Aman - Foyers d'hébergement d'urgence */}
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push('/shelters' as any)}
            activeOpacity={0.75}
          >
            <View style={[styles.squircleIcon, { backgroundColor: '#DCFCE7' }]}>
              <HomeIcon size={20} color={colors.secondaryDark} />
            </View>
            <View style={styles.listInfo}>
              <Text style={styles.listTitle}>Dar L-Aman · Foyers d'Hébergement</Text>
              <Text style={styles.listSub}>Mise à l'abri et refuges d'urgence sécurisés</Text>
            </View>
            <ChevronRight size={18} color={colors.fog} />
          </TouchableOpacity>

          <View style={styles.listDivider} />

          {/* Tamkeen - Autonomie Economique */}
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push('/empowerment' as any)}
            activeOpacity={0.75}
          >
            <View style={[styles.squircleIcon, { backgroundColor: '#FEF3C7' }]}>
              <Briefcase size={20} color="#D97706" />
            </View>
            <View style={styles.listInfo}>
              <Text style={styles.listTitle}>Tamkeen · Autonomie & Emploi</Text>
              <Text style={styles.listSub}>Formations, coopératives et microcrédit Forsa</Text>
            </View>
            <ChevronRight size={18} color={colors.fog} />
          </TouchableOpacity>

          <View style={styles.listDivider} />

          {/* Plan de sécurité */}
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push('/safety/plan' as any)}
            activeOpacity={0.75}
          >
            <View style={[styles.squircleIcon, { backgroundColor: colors.secondaryLight }]}>
              <ShieldCheck size={20} color={colors.secondaryDark} />
            </View>
            <View style={styles.listInfo}>
              <Text style={styles.listTitle}>Plan de sécurité personnel</Text>
              <Text style={styles.listSub}>Checklist discrète en cas de danger</Text>
            </View>
            <ChevronRight size={18} color={colors.fog} />
          </TouchableOpacity>

          <View style={styles.listDivider} />

          {/* Coffre-fort numérique des preuves */}
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push('/evidence' as any)}
            activeOpacity={0.75}
          >
            <View style={[styles.squircleIcon, { backgroundColor: colors.primaryLight }]}>
              <FolderLock size={20} color={colors.primary} />
            </View>
            <View style={styles.listInfo}>
              <Text style={styles.listTitle}>Coffre-fort numérique des preuves</Text>
              <Text style={styles.listSub}>Captures, photos et empreintes SHA-256</Text>
            </View>
            <ChevronRight size={18} color={colors.fog} />
          </TouchableOpacity>

          <View style={styles.listDivider} />

          {/* Administration & Supervision */}
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push('/admin' as any)}
            activeOpacity={0.75}
          >
            <View style={[styles.squircleIcon, { backgroundColor: '#F3E8FF' }]}>
              <Lock size={20} color="#7C3AED" />
            </View>
            <View style={styles.listInfo}>
              <Text style={styles.listTitle}>Administration & Audit CNDP</Text>
              <Text style={styles.listSub}>Supervision des organismes et conformité</Text>
            </View>
            <ChevronRight size={18} color={colors.fog} />
          </TouchableOpacity>
        </View>

        {/* ── DID YOU KNOW CARD (Clean white with purple accent) ── */}
        <View style={styles.didYouKnowCard}>
          <View style={styles.didYouKnowHeader}>
            <View style={styles.didYouKnowBadge}>
              <CheckCircle2 size={14} color={colors.secondaryDark} />
              <Text style={styles.didYouKnowTag}>{t.home.didYouKnow.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={[styles.didYouKnowText, isRTL && styles.rtl]}>
            {t.home.didYouKnowText}
          </Text>
        </View>

        {/* ── CAMPAIGN CARD (Vibrant purple footer block) ── */}
        <View style={styles.campaignCard}>
          <Text style={styles.campaignTag}>{t.home.campaignTitle}</Text>
          <Text style={[styles.campaignTitle, isRTL && styles.rtl]}>
            {t.home.campaignDesc}
          </Text>
          <Text style={[styles.campaignBody, isRTL && styles.rtl]}>
            Le chantage numérique et le partage d'images intimes sans accord sont punis jusqu'à 5 ans de prison par le Code Pénal marocain (Art. 447-1).
          </Text>
          <TouchableOpacity
            style={styles.campaignBtn}
            onPress={() => router.push('/prevention' as any)}
            activeOpacity={0.85}
          >
            <Text style={styles.campaignBtnText}>Découvrir les conseils de protection</Text>
            <ArrowRight size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  rtl: {
    textAlign: 'right',
  },

  // HERO CARD (Purple Gradient/Solid)
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 22,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  heroBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  heroArabicDeco: {
    fontSize: 24,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.3)',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: -0.4,
    lineHeight: 30,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 19,
    marginBottom: 18,
  },
  sosHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.terracotta,
    borderRadius: 16,
    padding: 12,
    gap: 12,
    shadowColor: colors.terracotta,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  sosIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosTextCol: {
    flex: 1,
  },
  sosHeroTitle: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  sosHeroSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    marginTop: 1,
  },
  sosArrowBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // STATUS BAR CARD
  statusBarCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.chalk,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.secondary,
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.ink,
  },
  statusSub: {
    fontSize: 11,
    color: colors.mist,
    marginTop: 1,
  },
  toggleActive: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    paddingHorizontal: 3,
    alignItems: 'flex-end',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },

  // SECTION HEADER
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -0.3,
  },
  sectionBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },

  // 2x2 GRID
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 22,
  },
  gridCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.chalk,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  gridIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 3,
  },
  gridSub: {
    fontSize: 11,
    color: colors.mist,
    lineHeight: 15,
  },

  // LIST CONTAINER (SCREEN 2 HISTORY STYLE)
  listContainer: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.chalk,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 14,
  },
  squircleIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listInfo: {
    flex: 1,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.ink,
  },
  listSub: {
    fontSize: 12,
    color: colors.mist,
    marginTop: 2,
  },
  listDivider: {
    height: 1,
    backgroundColor: colors.chalk,
  },

  // DID YOU KNOW
  didYouKnowCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.chalk,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  didYouKnowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  didYouKnowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  didYouKnowTag: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.secondaryDark,
    letterSpacing: 0.8,
  },
  didYouKnowText: {
    fontSize: 13,
    color: colors.slate,
    lineHeight: 19,
  },

  // CAMPAIGN CARD
  campaignCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#DFDCFA',
  },
  campaignTag: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  campaignTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.ink,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  campaignBody: {
    fontSize: 12.5,
    color: colors.slate,
    lineHeight: 18,
    marginBottom: 14,
  },
  campaignBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 8,
    alignSelf: 'flex-start',
  },
  campaignBtnText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
});
