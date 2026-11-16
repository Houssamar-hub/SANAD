import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LogOut } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useApp } from '../store/appStore';

export const QuickExitButton: React.FC = () => {
  const { quickExit, t } = useApp();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={quickExit}
      activeOpacity={0.8}
      accessibilityLabel={t.quickExit}
      accessibilityRole="button"
    >
      <LogOut size={13} color={colors.mist} />
      <Text style={styles.text}>{t.quickExit}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.chalk,
  },
  text: {
    color: colors.slate,
    fontSize: 11,
    fontWeight: '700',
  },
});
