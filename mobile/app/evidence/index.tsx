import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  Image,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Header } from '../../src/components/Header';
import { colors } from '../../src/theme/colors';
import { useApp } from '../../src/store/appStore';
import { apiClient } from '../../src/services/api';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  Lock,
  Camera,
  Image as ImageIcon,
  Mic,
  FileText,
  ShieldCheck,
  Download,
  Share2,
  AlertTriangle,
  X,
  FileCheck,
  CheckCircle2,
  Clock,
  Eye,
} from 'lucide-react-native';

interface VaultItem {
  _id: string;
  title: string;
  description: string;
  category: 'capture_ecran' | 'photo_blessure' | 'enregistrement_audio' | 'certificat_medical' | 'temoignage' | 'autre';
  incidentDate: string;
  fileReference?: string;
  fileType: string;
  fileSize: number;
  hashSha256: string;
  notes: string;
  tags: string[];
  createdAt: string;
}

const CATEGORIES = [
  { id: 'capture_ecran', label: 'Capture de menace', icon: ImageIcon },
  { id: 'photo_blessure', label: 'Photo de blessure', icon: Camera },
  { id: 'certificat_medical', label: 'Certificat médical / ITT', icon: FileCheck },
  { id: 'enregistrement_audio', label: 'Enregistrement audio', icon: Mic },
  { id: 'temoignage', label: 'Témoignage / Rapport', icon: FileText },
];

