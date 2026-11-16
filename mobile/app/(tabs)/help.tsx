import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert,
  TextInput,
} from 'react-native';
import { Header } from '../../src/components/Header';
import { colors } from '../../src/theme/colors';
import { useApp } from '../../src/store/appStore';
import { FALLBACK_CENTERS, apiClient } from '../../src/services/api';
import {
  PhoneCall,
  MapPin,
  CheckCircle2,
  Heart,
  Plus,
  Trash2,
  ShieldAlert,
} from 'lucide-react-native';

const CITIES = ['Toutes', 'Casablanca', 'Rabat', 'Fès', 'Marrakech', 'Tanger', 'Agadir', 'Oujda'];

export default function HelpScreen() {
  const { t, isRTL, trustedContacts, addTrustedContact, removeTrustedContact } = useApp();
  const [selectedCity, setSelectedCity] = useState('Toutes');
  const [centers, setCenters] = useState(FALLBACK_CENTERS);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRel, setNewContactRel] = useState('Proche');

  useEffect(() => {
    const cityParam = selectedCity === 'Toutes' ? 'all' : selectedCity;
    apiClient
      .get(`/centers?city=${cityParam}`)
      .then((res) => {
        if (res.data.centers && res.data.centers.length > 0) {
          setCenters(res.data.centers);
        }
      })
      .catch(() => {
        const filtered =
          selectedCity === 'Toutes'
            ? FALLBACK_CENTERS
            : FALLBACK_CENTERS.filter((c) => c.city.toLowerCase() === selectedCity.toLowerCase());
        setCenters(filtered);
      });
  }, [selectedCity]);

  const confirmCall = (number: string, title: string) => {
    Alert.alert(t.emergencyConfirm, `${title} (${number})`, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.call,
        onPress: () => {
          Linking.openURL(`tel:${number}`).catch(() => {
            Alert.alert('Erreur', "Impossible de lancer l'appel direct sur cet appareil.");
          });
        },
      },
    ]);
  };

  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) {
      Alert.alert('Attention', 'Indiquez un nom et un numéro de téléphone.');
      return;
    }
    addTrustedContact({
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      relationship: newContactRel,
    });
    setNewContactName('');
    setNewContactPhone('');
    setShowAddContact(false);
    Alert.alert('Enregistré', 'Contact de confiance stocké de manière sécurisée sur votre appareil.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTag}>ASSISTANCE D'URGENCE & PROXIMITÉ</Text>
          <Text style={[styles.pageTitle, isRTL && styles.rtl]}>{t.help.title}</Text>
          <Text style={[styles.pageSub, isRTL && styles.rtl]}>{t.help.subtitle}</Text>
        </View>

        {/* ── 3 BIG EMERGENCY CARDS (Inspired by big stats in screenshot) ── */}
        <View style={styles.emergencyCard}>
          <View style={styles.emergencyTopRow}>
            <ShieldAlert size={16} color={colors.terracotta} />
            <Text style={styles.emergencyTitle}>NUMÉROS D'URGENCE NATIONAUX (24H/24)</Text>
          </View>

          <View style={styles.hotlinesRow}>
            {/* Police 19 */}
            <TouchableOpacity
              style={styles.hotlineCol}
              onPress={() => confirmCall('19', 'Police Secours')}
              activeOpacity={0.8}
            >
              <Text style={[styles.hotlineDigit, { color: colors.terracotta }]}>19</Text>
              <Text style={styles.hotlineName}>Police</Text>
              <Text style={styles.hotlineZone}>Ville</Text>
            </TouchableOpacity>

            <View style={styles.hotlineDivider} />

            {/* Gendarmerie 177 */}
            <TouchableOpacity
              style={styles.hotlineCol}
              onPress={() => confirmCall('177', 'Gendarmerie Royale')}
              activeOpacity={0.8}
            >
              <Text style={[styles.hotlineDigit, { color: colors.primary }]}>177</Text>
              <Text style={styles.hotlineName}>Gendarme</Text>
              <Text style={styles.hotlineZone}>Rural</Text>
            </TouchableOpacity>

            <View style={styles.hotlineDivider} />

            {/* Protection Civile 15 */}
            <TouchableOpacity
              style={styles.hotlineCol}
              onPress={() => confirmCall('15', 'Protection Civile')}
              activeOpacity={0.8}
            >
              <Text style={[styles.hotlineDigit, { color: colors.secondaryDark }]}>15</Text>
              <Text style={styles.hotlineName}>Protection</Text>
              <Text style={styles.hotlineZone}>Médical</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── TRUSTED CONTACTS CIRCLE ── */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTagRow}>
            <Heart size={14} color={colors.primary} />
            <Text style={styles.sectionHeading}>CERCLE DE CONFIANCE PRIVÉ</Text>
          </View>
          <Text style={[styles.sectionSubtitle, isRTL && styles.rtl]}>
            Vos contacts d'alerte immédiate enregistrés sur cet appareil.
          </Text>
        </View>

        <View style={styles.trustedContainer}>
          {trustedContacts.map((contact) => (
            <View key={contact.id} style={styles.trustedCard}>
              <View style={styles.trustedAvatar}>
                <Text style={styles.trustedAvatarText}>{contact.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.trustedInfo}>
                <Text style={styles.trustedName}>{contact.name}</Text>
                <Text style={styles.trustedMeta}>
                  {contact.phone} · {contact.relationship}
                </Text>
              </View>
              <View style={styles.trustedActions}>
                <TouchableOpacity
                  style={styles.actionCallBtn}
                  onPress={() => confirmCall(contact.phone, contact.name)}
                >
                  <PhoneCall size={14} color={colors.white} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionDelBtn}
                  onPress={() => removeTrustedContact(contact.id)}
                >
                  <Trash2 size={14} color={colors.mist} />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {showAddContact ? (
            <View style={styles.addForm}>
              <TextInput
                style={styles.formInput}
                placeholder="Prénom ou lien (ex: Mère, Amie Sara)"
                placeholderTextColor={colors.fog}
                value={newContactName}
                onChangeText={setNewContactName}
              />
              <TextInput
                style={styles.formInput}
                placeholder="Numéro de téléphone (ex: 06...)"
                placeholderTextColor={colors.fog}
                keyboardType="phone-pad"
                value={newContactPhone}
                onChangeText={setNewContactPhone}
              />
              <View style={styles.formActions}>
                <TouchableOpacity
                  style={styles.formCancelBtn}
                  onPress={() => setShowAddContact(false)}
                >
                  <Text style={styles.formCancelText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.formSaveBtn} onPress={handleAddContact}>
                  <Text style={styles.formSaveText}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addContactTrigger}
              onPress={() => setShowAddContact(true)}
              activeOpacity={0.8}
            >
              <Plus size={16} color={colors.primary} />
              <Text style={styles.addContactTriggerText}>Ajouter un contact de confiance</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── SUPPORT CENTERS DIRECTORY ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeading}>{t.help.centersTitle.toUpperCase()}</Text>
          <Text style={[styles.sectionSubtitle, isRTL && styles.rtl]}>
            Centres d'écoute et d'accompagnement juridique vérifiés.
          </Text>
        </View>

        {/* City Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cityScroll}
          contentContainerStyle={styles.cityContent}
        >
          {CITIES.map((city) => {
            const active = selectedCity === city;
            return (
              <TouchableOpacity
                key={city}
                style={[styles.cityPill, active && styles.cityPillActive]}
                onPress={() => setSelectedCity(city)}
                activeOpacity={0.8}
              >
                <Text style={[styles.cityPillText, active && styles.cityPillTextActive]}>
                  {city}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Centers Cards */}
        <View style={styles.centersStack}>
          {centers.map((center: any, idx: number) => {
            const displayName = isRTL && center.nameAr ? center.nameAr : center.name;
            const displayAddress = isRTL && center.addressAr ? center.addressAr : center.address;

            return (
              <View key={center._id || idx} style={styles.centerItem}>
                <View style={styles.centerItemHeader}>
                  <View style={styles.cityBadge}>
                    <MapPin size={11} color={colors.primary} />
                    <Text style={styles.cityBadgeText}>{center.city}</Text>
                  </View>
                  <View style={styles.verifiedRow}>
                    <CheckCircle2 size={12} color={colors.secondaryDark} />
                    <Text style={styles.verifiedText}>Vérifié CNDH</Text>
                  </View>
                </View>

                <Text style={[styles.centerName, isRTL && styles.rtl]}>{displayName}</Text>
                <Text style={[styles.centerAddress, isRTL && styles.rtl]}>{displayAddress}</Text>

                {center.services && center.services.length > 0 && (
                  <View style={styles.servicePillGroup}>
                    {center.services.map((srv: string, sIdx: number) => (
                      <View key={sIdx} style={styles.serviceTag}>
                        <Text style={styles.serviceTagText}>{srv}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <TouchableOpacity
                  style={styles.centerCallBtn}
                  onPress={() => confirmCall(center.phone, displayName)}
                  activeOpacity={0.85}
                >
                  <PhoneCall size={14} color={colors.white} />
                  <Text style={styles.centerCallText}>
                    {t.help.callCenter} · {center.phone}
                  </Text>
                </TouchableOpacity>
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

  // BIG EMERGENCY CARD
  emergencyCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.chalk,
    padding: 18,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  emergencyTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  emergencyTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.terracotta,
    letterSpacing: 0.6,
  },
  hotlinesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hotlineCol: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  hotlineDigit: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  hotlineName: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.ink,
    marginTop: 2,
  },
  hotlineZone: {
    fontSize: 11,
    color: colors.mist,
    marginTop: 1,
  },
  hotlineDivider: {
    width: 1,
    height: 42,
    backgroundColor: colors.chalk,
  },

  // TRUSTED CONTACTS
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 10,
  },
  sectionTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.slate,
    letterSpacing: 1,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.mist,
    lineHeight: 17,
  },

  trustedContainer: {
    paddingHorizontal: 16,
    gap: 10,
  },
  trustedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.chalk,
    gap: 12,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  trustedAvatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trustedAvatarText: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primary,
  },
  trustedInfo: { flex: 1 },
  trustedName: { fontSize: 14, fontWeight: '800', color: colors.ink },
  trustedMeta: { fontSize: 12, color: colors.mist, marginTop: 2 },
  trustedActions: { flexDirection: 'row', gap: 8 },
  actionCallBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionDelBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addContactTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    backgroundColor: colors.white,
  },
  addContactTriggerText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },

  addForm: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.chalk,
    gap: 10,
  },
  formInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.ink,
    borderWidth: 1,
    borderColor: colors.chalk,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 4,
  },
  formCancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: colors.background,
  },
  formCancelText: { fontSize: 12, fontWeight: '700', color: colors.mist },
  formSaveBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  formSaveText: { fontSize: 12, fontWeight: '800', color: colors.white },

  cityScroll: { marginTop: 4, marginBottom: 12 },
  cityContent: { paddingHorizontal: 16, gap: 8 },
  cityPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.chalk,
  },
  cityPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  cityPillText: { fontSize: 12, fontWeight: '700', color: colors.slate },
  cityPillTextActive: { color: colors.white },

  centersStack: { paddingHorizontal: 16, gap: 12 },
  centerItem: {
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
  centerItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cityBadgeText: { fontSize: 11, fontWeight: '800', color: colors.primary },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verifiedText: { fontSize: 11, fontWeight: '700', color: colors.secondaryDark },

  centerName: { fontSize: 15, fontWeight: '800', color: colors.ink, marginBottom: 4 },
  centerAddress: { fontSize: 12, color: colors.mist, marginBottom: 10, lineHeight: 17 },

  servicePillGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  serviceTag: {
    backgroundColor: colors.background,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  serviceTagText: { fontSize: 11, fontWeight: '700', color: colors.slate },

  centerCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 11,
    borderRadius: 14,
  },
  centerCallText: { fontSize: 12, fontWeight: '800', color: colors.white },
});
