import React, { useState, useEffect } from 'react';
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
import { apiClient } from '../../src/services/api';
import {
  ArrowLeft,
  Shield,
  Building,
  Home,
  Briefcase,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Lock,
  RotateCcw,
  Activity,
  Users,
} from 'lucide-react-native';

export default function AdminDashboardScreen() {
  const router = useRouter();

  const [stats, setStats] = useState({
    totalCenters: 32,
    totalShelters: 5,
    totalOpportunities: 6,
    totalLegalDocs: 14,
    regionsCovered: 12,
    activeHotlines: 3,
    safetyComplianceStatus: '100% Vérifié CNDH & Adala',
    privacyPolicyCompliance: 'Loi 09-08 (CNDP Maroc)',
  });

  const [auditLogs, setAuditLogs] = useState<any[]>([
    { id: '1', action: 'DISCREET_MODE_ENTERED', module: 'auth', severity: 'info', time: 'Il y a 10 min' },
    { id: '2', action: 'VAULT_HASH_INTEGRITY_CHECK', module: 'vault', severity: 'info', time: 'Il y a 25 min' },
    { id: '3', action: 'DAR_LAMAN_REFERRAL_HOTLINE_PING', module: 'shelter', severity: 'info', time: 'Il y a 1h' },
    { id: '4', action: 'SOS_MODAL_VIEWED', module: 'sos', severity: 'warning', time: 'Il y a 2h' },
  ]);

  useEffect(() => {
    apiClient
      .get('/admin/stats')
      .then((res) => {
        if (res.data?.stats) {
          setStats(res.data.stats);
        }
      })
      .catch(() => {});
  }, []);

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
            <View style={styles.shieldBadge}>
              <Shield size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pageTitle}>Administration & Audit</Text>
              <Text style={styles.pageSub}>
                Supervision des organismes vérifiés, traçabilité et conformité CNDP / Loi 09-08.
              </Text>
            </View>
          </View>
        </View>

        {/* Zero Personal Survivor Identity Banner */}
        <View style={styles.privacyBanner}>
          <Lock size={16} color="#15803D" style={{ marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.privacyBannerTitle}>Protection Absolue de l'Identité des Survivantes</Text>
            <Text style={styles.privacyBannerText}>
              Conformément à la charte déontologique SANAD et aux recommandations du CNDH, aucune donnée nominative ou sensible d'utilisatrice n'est accessible dans cette interface. Seules des statistiques consolidées et des journaux d'audit anonymisés sont présentés.
            </Text>
          </View>
        </View>

        {/* Big Metrics Grid */}
        <Text style={styles.sectionHeading}>TABLEAU DE BORD OPÉRATIONNEL</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Building size={18} color={colors.primary} />
            <Text style={styles.statNumber}>{stats.totalCenters}</Text>
            <Text style={styles.statLabel}>Associations & Cellules</Text>
          </View>

          <View style={styles.statCard}>
            <Home size={18} color={colors.secondaryDark} />
            <Text style={styles.statNumber}>{stats.totalShelters}</Text>
            <Text style={styles.statLabel}>Foyers d'Hébergement</Text>
          </View>

          <View style={styles.statCard}>
            <Briefcase size={18} color="#D97706" />
            <Text style={styles.statNumber}>{stats.totalOpportunities}</Text>
            <Text style={styles.statLabel}>Programmes Autonomie</Text>
          </View>

          <View style={styles.statCard}>
            <FileText size={18} color="#7C3AED" />
            <Text style={styles.statNumber}>{stats.totalLegalDocs}</Text>
            <Text style={styles.statLabel}>Textes & Lois 103-13</Text>
          </View>
        </View>

        {/* Verification Status Card */}
        <View style={styles.complianceCard}>
          <View style={styles.complianceRow}>
            <CheckCircle2 size={16} color="#15803D" />
            <Text style={styles.complianceTitle}>Statut de Conformité Légale</Text>
          </View>

          <View style={styles.complianceItem}>
            <Text style={styles.complianceItemLabel}>Régions administratives couvertes :</Text>
            <Text style={styles.complianceItemVal}>12 / 12 Régions (100%)</Text>
          </View>

          <View style={styles.complianceItem}>
            <Text style={styles.complianceItemLabel}>Conformité données personnelles :</Text>
            <Text style={styles.complianceItemVal}>Loi 09-08 / CNDP Maroc</Text>
          </View>

          <View style={styles.complianceItem}>
            <Text style={styles.complianceItemLabel}>Sources juridiques indexées :</Text>
            <Text style={styles.complianceItemVal}>Portail Officiel Adala (Ministère Justice)</Text>
          </View>
        </View>

        {/* Audit Trail */}
        <Text style={styles.sectionHeading}>JOURNAL D'AUDIT SÉCURISÉ & INTÉGRITÉ</Text>

        <View style={styles.logStack}>
          {auditLogs.map((log) => (
            <View key={log.id} style={styles.logCard}>
              <View style={styles.logTop}>
                <View style={styles.logTag}>
                  <Text style={styles.logTagText}>{log.module.toUpperCase()}</Text>
                </View>
                <Text style={styles.logTime}>{log.time}</Text>
              </View>
              <Text style={styles.logAction}>{log.action}</Text>
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
  shieldBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: { fontSize: 20, fontWeight: '900', color: colors.ink },
  pageSub: { fontSize: 12, color: colors.mist, marginTop: 2, lineHeight: 17 },

  privacyBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F0FDF4',
    marginHorizontal: 16,
    marginTop: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  privacyBannerTitle: { fontSize: 12, fontWeight: '800', color: '#166534', marginBottom: 2 },
  privacyBannerText: { fontSize: 11, color: '#15803D', lineHeight: 16 },

  sectionHeading: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.slate,
    letterSpacing: 1,
    marginHorizontal: 20,
    marginTop: 22,
    marginBottom: 10,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.chalk,
    gap: 4,
  },
  statNumber: { fontSize: 24, fontWeight: '900', color: colors.ink, marginTop: 6 },
  statLabel: { fontSize: 11, color: colors.mist, fontWeight: '700' },

  complianceCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.chalk,
    gap: 10,
  },
  complianceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  complianceTitle: { fontSize: 13, fontWeight: '800', color: '#166534' },
  complianceItem: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.chalk, paddingTop: 8 },
  complianceItemLabel: { fontSize: 11, color: colors.mist },
  complianceItemVal: { fontSize: 11, fontWeight: '700', color: colors.ink },

  logStack: { paddingHorizontal: 16, gap: 10 },
  logCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.chalk,
    gap: 6,
  },
  logTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logTag: { backgroundColor: colors.primaryLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  logTagText: { fontSize: 9, fontWeight: '800', color: colors.primary },
  logTime: { fontSize: 10, color: colors.mist },
  logAction: { fontSize: 12, fontWeight: '700', color: colors.ink },
});
