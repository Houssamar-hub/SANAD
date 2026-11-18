import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import { colors } from '../../src/theme/colors';
import { useApp } from '../../src/store/appStore';
import { FALLBACK_OPPORTUNITIES, MOROCCAN_REGIONS, apiClient } from '../../src/services/api';
import {
  ArrowLeft,
  Briefcase,
  TrendingUp,
  Search,
  Building,
  PhoneCall,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Scissors,
  Utensils,
  Laptop,
  Coins,
} from 'lucide-react-native';

const CATEGORIES = [
  { id: 'all', label: 'Toutes les filières', icon: Briefcase },
  { id: 'couture_confection', label: 'Couture & Modélisme', icon: Scissors },
  { id: 'cuisine_traiteur', label: 'Cuisine & Pâtisserie', icon: Utensils },
  { id: 'artisanat_cooperative', label: 'Artisanat & Coopératives', icon: Sparkles },
  { id: 'microfinance_forsa', label: 'Financement & Microcrédit', icon: Coins },
  { id: 'teletravail', label: 'Télétravail & Numérique', icon: Laptop },
];

export default function EmpowermentScreen() {
  const router = useRouter();
  const { isRTL, t } = useApp();
  const [opportunities, setOpportunities] = useState(FALLBACK_OPPORTUNITIES);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('Toutes les régions');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.append('category', selectedCategory);
    if (selectedRegion !== 'Toutes les régions') params.append('region', selectedRegion);
    if (searchQuery.trim()) params.append('search', searchQuery.trim());

    const queryString = params.toString() ? `?${params.toString()}` : '';

    apiClient
      .get(`/opportunities${queryString}`)
      .then((res) => {
        if (res.data?.opportunities && res.data.opportunities.length > 0) {
          setOpportunities(res.data.opportunities);
        }
      })
      .catch(() => {
        let filtered = [...FALLBACK_OPPORTUNITIES];
        if (selectedCategory !== 'all') {
          filtered = filtered.filter((o) => o.category === selectedCategory);
        }
        if (selectedRegion !== 'Toutes les régions') {
          filtered = filtered.filter(
            (o) => o.region.includes(selectedRegion) || o.region.includes('Toutes')
          );
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          filtered = filtered.filter(
            (o) =>
              o.title.toLowerCase().includes(q) ||
              o.description.toLowerCase().includes(q) ||
              o.organization.toLowerCase().includes(q)
          );
        }
        setOpportunities(filtered);
      });
  }, [selectedCategory, selectedRegion, searchQuery]);

  const confirmCall = (number: string, orgName: string) => {
    Alert.alert(
      'Candidature & Renseignements',
      `Appeler ${orgName} (${number}) ?`,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.call,
          onPress: () => {
            Linking.openURL(`tel:${number}`).catch(() => {
              Alert.alert('Erreur', 'Impossible de passer l\'appel sur cet appareil.');
            });
          },
        },
      ]
    );
  };

  const openLink = (url: string) => {
    if (!url) return;
    Linking.openURL(url).catch(() => {
      Alert.alert('Erreur', 'Impossible d\'ouvrir le lien.');
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Back and Page Header */}
        <View style={styles.pageHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={16} color={colors.ink} />
            <Text style={styles.backBtnText}>Retour</Text>
          </TouchableOpacity>

          <View style={styles.headerTitleRow}>
            <View style={styles.badgeIcon}>
              <TrendingUp size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pageTitle}>Autonomie & Emploi · تمكين</Text>
              <Text style={styles.pageSub}>
                Formations certifiées, coopératives féminines, emplois et financements publics (Forsa, INDH).
              </Text>
            </View>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Search size={16} color={colors.mist} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une formation, un métier, une ville..."
            placeholderTextColor={colors.fog}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categories Pills */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionLabel}>FILIÈRES D'ACTIVITÉ</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterPillScroll}
          >
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              const IconComp = cat.icon;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.filterPill, active && styles.filterPillActive]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <IconComp size={13} color={active ? colors.white : colors.slate} />
                  <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Regions Horizontal Pills */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionLabel}>RÉGION DU MAROC</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterPillScroll}
          >
            {MOROCCAN_REGIONS.map((reg) => {
              const active = selectedRegion === reg;
              return (
                <TouchableOpacity
                  key={reg}
                  style={[styles.regionPill, active && styles.regionPillActive]}
                  onPress={() => setSelectedRegion(reg)}
                >
                  <Text style={[styles.regionPillText, active && styles.regionPillTextActive]}>
                    {reg}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Opportunities List */}
        <View style={styles.listHeader}>
          <Text style={styles.listHeading}>OPPORTUNITÉS VÉRIFIÉES ({opportunities.length})</Text>
          {(selectedCategory !== 'all' || selectedRegion !== 'Toutes les régions') && (
            <TouchableOpacity
              onPress={() => {
                setSelectedCategory('all');
                setSelectedRegion('Toutes les régions');
              }}
            >
              <Text style={styles.resetBtnText}>Réinitialiser</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.oppStack}>
          {opportunities.map((item) => (
            <View key={item._id} style={styles.oppCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cityBadge}>
                  <Text style={styles.cityBadgeText}>{item.city}</Text>
                </View>
                <View style={styles.verifiedBadge}>
                  <ShieldCheck size={12} color={colors.secondaryDark} />
                  <Text style={styles.verifiedBadgeText}>Vérifié INDH / CNDH</Text>
                </View>
              </View>

              <Text style={styles.oppTitle}>{item.title}</Text>
              <Text style={styles.oppTitleAr}>{item.titleAr}</Text>

              <View style={styles.orgRow}>
                <Building size={13} color={colors.primary} />
                <Text style={styles.orgText}>{item.organization}</Text>
              </View>

              <Text style={styles.oppDesc}>{item.description}</Text>

              <View style={styles.stipendBox}>
                <Text style={styles.stipendLabel}>Avantages & Rémunération :</Text>
                <Text style={styles.stipendVal}>{item.stipendOrSalary}</Text>
              </View>

              {/* Actions */}
              <View style={styles.oppActions}>
                <TouchableOpacity
                  style={styles.callBtn}
                  onPress={() => confirmCall(item.contactPhone, item.organization)}
                  activeOpacity={0.85}
                >
                  <PhoneCall size={13} color={colors.white} />
                  <Text style={styles.callBtnText}>Postuler / Contacter</Text>
                </TouchableOpacity>

                {item.officialLink ? (
                  <TouchableOpacity
                    style={styles.linkBtn}
                    onPress={() => openLink(item.officialLink)}
                    activeOpacity={0.8}
                  >
                    <ExternalLink size={13} color={colors.primary} />
                    <Text style={styles.linkBtnText}>Site officiel</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32 },

  pageHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.chalk,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  backBtnText: { fontSize: 13, fontWeight: '700', color: colors.ink },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  badgeIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: { fontSize: 20, fontWeight: '900', color: colors.ink },
  pageSub: { fontSize: 12, color: colors.mist, marginTop: 2, lineHeight: 17 },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.chalk,
    height: 46,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13, color: colors.ink },

  filterSection: { marginTop: 14 },
  sectionLabel: { fontSize: 10, fontWeight: '900', color: colors.mist, letterSpacing: 1, marginHorizontal: 20, marginBottom: 6 },
  filterPillScroll: { paddingHorizontal: 16, gap: 8 },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.chalk,
  },
  filterPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterPillText: { fontSize: 12, fontWeight: '700', color: colors.slate },
  filterPillTextActive: { color: colors.white },

  regionPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.chalk,
  },
  regionPillActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  regionPillText: { fontSize: 11, fontWeight: '700', color: colors.slate },
  regionPillTextActive: { color: colors.white },

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 22,
    marginBottom: 10,
  },
  listHeading: { fontSize: 11, fontWeight: '900', color: colors.slate, letterSpacing: 1 },
  resetBtnText: { fontSize: 11, fontWeight: '700', color: colors.primary },

  oppStack: { paddingHorizontal: 16, gap: 14 },
  oppCard: {
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cityBadge: { backgroundColor: colors.primaryLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  cityBadgeText: { fontSize: 11, fontWeight: '800', color: colors.primary },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verifiedBadgeText: { fontSize: 11, fontWeight: '700', color: colors.secondaryDark },

  oppTitle: { fontSize: 15, fontWeight: '800', color: colors.ink },
  oppTitleAr: { fontSize: 12, color: colors.mist, marginTop: 2, marginBottom: 8 },

  orgRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  orgText: { fontSize: 11, color: colors.slate, fontWeight: '700' },

  oppDesc: { fontSize: 12, color: colors.slate, lineHeight: 17, marginBottom: 12 },

  stipendBox: {
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginBottom: 14,
  },
  stipendLabel: { fontSize: 10, fontWeight: '800', color: '#166534' },
  stipendVal: { fontSize: 12, fontWeight: '800', color: '#15803D', marginTop: 2 },

  oppActions: { flexDirection: 'row', gap: 10 },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 11,
    borderRadius: 12,
  },
  callBtnText: { fontSize: 12, fontWeight: '800', color: colors.white },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.chalk,
  },
  linkBtnText: { fontSize: 11, fontWeight: '700', color: colors.ink },
});
