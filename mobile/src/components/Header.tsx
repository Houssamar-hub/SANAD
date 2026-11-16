import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SanadLogo } from './SanadLogo';
import { QuickExitButton } from './QuickExitButton';
import { colors } from '../theme/colors';
import { useApp } from '../store/appStore';
import { Globe, AlertCircle } from 'lucide-react-native';

export const Header: React.FC = () => {
  const { language, setLanguage, openSos, isRTL } = useApp();

  const cycleLanguage = () => {
    if (language === 'fr') setLanguage('ar');
    else if (language === 'ar') setLanguage('darija');
    else setLanguage('fr');
  };

  const getLangBadge = () => {
    if (language === 'fr') return 'FR';
    if (language === 'ar') return 'عربي';
    return 'دارجة';
  };

  return (
    <View style={[styles.header, isRTL && styles.rtlRow]}>
      <SanadLogo size="small" />

      <View style={styles.actions}>
        {/* Language selector in modern lavender pill */}
        <TouchableOpacity
          style={styles.langBtn}
          onPress={cycleLanguage}
          activeOpacity={0.75}
          accessibilityLabel="Changer la langue"
        >
          <Globe size={13} color={colors.primary} />
          <Text style={styles.langText}>{getLangBadge()}</Text>
        </TouchableOpacity>

        {/* SOS button */}
        <TouchableOpacity
          style={styles.sosBtn}
          onPress={openSos}
          activeOpacity={0.8}
          accessibilityLabel="SOS urgence"
        >
          <Text style={styles.sosBtnText}>SOS</Text>
        </TouchableOpacity>

        {/* Quick Exit */}
        <QuickExitButton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.chalk,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
  },
  langText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  sosBtn: {
    backgroundColor: colors.terracotta,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: colors.terracotta,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  sosBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
