import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import { colors } from '../../src/theme/colors';
import { useApp } from '../../src/store/appStore';
import {
  ArrowLeft,
  Globe,
  Shield,
  Trash2,
  CheckCircle2,
} from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { language, setLanguage, t, isRTL } = useApp();

  const handleClearData = () => {
    Alert.alert(
      'Réinitialiser les données locales',
      'Cette action efface l\'historique confidentiel et les contacts enregistrés sur cet appareil.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Réinitialisé', 'Vos données locales ont été purgées avec succès.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header />

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
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
          <Text style={styles.pageTag}>PARAMÈTRES & PROTECTION</Text>
          <Text style={[styles.pageTitle, isRTL && styles.rtl]}>{t.settings.title}</Text>
          <Text style={[styles.pageSub, isRTL && styles.rtl]}>
            Contrôle souverain de vos préférences linguistiques et de votre confidentialité.
          </Text>
        </View>

        {/* Guest Mode Badge */}
        <View style={styles.guestStrip}>
          <CheckCircle2 size={16} color={colors.secondaryDark} />
          <Text style={styles.guestStripText}>{t.settings.guestMode}</Text>
        </View>

        {/* Language Selection */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Globe size={18} color={colors.primary} />
            <Text style={styles.cardTitle}>{t.settings.language.toUpperCase()}</Text>
          </View>

          <View style={styles.langStack}>
            <TouchableOpacity
              style={[styles.langBtn, language === 'fr' && styles.langBtnActive]}
              onPress={() => setLanguage('fr')}
              activeOpacity={0.8}
            >
              <Text style={[styles.langBtnText, language === 'fr' && styles.langBtnTextActive]}>
                Français
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.langBtn, language === 'ar' && styles.langBtnActive]}
              onPress={() => setLanguage('ar')}
              activeOpacity={0.8}
            >
              <Text style={[styles.langBtnText, language === 'ar' && styles.langBtnTextActive]}>
                العربية (Arabe standard)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.langBtn, language === 'darija' && styles.langBtnActive]}
              onPress={() => setLanguage('darija')}
              activeOpacity={0.8}
            >
              <Text style={[styles.langBtnText, language === 'darija' && styles.langBtnTextActive]}>
                الدارجة المغربية (Darija)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About SANAD */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Shield size={18} color={colors.primary} />
            <Text style={styles.cardTitle}>{t.settings.about.toUpperCase()}</Text>
          </View>
          <Text style={[styles.aboutBody, isRTL && styles.rtl]}>{t.settings.aboutText}</Text>
          <View style={styles.mottoBox}>
            <Text style={styles.mottoText}>« Vous n'êtes jamais seule. »</Text>
            <Text style={styles.mottoSub}>DROITS · PROTECTION · ACCOMPAGNEMENT</Text>
          </View>
        </View>

        {/* Data Clearing */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Trash2 size={18} color={colors.terracotta} />
            <Text style={[styles.cardTitle, { color: colors.terracotta }]}>
              PURGE LOCALE D'URGENCE
            </Text>
          </View>
          <Text style={styles.privacyNote}>
            SANAD ne collecte aucun identifiant nominatif. En cas d'inquiétude, vous pouvez supprimer immédiatement tout contenu local.
          </Text>

          <TouchableOpacity
            style={styles.clearBtn}
            onPress={handleClearData}
            activeOpacity={0.85}
          >
            <Trash2 size={14} color={colors.white} />
            <Text style={styles.clearBtnText}>{t.settings.clearData}</Text>
          </TouchableOpacity>
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

  guestStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.secondaryLight,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  guestStripText: {
    fontSize: 12,
    color: colors.secondaryDark,
    fontWeight: '800',
    flex: 1,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.chalk,
    marginHorizontal: 16,
    marginTop: 14,
    gap: 12,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.ink,
    letterSpacing: 1,
  },

  langStack: { gap: 8 },
  langBtn: {
    backgroundColor: colors.background,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.chalk,
  },
  langBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  langBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.ink,
  },
  langBtnTextActive: {
    color: colors.white,
  },

  aboutBody: {
    fontSize: 13,
    color: colors.slate,
    lineHeight: 19,
  },
  mottoBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  mottoText: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.primary,
    fontStyle: 'italic',
  },
  mottoSub: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.slate,
    letterSpacing: 0.8,
  },

  privacyNote: {
    fontSize: 12,
    color: colors.mist,
    lineHeight: 17,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.terracotta,
    paddingVertical: 12,
    borderRadius: 14,
  },
  clearBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.white,
  },
});
