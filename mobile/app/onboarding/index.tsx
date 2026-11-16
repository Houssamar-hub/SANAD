import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { SanadLogo } from '../../src/components/SanadLogo';
import { Shield, Sparkles, LifeBuoy, ArrowRight, Check } from 'lucide-react-native';

const SLIDES = [
  {
    icon: Shield,
    color: colors.primary,
    bg: colors.primaryLight,
    tag: 'LOI 103-13 & DROIT MAROCAIN',
    title: 'Vos droits ne sont pas négociables.',
    desc: 'Accédez à une information juridique claire, sans jargon administratif. Comprenez exactement ce que la loi marocaine prévoit pour vous protéger.',
  },
  {
    icon: Sparkles,
    color: colors.secondaryDark,
    bg: colors.secondaryLight,
    tag: 'ASSISTANCE JURIDIQUE INTELLIGENTE',
    title: 'Posez vos questions sans tabou.',
    desc: 'Échangez en toute discrétion en français, en arabe ou en Darija marocaine avec un assistant juridique documenté et respectueux de votre anonymat.',
  },
  {
    icon: LifeBuoy,
    color: colors.terracotta,
    bg: colors.terracottaLight,
    tag: 'ACCOMPAGNEMENT DE PROXIMITÉ',
    title: 'Vous n\'êtes jamais seule.',
    desc: 'Accédez en un seul geste aux numéros d\'urgence officiels et aux centres d\'écoute associatifs et institutionnels agréés par le CNDH au Maroc.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  const slide = SLIDES[currentSlide];
  const IconComp = slide.icon;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <SanadLogo size="small" />
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Passer</Text>
          </TouchableOpacity>
        </View>

        {/* Center Presentation */}
        <View style={styles.centerSection}>
          <View style={[styles.iconBox, { backgroundColor: slide.bg }]}>
            <IconComp size={44} color={slide.color} />
          </View>

          <Text style={styles.slideTag}>{slide.tag}</Text>
          <Text style={styles.slideTitle}>{slide.title}</Text>
          <Text style={styles.slideDesc}>{slide.desc}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {/* Minimal line indicators */}
          <View style={styles.indicators}>
            {SLIDES.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  idx === currentSlide && styles.dotActive,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.88}>
            <Text style={styles.nextBtnText}>
              {currentSlide === SLIDES.length - 1 ? 'Commencer maintenant' : 'Continuer'}
            </Text>
            {currentSlide === SLIDES.length - 1 ? (
              <Check size={16} color={colors.white} strokeWidth={2.4} />
            ) : (
              <ArrowRight size={16} color={colors.white} strokeWidth={2.4} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 28,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.mist,
  },

  centerSection: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  iconBox: {
    width: 90,
    height: 90,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  slideTag: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1.4,
    marginBottom: 10,
    textAlign: 'center',
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.ink,
    textAlign: 'center',
    letterSpacing: -0.6,
    lineHeight: 34,
    marginBottom: 14,
  },
  slideDesc: {
    fontSize: 14.5,
    color: colors.slate,
    textAlign: 'center',
    lineHeight: 22,
  },

  footer: {
    gap: 20,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.chalk,
  },
  dotActive: {
    width: 28,
    backgroundColor: colors.primary,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  nextBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
});
