import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from 'react-native';
import { Header } from '../../src/components/Header';
import { colors } from '../../src/theme/colors';
import { useApp } from '../../src/store/appStore';
import { FALLBACK_LEGAL_DOCS, apiClient } from '../../src/services/api';
import {
  Search,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Shield,
} from 'lucide-react-native';

const CATEGORIES = [
  { id: 'all', label: 'Toutes les lois' },
  { id: 'droits_fondamentaux', label: 'Loi 103-13' },
  { id: 'cyberharcelement', label: 'Cyberharcèlement' },
  { id: 'harcelement', label: 'Harcèlement' },
  { id: 'acces_justice', label: 'Famille & Droits' },
  { id: 'violence_economique', label: 'Violence Économique' },
];

export default function LegalLibraryScreen() {
  const { t, isRTL } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [documents, setDocuments] = useState(FALLBACK_LEGAL_DOCS);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .get(`/legal?category=${selectedCategory}&search=${encodeURIComponent(search)}`)
      .then((res) => {
        if (res.data.documents && res.data.documents.length > 0) {
          setDocuments(res.data.documents);
        }
      })
      .catch(() => {
        const filtered = FALLBACK_LEGAL_DOCS.filter((d) => {
          const matchCat = selectedCategory === 'all' || d.category === selectedCategory;
          const matchSearch =
            !search ||
            d.title.toLowerCase().includes(search.toLowerCase()) ||
            d.simplifiedExplanation.toLowerCase().includes(search.toLowerCase());
          return matchCat && matchSearch;
        });
        setDocuments(filtered);
      });
  }, [selectedCategory, search]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* TOP TITLE BANNER */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTag}>DROITS & TEXTES LÉGISLATIFS</Text>
          <Text style={[styles.pageTitle, isRTL && styles.rtl]}>{t.legal.title}</Text>
          <Text style={[styles.pageSub, isRTL && styles.rtl]}>{t.legal.subtitle}</Text>
        </View>

        {/* SEARCH BAR (Modern Rounded) */}
        <View style={styles.searchRow}>
          <Search size={18} color={colors.primary} />
          <TextInput
            style={[styles.searchInput, isRTL && styles.rtl]}
            placeholder={t.legal.searchPlaceholder}
            placeholderTextColor={colors.fog}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* CATEGORIES PILLS (Modern Rounded Tabs) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.catScroll}
          contentContainerStyle={styles.catContent}
        >
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catPill, active && styles.catPillActive]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.catPillText, active && styles.catPillTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* VERIFIED BANNER */}
        <View style={styles.verifiedRow}>
          <CheckCircle2 size={14} color={colors.secondaryDark} />
          <Text style={styles.verifiedText}>{t.legal.verifiedBy}</Text>
        </View>

        {/* DOCUMENTS LIST */}
        <View style={styles.list}>
          {documents.map((doc: any, index: number) => {
            const id = doc._id || String(index);
            const isExpanded = expandedId === id;
            const displayTitle = isRTL && doc.titleAr ? doc.titleAr : doc.title;
            const displayExplanation =
              isRTL && doc.simplifiedExplanationAr
                ? doc.simplifiedExplanationAr
                : doc.simplifiedExplanation;

            return (
              <View key={id} style={styles.card}>
                <TouchableOpacity
                  onPress={() => toggleExpand(id)}
                  activeOpacity={0.8}
                >
                  {/* Card top badges */}
                  <View style={styles.cardBadgeRow}>
                    <View style={styles.lawBadge}>
                      <Shield size={12} color={colors.primary} />
                      <Text style={styles.lawBadgeText}>{doc.lawNumber}</Text>
                    </View>
                    {doc.articleNumber && (
                      <Text style={styles.articleText}>{doc.articleNumber}</Text>
                    )}
                  </View>

                  <Text style={[styles.docTitle, isRTL && styles.rtl]}>{displayTitle}</Text>

                  <Text
                    style={[styles.docBody, isRTL && styles.rtl]}
                    numberOfLines={isExpanded ? undefined : 3}
                  >
                    {displayExplanation}
                  </Text>

                  <View style={styles.cardFooter}>
                    <Text style={styles.cardToggleText}>
                      {isExpanded ? 'Moins de détails' : 'Démarches & Sources officielles'}
                    </Text>
                    {isExpanded ? (
                      <ChevronUp size={16} color={colors.primary} />
                    ) : (
                      <ChevronDown size={16} color={colors.primary} />
                    )}
                  </View>
                </TouchableOpacity>

                {/* EXPANDED DETAILS */}
                {isExpanded && (
                  <View style={styles.expanded}>
                    {doc.rightsConcerned && doc.rightsConcerned.length > 0 && (
                      <View style={styles.subsection}>
                        <Text style={styles.subLabel}>{t.legal.rightsConcerned}</Text>
                        <View style={styles.pillsRow}>
                          {doc.rightsConcerned.map((right: string, i: number) => (
                            <View key={i} style={styles.rightPill}>
                              <Text style={styles.rightPillText}>✓ {right}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    {doc.possibleSteps && doc.possibleSteps.length > 0 && (
                      <View style={styles.subsection}>
                        <Text style={styles.subLabel}>{t.legal.stepsToTake}</Text>
                        {doc.possibleSteps.map((s: any, idx: number) => (
                          <View key={idx} style={styles.stepRow}>
                            <View style={styles.stepNum}>
                              <Text style={styles.stepNumText}>{s.step || idx + 1}</Text>
                            </View>
                            <View style={styles.stepText}>
                              <Text style={styles.stepTitle}>{s.title}</Text>
                              <Text style={styles.stepDesc}>{s.description}</Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}

                    {doc.sourceUrl && (
                      <TouchableOpacity
                        style={styles.sourceBtn}
                        onPress={() => Linking.openURL(doc.sourceUrl)}
                        activeOpacity={0.8}
                      >
                        <ExternalLink size={14} color={colors.primary} />
                        <Text style={styles.sourceBtnText}>
                          Consulter sur Adala (Ministère de la Justice)
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
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

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.chalk,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.ink,
  },

  catScroll: { marginTop: 12 },
  catContent: { paddingHorizontal: 16, gap: 8 },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.chalk,
  },
  catPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.slate,
  },
  catPillTextActive: { color: colors.white },

  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    marginTop: 14,
    marginBottom: 2,
  },
  verifiedText: {
    fontSize: 11,
    color: colors.secondaryDark,
    fontWeight: '700',
  },

  list: { paddingHorizontal: 16, marginTop: 10, gap: 12 },

  card: {
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
  cardBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  lawBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  lawBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },
  articleText: {
    fontSize: 11,
    color: colors.mist,
    fontWeight: '700',
  },
  docTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 6,
    lineHeight: 21,
  },
  docBody: {
    fontSize: 13,
    color: colors.slate,
    lineHeight: 19,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.chalk,
  },
  cardToggleText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },

  expanded: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.chalk,
    gap: 14,
  },
  subsection: { gap: 8 },
  subLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.mist,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  rightPill: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rightPillText: { fontSize: 11, color: colors.secondaryDark, fontWeight: '700' },

  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  stepNumText: { color: colors.white, fontSize: 11, fontWeight: '800' },
  stepText: { flex: 1 },
  stepTitle: { fontSize: 13, fontWeight: '700', color: colors.ink },
  stepDesc: { fontSize: 12, color: colors.mist, marginTop: 2, lineHeight: 17 },

  sourceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primaryLight,
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  sourceBtnText: { fontSize: 12, fontWeight: '800', color: colors.primary },
});
