import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
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
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Lock,
} from 'lucide-react-native';

interface IncidentEntry {
  id: string;
  type: string;
  description: string;
  location: string;
  date: string;
}

const INCIDENT_TYPES = [
  'Cyberharcèlement / Chantage',
  'Harcèlement de rue',
  'Menaces verbales',
  'Violence conjugale',
  'Autre fait',
];

export default function EvidenceScreen() {
  const router = useRouter();
  const { isRTL } = useApp();

  const [entries, setEntries] = useState<IncidentEntry[]>([
    {
      id: '1',
      type: 'Cyberharcèlement / Chantage',
      description:
        'Réception de messages anonymes exigeant la suppression d\'une publication sous menace de diffamation. Captures d\'écran horodatées conservées.',
      location: 'En ligne (Instagram)',
      date: 'Hier, 18:45',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState(INCIDENT_TYPES[0]);
  const [desc, setDesc] = useState('');
  const [location, setLocation] = useState('');

  const handleSaveEntry = () => {
    if (!desc.trim()) {
      Alert.alert('Précision requise', 'Veuillez décrire brièvement les faits survenus.');
      return;
    }

    const newEntry: IncidentEntry = {
      id: Date.now().toString(),
      type: selectedType,
      description: desc.trim(),
      location: location.trim() || 'Non spécifié',
      date: new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setEntries((prev) => [newEntry, ...prev]);
    setDesc('');
    setLocation('');
    setShowAddModal(false);
    Alert.alert('Consigné', 'Fait enregistré dans votre journal confidentiel.');
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Suppression définitive',
      'Confirmez-vous la suppression irréversible de cette note ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => setEntries((prev) => prev.filter((e) => e.id !== id)),
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
          <Text style={styles.pageTag}>MÉMOIRE & PREUVES</Text>
          <Text style={[styles.pageTitle, isRTL && styles.rtl]}>Journal Privé des Faits</Text>
          <Text style={[styles.pageSub, isRTL && styles.rtl]}>
            Consignez méthodiquement dates, contextes et propos pour appuyer tout éventuel recours légal.
          </Text>
        </View>

        {/* Security strip */}
        <View style={styles.securityStrip}>
          <Lock size={15} color={colors.primary} />
          <Text style={styles.securityText}>
            Stockage confidentiel local sur ce téléphone. Aucun accès cloud distant.
          </Text>
        </View>

        {/* Add trigger or form */}
        {showAddModal ? (
          <View style={styles.formCard}>
            <Text style={styles.formHeading}>Consigner un nouvel événement</Text>

            <Text style={styles.fieldLabel}>NATURE DE L'INCIDENT</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.typeScroll}
              contentContainerStyle={{ gap: 6 }}
            >
              {INCIDENT_TYPES.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typePill, selectedType === t && styles.typePillActive]}
                  onPress={() => setSelectedType(t)}
                >
                  <Text
                    style={[styles.typePillText, selectedType === t && styles.typePillTextActive]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.fieldLabel}>DESCRIPTION DÉTAILLÉE</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Chronologie exacte, mots employés, témoins, captures…"
              placeholderTextColor={colors.fog}
              value={desc}
              onChangeText={setDesc}
              multiline
              numberOfLines={4}
            />

            <Text style={styles.fieldLabel}>LIEU OU CANAL (OPTIONNEL)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex : Boulevard Zerktouni, ou Messagerie Instagram"
              placeholderTextColor={colors.fog}
              value={location}
              onChangeText={setLocation}
            />

            <View style={styles.formBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelBtnText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEntry}>
                <Text style={styles.saveBtnText}>Consigner</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowAddModal(true)}
            activeOpacity={0.85}
          >
            <Plus size={16} color={colors.white} strokeWidth={2.4} />
            <Text style={styles.addBtnText}>Ajouter une note d'incident</Text>
          </TouchableOpacity>
        )}

        {/* Entries list */}
        <View style={styles.entriesStack}>
          {entries.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Aucun fait consigné dans ce journal.</Text>
            </View>
          ) : (
            entries.map((entry) => (
              <View key={entry.id} style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <View style={styles.entryBadge}>
                    <Text style={styles.entryBadgeText}>{entry.type}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDelete(entry.id)}
                    style={styles.delBtn}
                  >
                    <Trash2 size={15} color={colors.terracotta} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.entryDesc}>{entry.description}</Text>

                <View style={styles.entryMeta}>
                  <View style={styles.metaRow}>
                    <Calendar size={13} color={colors.mist} />
                    <Text style={styles.metaText}>{entry.date}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <MapPin size={13} color={colors.mist} />
                    <Text style={styles.metaText}>{entry.location}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
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

  securityStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primaryLight,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  securityText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
    flex: 1,
  },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 13,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  addBtnText: {
    color: colors.white,
    fontSize: 13.5,
    fontWeight: '800',
  },

  formCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.chalk,
    marginHorizontal: 16,
    marginTop: 16,
    gap: 8,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  formHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.mist,
    letterSpacing: 0.8,
    marginTop: 4,
  },
  typeScroll: {
    marginVertical: 4,
  },
  typePill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.chalk,
  },
  typePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typePillText: {
    fontSize: 11.5,
    color: colors.slate,
    fontWeight: '700',
  },
  typePillTextActive: {
    color: colors.white,
  },
  textArea: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: colors.ink,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.chalk,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.ink,
    borderWidth: 1,
    borderColor: colors.chalk,
  },
  formBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  cancelBtn: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: colors.background,
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.mist,
  },
  saveBtn: {
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  saveBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.white,
  },

  entriesStack: {
    paddingHorizontal: 16,
    marginTop: 14,
    gap: 12,
  },
  emptyState: {
    paddingVertical: 36,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: colors.fog,
  },

  entryCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.chalk,
    gap: 8,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  entryBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.4,
  },
  delBtn: {
    padding: 4,
  },
  entryDesc: {
    fontSize: 13.5,
    color: colors.slate,
    lineHeight: 19,
  },
  entryMeta: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.chalk,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 11.5,
    color: colors.mist,
  },
});
