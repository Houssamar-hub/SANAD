import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface SanadLogoProps {
  size?: 'small' | 'medium' | 'large';
  lightMode?: boolean;
}

export const SanadLogo: React.FC<SanadLogoProps> = ({ size = 'medium', lightMode = false }) => {
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  const markSize = isSmall ? 30 : isLarge ? 48 : 38;
  const latinSize = isSmall ? 18 : isLarge ? 28 : 22;
  const arabicSize = isSmall ? 13 : isLarge ? 20 : 16;

  const textColor = lightMode ? colors.white : colors.ink;
  const markBg = lightMode ? 'rgba(255,255,255,0.2)' : colors.primaryLight;
  const markText = lightMode ? colors.white : colors.primary;

  return (
    <View style={styles.root}>
      {/* Modern Squircle Badge */}
      <View
        style={[
          styles.mark,
          {
            width: markSize,
            height: markSize,
            borderRadius: markSize * 0.35,
            backgroundColor: markBg,
          },
        ]}
      >
        <Text style={[styles.markLetter, { fontSize: markSize * 0.52, color: markText }]}>
          س
        </Text>
      </View>

      <View style={styles.textCol}>
        <View style={styles.nameRow}>
          <Text style={[styles.latinName, { fontSize: latinSize, color: textColor }]}>
            SANAD
          </Text>
          <View style={styles.dot} />
          <Text style={[styles.arabicName, { fontSize: arabicSize, color: lightMode ? 'rgba(255,255,255,0.9)' : colors.primary }]}>
            سند
          </Text>
        </View>
        {!isSmall && (
          <Text
            style={[
              styles.tagline,
              { color: lightMode ? 'rgba(255,255,255,0.75)' : colors.mist },
            ]}
          >
            DROITS · PROTECTION · ACCOMPAGNEMENT
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mark: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  markLetter: {
    fontWeight: '900',
    marginTop: -2,
  },
  textCol: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  latinName: {
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.secondary,
  },
  arabicName: {
    fontWeight: '800',
  },
  tagline: {
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginTop: 1,
  },
});
