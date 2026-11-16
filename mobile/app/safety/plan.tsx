import React, { useState } from 'react';
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
  CheckCircle2,
  Circle,
  ShieldCheck,
} from 'lucide-react-native';

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
}

const SAFETY_ITEMS: ChecklistItem[] = [
  {
    id: 'place',
    category: 'Lieu de repli',
    title: 'Identifier un refuge sûr accessible 24h/24',
    description: 'Une amie de confiance, de la famille proche, ou l\'adresse d\'un centre d\'hébergement d\'urgence vérifié.',
  },
  {
    id: 'docs',
    category: 'Documents vitaux',
    title: 'Pochette de documents prête',
    description: 'CIN originale ou copies certifiées, livret de famille, carnet de santé des enfants, actes notariés.',
  },
  {
    id: 'emergency_contacts',
    category: 'Mémoire',
    title: 'Mémoriser les numéros clés',
    description: 'Retenir par cœur le 19 (Police urbaine) et 177 (Gendarmerie) au cas où votre téléphone serait inaccessible.',
  },
  {
    id: 'money',
    category: 'Autonomie',
    title: 'Réserve discrète de liquidités',
    description: 'Une petite somme en espèces gardée hors d\'atteinte pour payer un trajet en taxi ou subvenir à l\'immédiat.',
  },
  {
    id: 'code_word',
    category: 'Discrétion',
    title: 'Mot ou code de détresse convenu',
    description: 'Un mot anodin convenu à l\'avance avec une proche qui signifie "Contacte les secours immédiatement pour moi".',
  },
];

export default function SafetyPlanScreen() {
  const router = useRouter();
  const { isRTL } = useApp();
  const [checkedIds, setCheckedIds] = useState<string[]>(['emergency_contacts']);

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
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
          <Text style={styles.pageTag}>ANTICIPATION & PROTECTION</Text>
          <Text style={[styles.pageTitle, isRTL && styles.rtl]}>Plan Personnel de Sécurité</Text>
          <Text style={[styles.pageSub, isRTL && styles.rtl]}>
            Des mesures de prévoyance simples pour réagir avec calme et protéger vos proches.
          </Text>
        </View>

        {/* Confidentiality Reminder */}
        <View style={styles.confidentialStrip}>
          <ShieldCheck size={16} color={colors.secondaryDark} />
          <Text style={styles.confidentialText}>
            Stockage strictement local sur votre appareil. Aucune transmission distante.
          </Text>
        </View>

        {/* Checklist */}
        <View style={styles.checklist}>
          {SAFETY_ITEMS.map((item) => {
            const isChecked = checkedIds.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.itemCard, isChecked && styles.itemCardChecked]}
                onPress={() => toggleCheck(item.id)}
                activeOpacity={0.8}
              >
                <View style={styles.itemHeader}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{item.category}</Text>
                  </View>
                  {isChecked ? (
                    <CheckCircle2 size={22} color={colors.secondaryDark} />
                  ) : (
                    <Circle size={22} color={colors.fog} />
                  )}
                </View>

                <Text style={[styles.itemTitle, isRTL && styles.rtl]}>{item.title}</Text>
                <Text style={[styles.itemDesc, isRTL && styles.rtl]}>{item.description}</Text>
              </TouchableOpacity>
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

  confidentialStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.secondaryLight,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  confidentialText: {
    fontSize: 12,
    color: colors.secondaryDark,
    fontWeight: '700',
    flex: 1,
  },

  checklist: {
    paddingHorizontal: 16,
    marginTop: 14,
    gap: 12,
  },
  itemCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.chalk,
    gap: 6,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  itemCardChecked: {
    backgroundColor: '#F7FCFA',
    borderColor: '#C6F3DE',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -0.2,
  },
  itemDesc: {
    fontSize: 12.5,
    color: colors.mist,
    lineHeight: 18,
  },
});
