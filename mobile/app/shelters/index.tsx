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
import { FALLBACK_SAFE_HOUSES, MOROCCAN_REGIONS, apiClient } from '../../src/services/api';
import {
  ArrowLeft,
  Home,
  ShieldCheck,
  PhoneCall,
  Search,
  Lock,
  AlertCircle,
  Building,
  CheckCircle2,
  Clock,
  RotateCcw,
} from 'lucide-react-native';

export default function SafeHousesScreen() {
  const router = useRouter();
  const { isRTL, t } = useApp();
  const [shelters, setShelters] = useState(FALLBACK_SAFE_HOUSES);
  const [selectedRegion, setSelectedRegion] = useState('Toutes les régions');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const regionParam = selectedRegion !== 'Toutes les régions' ? `?region=${encodeURIComponent(selectedRegion)}` : '';
    apiClient
      .get(`/shelters${regionParam}`)
      .then((res) => {
        if (res.data?.shelters && res.data.shelters.length > 0) {
          setShelters(res.data.shelters);
        }
      })
      .catch(() => {
        let filtered = [...FALLBACK_SAFE_HOUSES];
        if (selectedRegion !== 'Toutes les régions') {
          filtered = filtered.filter(
            (s) => s.region.toLowerCase() === selectedRegion.toLowerCase()
          );
        }
        setShelters(filtered);
      });
  }, [selectedRegion]);

  const confirmCall = (number: string, title: string) => {
    Alert.alert(
      t.emergencyConfirm,
      `Permanence d'orientation : ${title} (${number})`,
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

  const filteredShelters = shelters.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.partnerOrg.toLowerCase().includes(q)
    );
  });

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
            <View style={styles.homeBadge}>
              <Home size={20} color={colors.secondaryDark} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pageTitle}>Dar L-Aman · دار الأمان</Text>
              <Text style={styles.pageSub}>
                Réseau national d'hébergement d'urgence et de mise en sécurité pour les femmes et enfants.
              </Text>
            </View>
          </View>
        </View>

        {/* Strict Confidentiality Protocol Banner */}
        <View style={styles.protocolBox}>
          <Lock size={18} color="#0369A1" style={{ marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.protocolTitle}>Protocole de Haute Sécurité & Confidentialité</Text>
            <Text style={styles.protocolText}>
              Pour préserver l'intégrité physique absolue des pensionnaires et de leurs enfants, l'adresse géographique exacte des foyers d'accueil n'est jamais divulguée publiquement. L'admission d'urgence s'effectue exclusivement via la permanence téléphonique de l'organisation partenaire agréée ou réquisition judiciaire (Loi 103-13).
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={16} color={colors.mist} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher par ville ou organisation partenaire..."
            placeholderTextColor={colors.fog}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* 12 Regions Filter */}
        <View style={styles.regionSection}>
          <Text style={styles.sectionLabel}>RÉGIONS DU ROYAUME (12 RÉGIONS)</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.regionScroll}
          >
            {MOROCCAN_REGIONS.map((region) => {
              const active = selectedRegion === region;
              return (
                <TouchableOpacity
                  key={region}
                  style={[styles.regionPill, active && styles.regionPillActive]}
                  onPress={() => setSelectedRegion(region)}
                >
                  <Text style={[styles.regionPillText, active && styles.regionPillTextActive]}>
                    {region}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* List of Shelters */}
        <View style={styles.listHeader}>
          <Text style={styles.listHeading}>STRUCTURES AGRÉÉES ({filteredShelters.length})</Text>
          {selectedRegion !== 'Toutes les régions' && (
            <TouchableOpacity onPress={() => setSelectedRegion('Toutes les régions')}>
              <Text style={styles.resetText}>Réinitialiser</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.shelterStack}>
          {filteredShelters.map((item) => (
            <View key={item._id} style={styles.shelterCard}>
              <View style={styles.cardHeader}>
                <View style={styles.badgeRow}>
                  <View style={styles.cityBadge}>
                    <Text style={styles.cityBadgeText}>{item.city}</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <CheckCircle2 size={11} color="#15803D" />
                    <Text style={styles.statusBadgeText}>Capacité active</Text>
                  </View>
                </View>

                <View style={styles.verifiedRow}>
                  <ShieldCheck size={13} color={colors.secondaryDark} />
                  <Text style={styles.verifiedText}>Agréé CNDH</Text>
                </View>
              </View>

              <Text style={styles.shelterName}>{item.name}</Text>
              <Text style={styles.shelterNameAr}>{item.nameAr}</Text>

              <View style={styles.partnerRow}>
                <Building size={13} color={colors.primary} />
                <Text style={styles.partnerText}>Organisme gestionnaire : {item.partnerOrg}</Text>
              </View>

              <View style={styles.referralBox}>
                <Text style={styles.referralTitle}>Procédure d'admission :</Text>
                <Text style={styles.referralText}>{item.referralProcess}</Text>
              </View>

              {item.services && (
                <View style={styles.servicesRow}>
                  {item.services.map((srv: string, idx: number) => (
                    <View key={idx} style={styles.servicePill}>
                      <Text style={styles.servicePillText}>{srv}</Text>
                    </View>
                  ))}
                </View>
              )}

              <Text style={styles.confidentialFootnote}>
                🔒 {item.confidentialityNotice}
              </Text>

              {/* Call Hotline CTA */}
              <TouchableOpacity
                style={styles.callHotlineBtn}
                onPress={() => confirmCall(item.referralHotline, item.name)}
                activeOpacity={0.85}
              >
                <PhoneCall size={14} color={colors.white} />
                <Text style={styles.callHotlineBtnText}>
                  Permanence d'admission · {item.referralHotline}
                </Text>
              </TouchableOpacity>
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
  homeBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: { fontSize: 20, fontWeight: '900', color: colors.ink },
  pageSub: { fontSize: 12, color: colors.mist, marginTop: 2, lineHeight: 17 },

  protocolBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#E0F2FE',
    marginHorizontal: 16,
    marginTop: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  protocolTitle: { fontSize: 12, fontWeight: '800', color: '#0369A1', marginBottom: 2 },
  protocolText: { fontSize: 11, color: '#0C4A6E', lineHeight: 17 },

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

  regionSection: { marginTop: 14 },
  sectionLabel: { fontSize: 10, fontWeight: '900', color: colors.mist, letterSpacing: 1, marginHorizontal: 20, marginBottom: 6 },
  regionScroll: { paddingHorizontal: 16, gap: 8 },
  regionPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.chalk,
  },
  regionPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  regionPillText: { fontSize: 12, fontWeight: '700', color: colors.slate },
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
  resetText: { fontSize: 11, fontWeight: '700', color: colors.primary },

  shelterStack: { paddingHorizontal: 16, gap: 14 },
  shelterCard: {
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
  badgeRow: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  cityBadge: { backgroundColor: colors.primaryLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  cityBadgeText: { fontSize: 11, fontWeight: '800', color: colors.primary },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: { fontSize: 10, fontWeight: '800', color: '#15803D' },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verifiedText: { fontSize: 11, fontWeight: '700', color: colors.secondaryDark },

  shelterName: { fontSize: 15, fontWeight: '800', color: colors.ink },
  shelterNameAr: { fontSize: 12, color: colors.mist, marginTop: 2, marginBottom: 8 },

  partnerRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  partnerText: { fontSize: 11, color: colors.slate, fontWeight: '700' },

  referralBox: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  referralTitle: { fontSize: 10, fontWeight: '800', color: colors.mist, marginBottom: 2 },
  referralText: { fontSize: 11, color: colors.ink, lineHeight: 16 },

  servicesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  servicePill: { backgroundColor: colors.chalk, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  servicePillText: { fontSize: 10, fontWeight: '700', color: colors.slate },

  confidentialFootnote: { fontSize: 10, color: colors.mist, fontStyle: 'italic', marginBottom: 14, lineHeight: 15 },

  callHotlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.secondaryDark,
    paddingVertical: 12,
    borderRadius: 14,
  },
  callHotlineBtnText: { fontSize: 12, fontWeight: '800', color: colors.white },
});
