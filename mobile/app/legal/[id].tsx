import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import { colors } from '../../src/theme/colors';
import { useApp } from '../../src/store/appStore';
import { FALLBACK_LEGAL_DOCS, apiClient } from '../../src/services/api';
import {
  ArrowLeft,
  Shield,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react-native';

export default function LegalDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isRTL } = useApp();

  const [document, setDocument] = useState<any>(null);

  useEffect(() => {
    const found = FALLBACK_LEGAL_DOCS.find((d) => d._id === id || d.lawNumber === id);
    if (found) {
      setDocument(found);
    } else {
      setDocument(FALLBACK_LEGAL_DOCS[0]);
    }

    if (id) {
      apiClient
        .get(`/legal/${id}`)
        .then((res) => {
          if (res.data.document) setDocument(res.data.document);
        })
        .catch(() => {});
    }
  }, [id]);

  if (!document) {
    return null;
  }

  const displayTitle = isRTL && document.titleAr ? document.titleAr : document.title;
  const displayExplanation =
    isRTL && document.simplifiedExplanationAr
      ? document.simplifiedExplanationAr
      : document.simplifiedExplanation;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/legal');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header />

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <ArrowLeft size={16} color={colors.primary} strokeWidth={2.4} />
          <Text style={styles.backBtnText}>Retour Bibliothèque</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Hero Card in Electric Purple */}
        <View style={styles.heroCard}>
          <View style={styles.badgeRow}>
            <View style={styles.lawPill}>
              <Shield size={12} color={colors.white} />
              <Text style={styles.lawPillText}>{document.lawNumber}</Text>
            </View>
            {document.articleNumber && (
              <Text style={styles.articleText}>{document.articleNumber}</Text>
            )}
          </View>

          <Text style={[styles.title, isRTL && styles.rtl]}>{displayTitle}</Text>

          <View style={styles.verifiedRow}>
            <CheckCircle2 size={13} color={colors.secondary} />
            <Text style={styles.verifiedText}>Texte certifié · Droit positif marocain</Text>
          </View>
        </View>

        {/* Explanation Card */}
        <View style={styles.card}>
          <Text style={styles.cardTag}>EXPLICATION ACCESSIBLE</Text>
          <Text style={[styles.bodyText, isRTL && styles.rtl]}>{displayExplanation}</Text>
        </View>

        {/* Protected Rights */}
        {document.rightsConcerned && document.rightsConcerned.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTag}>DROITS PROTÉGÉS PAR LA LOI</Text>
            <View style={styles.rightsWrap}>
              {document.rightsConcerned.map((right: string, i: number) => (
                <View key={i} style={styles.rightBadge}>
                  <Text style={styles.rightBadgeText}>✓  {right}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Actionable Steps */}
        {document.possibleSteps && document.possibleSteps.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTag}>DÉMARCHES OFFICIELLES RECOMMANDÉES</Text>
            <View style={styles.stepsStack}>
              {document.possibleSteps.map((s: any, idx: number) => (
                <View key={idx} style={styles.stepRow}>
                  <View style={styles.stepNum}>
                    <Text style={styles.stepNumText}>{s.step || idx + 1}</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>{s.title}</Text>
                    <Text style={styles.stepDesc}>{s.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Official Source Link */}
        {document.sourceUrl && (
          <TouchableOpacity
            style={styles.sourceBtn}
            onPress={() => Linking.openURL(document.sourceUrl)}
            activeOpacity={0.85}
          >
            <ExternalLink size={15} color={colors.white} />
            <Text style={styles.sourceBtnText}>
              Consulter la publication officielle sur Adala Justice
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 14 },
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

  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 22,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lawPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lawPillText: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 0.5,
  },
  articleText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '700',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: -0.4,
    lineHeight: 26,
    marginTop: 4,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.chalk,
    gap: 12,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTag: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1.2,
  },
  bodyText: {
    fontSize: 14,
    color: colors.slate,
    lineHeight: 21,
  },

  rightsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  rightBadge: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  rightBadgeText: {
    fontSize: 12,
    color: colors.secondaryDark,
    fontWeight: '700',
  },

  stepsStack: {
    gap: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepNumText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '900',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.ink,
  },
  stepDesc: {
    fontSize: 12,
    color: colors.mist,
    marginTop: 2,
    lineHeight: 17,
  },

  sourceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  sourceBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
});
