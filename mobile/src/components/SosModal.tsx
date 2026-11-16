import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { PhoneCall, AlertTriangle, X, Send, Heart } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useApp } from '../store/appStore';
import * as Location from 'expo-location';

const HOTLINES = [
  { number: '19', label: 'Police Secours', sub: 'Zone urbaine · Gratuit 24h/24', color: colors.terracotta },
  { number: '177', label: 'Gendarmerie Royale', sub: 'Zone rurale & axes routiers', color: colors.primary },
  { number: '15', label: 'Protection Civile', sub: 'Ambulances & urgences médicales', color: colors.secondary },
];

export const SosModal: React.FC = () => {
  const { sosModalVisible, closeSos, t, trustedContacts } = useApp();
  const [sharingLocation, setSharingLocation] = useState(false);

  const confirmCall = (number: string, label: string) => {
    Alert.alert(
      t.emergencyConfirm,
      `${label} — ${number}`,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.call,
          style: 'destructive',
          onPress: () => {
            Linking.openURL(`tel:${number}`).catch(() => {
              Alert.alert('Erreur', `Impossible de composer le ${number}.`);
            });
          },
        },
      ]
    );
  };

  const alertTrustedContact = async (phone: string, name: string) => {
    let message = `URGENCE SANAD : J'ai besoin d'aide immédiatement. Merci de me contacter ou de prévenir les secours.`;
    try {
      setSharingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        const mapsUrl = `https://maps.google.com/?q=${loc.coords.latitude},${loc.coords.longitude}`;
        message += `\nMa position : ${mapsUrl}`;
      }
    } catch (e) {
      // silent
    } finally {
      setSharingLocation(false);
    }
    const sep = Platform.OS === 'ios' ? '&' : '?';
    const url = `sms:${phone}${sep}body=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => Alert.alert('Info', 'Impossible d\'ouvrir l\'application SMS.'));
  };

  return (
    <Modal visible={sosModalVisible} transparent animationType="slide" onRequestClose={closeSos}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.topRow}>
            <View>
              <Text style={styles.sheetTitle}>Urgence SOS</Text>
              <Text style={styles.sheetSub}>Appels directs et assistance immédiate</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={closeSos}>
              <X size={18} color={colors.mist} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            {HOTLINES.map((h) => (
              <TouchableOpacity
                key={h.number}
                style={styles.hotlineRow}
                onPress={() => confirmCall(h.number, h.label)}
                activeOpacity={0.8}
              >
                <View style={[styles.numBox, { backgroundColor: h.color }]}>
                  <Text style={styles.numText}>{h.number}</Text>
                </View>
                <View style={styles.hotlineInfo}>
                  <Text style={styles.hotlineLabel}>{h.label}</Text>
                  <Text style={styles.hotlineSub}>{h.sub}</Text>
                </View>
                <View style={[styles.callPill, { backgroundColor: h.color }]}>
                  <PhoneCall size={14} color={colors.white} />
                  <Text style={styles.callPillText}>Appel</Text>
                </View>
              </TouchableOpacity>
            ))}

            {trustedContacts.length > 0 && (
              <View style={styles.trustedBlock}>
                <View style={styles.sectionLabel}>
                  <Heart size={14} color={colors.primary} />
                  <Text style={styles.sectionLabelText}>Contacts de confiance</Text>
                </View>
                {trustedContacts.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    style={styles.contactRow}
                    onPress={() => alertTrustedContact(c.phone, c.name)}
                  >
                    <View style={styles.contactInitial}>
                      <Text style={styles.contactInitialText}>{c.name.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactName}>{c.name}</Text>
                      <Text style={styles.contactPhone}>{c.phone} · {c.relationship}</Text>
                    </View>
                    <View style={styles.smsPill}>
                      <Send size={13} color={colors.primary} />
                      <Text style={styles.smsPillText}>SMS</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.disclaimer}>
              <AlertTriangle size={13} color={colors.fog} />
              <Text style={styles.disclaimerText}>
                SANAD ne compose aucun appel sans votre confirmation préalable.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 28, 61, 0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 36,
    maxHeight: '90%',
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.chalk,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.ink,
    letterSpacing: -0.4,
  },
  sheetSub: {
    fontSize: 13,
    color: colors.mist,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 0,
  },
  hotlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.chalk,
  },
  numBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '900',
  },
  hotlineInfo: {
    flex: 1,
  },
  hotlineLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
  },
  hotlineSub: {
    fontSize: 11,
    color: colors.mist,
    marginTop: 2,
  },
  callPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  callPillText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  trustedBlock: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.chalk,
  },
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  sectionLabelText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.slate,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.chalk,
  },
  contactInitial: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInitialText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.ink,
  },
  contactPhone: {
    fontSize: 12,
    color: colors.mist,
  },
  smsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  smsPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 14,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: colors.mist,
    lineHeight: 16,
  },
});