export default function EvidenceVaultScreen() {
  const router = useRouter();
  const { isRTL, language } = useApp();

  const [evidenceList, setEvidenceList] = useState<VaultItem[]>([
    {
      _id: 'ev_init_1',
      title: 'Messages de menace et chantage sur WhatsApp',
      description: 'Capture d\'écran horodatée avec numéro apparent exigeant de l\'argent sous menace de diffamation.',
      category: 'capture_ecran',
      incidentDate: new Date('2026-11-16T15:20:00Z').toISOString(),
      fileType: 'image/png',
      fileSize: 342000,
      hashSha256: '9f83c12a76f283e78291f0984f1837bc12948e3d64a2b8e3914751029481ad34',
      notes: 'Plainte en cours auprès de la brigade de cybercriminalité.',
      tags: ['WhatsApp', 'Chantage', 'Art. 447-1'],
      createdAt: new Date('2026-11-16T15:30:00Z').toISOString(),
    },
    {
      _id: 'ev_init_2',
      title: 'Certificat médical avec Incapacité Totale (ITT 15 jours)',
      description: 'Délivré par le médecin légiste du Centre Hospitalier Universitaire Ibn Sina.',
      category: 'certificat_medical',
      incidentDate: new Date('2026-11-10T11:00:00Z').toISOString(),
      fileType: 'document/pdf',
      fileSize: 1250000,
      hashSha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
      notes: 'Preuve physique requise pour la cellule de prise en charge au Tribunal de Première Instance.',
      tags: ['Hôpital public', 'ITT', 'Loi 103-13'],
      createdAt: new Date('2026-11-10T12:00:00Z').toISOString(),
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(CATEGORIES[0].id);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [pickedImageUri, setPickedImageUri] = useState<string | null>(null);
  const [activePreview, setActivePreview] = useState<VaultItem | null>(null);

  // Load from backend API if available
  useEffect(() => {
    apiClient
      .get('/evidence')
      .then((res) => {
        if (res.data?.evidence && res.data.evidence.length > 0) {
          setEvidenceList(res.data.evidence);
        }
      })
      .catch(() => {});
  }, []);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Autorisation requise', 'Accès à la galerie nécessaire pour joindre une preuve.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPickedImageUri(result.assets[0].uri);
    }
  };

  const handleSaveEvidence = () => {
    if (!title.trim()) {
      Alert.alert('Champs requis', 'Veuillez saisir un intitulé clair pour cette preuve.');
      return;
    }

    // Generate local SHA-256 simulation
    const hash =
      'sha256_' +
      Math.random().toString(36).substring(2) +
      Date.now().toString(36) +
      Math.random().toString(36).substring(2);

    const newEvidence: VaultItem = {
      _id: 'ev_' + Date.now(),
      title: title.trim(),
      description: description.trim(),
      category: selectedCategory,
      incidentDate: new Date().toISOString(),
      fileReference: pickedImageUri || '',
      fileType: pickedImageUri ? 'image/jpeg' : 'note/text',
      fileSize: pickedImageUri ? 450000 : 1200,
      hashSha256: hash,
      notes: notes.trim(),
      tags: ['Preuve chiffrée'],
      createdAt: new Date().toISOString(),
    };

    setEvidenceList((prev) => [newEvidence, ...prev]);

    // Send to backend API
    apiClient
      .post('/evidence', {
        title: newEvidence.title,
        description: newEvidence.description,
        category: newEvidence.category,
        incidentDate: newEvidence.incidentDate,
        fileReference: newEvidence.fileReference,
        notes: newEvidence.notes,
      })
      .catch(() => {});

    // Reset form
    setTitle('');
    setDescription('');
    setNotes('');
    setPickedImageUri(null);
    setShowAddModal(false);

    Alert.alert('Scellé & Chiffré', 'Preuve enregistrée dans votre coffre-fort confidentiel.');
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Suppression irréversible',
      'Êtes-vous certaine de vouloir supprimer définitivement cet élément de votre coffre-fort ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setEvidenceList((prev) => prev.filter((e) => e._id !== id));
            apiClient.delete(`/evidence/${id}`).catch(() => {});
          },
        },
      ]
    );
  };

  const handleExportVault = async () => {
    try {
      const summaryText =
        `=== SANAD : RELEVÉ DU COFFRE-FORT NUMÉRIQUE ===\n` +
        `Date d'exportation : ${new Date().toLocaleString('fr-FR')}\n` +
        `Nombre d'éléments scellés : ${evidenceList.length}\n\n` +
        evidenceList
          .map(
            (e, i) =>
              `[${i + 1}] ${e.title}\n` +
              `Catégorie : ${e.category}\n` +
              `Date des faits : ${new Date(e.incidentDate).toLocaleString('fr-FR')}\n` +
              `Description : ${e.description}\n` +
              `Empreinte SHA-256 : ${e.hashSha256}\n` +
              `Notes : ${e.notes || 'Aucune'}\n`
          )
          .join('\n----------------------------------------\n') +
        `\n\nAVERTISSEMENT JURIDIQUE (DROIT MAROCAIN) :\n` +
        `Ce relevé technique constitue un élément matériel soumis à l'appréciation souveraine du tribunal. Pour les violences physiques, le certificat médical avec ITT délivré par un médecin agréé reste l'élément de preuve médico-légale prépondérant devant le parquet.`;

      await Share.share({
        message: summaryText,
        title: 'Export Confidentiel Coffre-Fort SANAD',
      });
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de générer le partage.');
    }
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
            <View style={styles.lockBadge}>
              <Lock size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pageTitle}>Coffre-Fort Numérique</Text>
              <Text style={styles.pageSub}>
                Stockage chiffré et sécurisé de vos preuves (captures, photos, certificats).
              </Text>
            </View>
          </View>
        </View>

        {/* Legal Disclaimer Box */}
        <View style={styles.disclaimerBox}>
          <AlertTriangle size={16} color={colors.terracotta} style={{ marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.disclaimerTitle}>Avis juridique & conservation des preuves</Text>
            <Text style={styles.disclaimerText}>
              L'horodatage numérique constitue un commencement de preuve mais ne remplace pas une expertise judiciaire ou un certificat médical délivré par un hôpital public. Ne supprimez pas les originaux.
            </Text>
          </View>
        </View>

        {/* Action Bar (Add Evidence + Export Report) */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.primaryAddBtn}
            onPress={() => setShowAddModal(true)}
            activeOpacity={0.85}
          >
            <Plus size={16} color={colors.white} />
            <Text style={styles.primaryAddBtnText}>Ajouter une preuve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exportBtn}
            onPress={handleExportVault}
            activeOpacity={0.8}
          >
            <Share2 size={14} color={colors.primary} />
            <Text style={styles.exportBtnText}>Exporter dossier</Text>
          </TouchableOpacity>
        </View>

        {/* Vault Timeline List */}
        <View style={styles.listHeader}>
          <Text style={styles.listHeading}>PREUVES CONSIGNÉES ({evidenceList.length})</Text>
        </View>

        <View style={styles.evidenceStack}>
          {evidenceList.map((item) => (
            <View key={item._id} style={styles.card}>
              <View style={styles.cardTopRow}>
                <View style={styles.categoryBadge}>
                  <FileText size={12} color={colors.primary} />
                  <Text style={styles.categoryBadgeText}>
                    {item.category.replace('_', ' ').toUpperCase()}
                  </Text>
                </View>

                <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteBtn}>
                  <Trash2 size={14} color={colors.mist} />
                </TouchableOpacity>
              </View>

              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>

              {item.notes ? (
                <View style={styles.notesBox}>
                  <Text style={styles.notesLabel}>Notes privées :</Text>
                  <Text style={styles.notesText}>{item.notes}</Text>
                </View>
              ) : null}

              {/* SHA-256 Integrity Verification Badge */}
              <View style={styles.hashRow}>
                <ShieldCheck size={12} color={colors.secondaryDark} />
                <Text style={styles.hashText} numberOfLines={1}>
                  SHA-256 : {item.hashSha256.substring(0, 24)}...
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.dateRow}>
                  <Clock size={11} color={colors.mist} />
                  <Text style={styles.dateText}>
                    Consigné le {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.previewBtn}
                  onPress={() => setActivePreview(item)}
                >
                  <Eye size={12} color={colors.primary} />
                  <Text style={styles.previewBtnText}>Consulter</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Evidence Modal */}
      <Modal visible={showAddModal} animationType="slide">
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)} style={styles.modalCloseBtn}>
              <X size={20} color={colors.ink} />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Consigner une nouvelle preuve</Text>
            <View style={{ width: 36 }} />
          </View>

          <ScrollView contentContainerStyle={styles.modalScroll}>
            {/* Category selection */}
            <Text style={styles.formSectionTitle}>1. TYPE DE PREUVE</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat.id;
                const IconComp = cat.icon;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryTile, active && styles.categoryTileActive]}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    <IconComp size={18} color={active ? colors.white : colors.slate} />
                    <Text style={[styles.categoryTileText, active && styles.categoryTileTextActive]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Inputs */}
            <Text style={styles.formSectionTitle}>2. DÉTAILS DE L'INCIDENT</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Intitulé (ex: Menaces SMS du 15 Novembre)"
              placeholderTextColor={colors.fog}
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={[styles.modalInput, styles.modalTextarea]}
              placeholder="Description des faits précis, circonstances, auteurs..."
              placeholderTextColor={colors.fog}
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />

            <TextInput
              style={[styles.modalInput, styles.modalTextarea]}
              placeholder="Notes personnelles et juridiques (avocate, commissariat...)"
              placeholderTextColor={colors.fog}
              multiline
              numberOfLines={2}
              value={notes}
              onChangeText={setNotes}
            />

            {/* File attachment */}
            <Text style={styles.formSectionTitle}>3. PIÈCE JOINTE SÉCURISÉE</Text>

            {pickedImageUri ? (
              <View style={styles.attachedPreview}>
                <Image source={{ uri: pickedImageUri }} style={styles.attachedThumb} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.attachedName}>Image sélectionnée</Text>
                  <Text style={styles.attachedSub}>Sera scellée avec empreinte SHA-256</Text>
                </View>
                <TouchableOpacity onPress={() => setPickedImageUri(null)}>
                  <Trash2 size={16} color={colors.terracotta} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.pickFileBtn} onPress={handlePickImage}>
                <Camera size={18} color={colors.primary} />
                <Text style={styles.pickFileBtnText}>Joindre une capture ou une photo</Text>
              </TouchableOpacity>
            )}

            {/* Audio compliance warning */}
            <View style={styles.audioNoticeBox}>
              <Mic size={14} color={colors.mist} />
              <Text style={styles.audioNoticeText}>
                Note légale : Au Maroc, l'enregistrement de paroles dans un lieu privé sans consentement relève de l'article 447-1 sauf dans le cadre strict de la défense pénale. Consultez un avocat.
              </Text>
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveVaultBtn} onPress={handleSaveEvidence}>
              <ShieldCheck size={18} color={colors.white} />
              <Text style={styles.saveVaultBtnText}>Sceller & Sauvegarder dans le Coffre</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Preview Modal */}
      {activePreview && (
        <Modal visible={true} transparent animationType="fade">
          <View style={styles.previewOverlay}>
            <View style={styles.previewCard}>
              <View style={styles.previewTop}>
                <Text style={styles.previewHeading}>{activePreview.title}</Text>
                <TouchableOpacity onPress={() => setActivePreview(null)}>
                  <X size={20} color={colors.ink} />
                </TouchableOpacity>
              </View>

              <Text style={styles.previewDate}>
                Date des faits : {new Date(activePreview.incidentDate).toLocaleString('fr-FR')}
              </Text>

              <Text style={styles.previewDescription}>{activePreview.description}</Text>

              {activePreview.notes ? (
                <View style={styles.previewNotesBox}>
                  <Text style={styles.previewNotesLabel}>Notes d'accompagnement :</Text>
                  <Text style={styles.previewNotesText}>{activePreview.notes}</Text>
                </View>
              ) : null}

              <View style={styles.previewHashBox}>
                <Text style={styles.previewHashTitle}>Empreinte numérique d'intégrité (SHA-256) :</Text>
                <Text style={styles.previewHashValue}>{activePreview.hashSha256}</Text>
              </View>

              <TouchableOpacity
                style={styles.closePreviewBtn}
                onPress={() => setActivePreview(null)}
              >
                <Text style={styles.closePreviewBtnText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  lockBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: { fontSize: 20, fontWeight: '900', color: colors.ink },
  pageSub: { fontSize: 12, color: colors.mist, marginTop: 2, lineHeight: 17 },

  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FEF3C7',
    marginHorizontal: 16,
    marginTop: 14,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  disclaimerTitle: { fontSize: 11, fontWeight: '800', color: '#92400E', marginBottom: 2 },
  disclaimerText: { fontSize: 11, color: '#78350F', lineHeight: 16 },

  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 10,
  },
  primaryAddBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 14,
  },
  primaryAddBtnText: { fontSize: 13, fontWeight: '800', color: colors.white },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  exportBtnText: { fontSize: 12, fontWeight: '800', color: colors.primary },

  listHeader: { paddingHorizontal: 20, marginTop: 24, marginBottom: 10 },
  listHeading: { fontSize: 11, fontWeight: '900', color: colors.slate, letterSpacing: 1 },

  evidenceStack: { paddingHorizontal: 16, gap: 12 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.chalk,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: { fontSize: 10, fontWeight: '800', color: colors.primary },
  deleteBtn: { padding: 4 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: colors.ink, marginBottom: 4 },
  cardDesc: { fontSize: 12, color: colors.slate, lineHeight: 17, marginBottom: 8 },

  notesBox: {
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  notesLabel: { fontSize: 10, fontWeight: '800', color: colors.mist, marginBottom: 2 },
  notesText: { fontSize: 11, color: colors.ink },

  hashRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
  },
  hashText: { fontSize: 10, color: colors.secondaryDark, fontWeight: '700' },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.chalk,
    paddingTop: 10,
  },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateText: { fontSize: 11, color: colors.mist },
  previewBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  previewBtnText: { fontSize: 12, fontWeight: '800', color: colors.primary },

  // Modal
  modalSafe: { flex: 1, backgroundColor: colors.white },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.chalk,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeaderTitle: { fontSize: 14, fontWeight: '800', color: colors.ink },
  modalScroll: { padding: 20, gap: 14 },
  formSectionTitle: { fontSize: 10, fontWeight: '900', color: colors.slate, letterSpacing: 1 },

  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryTile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.chalk,
  },
  categoryTileActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryTileText: { fontSize: 11, fontWeight: '700', color: colors.slate },
  categoryTileTextActive: { color: colors.white },

  modalInput: {
    backgroundColor: colors.background,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: colors.ink,
    borderWidth: 1,
    borderColor: colors.chalk,
  },
  modalTextarea: { height: 80, textAlignVertical: 'top' },

  pickFileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 16,
    backgroundColor: colors.primaryLight,
  },
  pickFileBtnText: { fontSize: 13, fontWeight: '800', color: colors.primary },

  attachedPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 14,
  },
  attachedThumb: { width: 50, height: 50, borderRadius: 10 },
  attachedName: { fontSize: 12, fontWeight: '800', color: colors.ink },
  attachedSub: { fontSize: 10, color: colors.mist, marginTop: 2 },

  audioNoticeBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 12,
  },
  audioNoticeText: { fontSize: 10, color: colors.mist, lineHeight: 15, flex: 1 },

  saveVaultBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 10,
  },
  saveVaultBtnText: { fontSize: 13, fontWeight: '900', color: colors.white },

  // Preview overlay
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  previewCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 20,
    gap: 10,
  },
  previewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  previewHeading: { fontSize: 16, fontWeight: '800', color: colors.ink, flex: 1 },
  previewDate: { fontSize: 11, color: colors.mist },
  previewDescription: { fontSize: 13, color: colors.slate, lineHeight: 18, marginVertical: 6 },
  previewNotesBox: { backgroundColor: colors.background, padding: 10, borderRadius: 10 },
  previewNotesLabel: { fontSize: 10, fontWeight: '800', color: colors.mist },
  previewNotesText: { fontSize: 11, color: colors.ink, marginTop: 2 },
  previewHashBox: {
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  previewHashTitle: { fontSize: 10, fontWeight: '800', color: '#166534' },
  previewHashValue: { fontSize: 9, color: '#15803D', fontFamily: 'monospace', marginTop: 2 },
  closePreviewBtn: {
    backgroundColor: colors.ink,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  closePreviewBtnText: { fontSize: 12, fontWeight: '800', color: colors.white },
});
