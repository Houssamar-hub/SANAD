import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ChefHat } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useApp } from '../store/appStore';

export const QuickExitButton: React.FC = () => {
  const { panicExit } = useApp();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={panicExit}
      activeOpacity={0.8}
      accessibilityLabel="Sortie rapide vers recettes"
      accessibilityRole="button"
    >
      <ChefHat size={14} color="#D97706" />
      <Text style={styles.text}>Recettes</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  text: {
    color: '#B45309',
    fontSize: 11,
    fontWeight: '800',
  },
});
