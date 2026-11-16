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
import { FALLBACK_QUIZZES } from '../../src/services/api';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  BookOpen,
} from 'lucide-react-native';

export default function QuizScreen() {
  const router = useRouter();
  const { t, isRTL } = useApp();
  const quiz = FALLBACK_QUIZZES[0];
  const questions = quiz.questions;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === currentQuestion.correctAnswerIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header />

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={16} color={colors.primary} strokeWidth={2.4} />
          <Text style={styles.backBtnText}>Accueil</Text>
        </TouchableOpacity>
        <Text style={styles.progressCounter}>
          Question {currentIndex + 1} / {questions.length}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {!isFinished ? (
          <View style={styles.quizCard}>
            {/* Minimal line progress */}
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${((currentIndex + 1) / questions.length) * 100}%` },
                ]}
              />
            </View>

            <Text style={styles.quizTag}>TESTEZ VOS CONNAISSANCES JURIDIQUES</Text>

            <Text style={[styles.questionText, isRTL && styles.rtl]}>
              {isRTL && currentQuestion.questionAr
                ? currentQuestion.questionAr
                : currentQuestion.question}
            </Text>

            {/* Options */}
            <View style={styles.optionsStack}>
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctAnswerIndex;

                let cardStyle: any = styles.optionCard;
                let textStyle: any = styles.optionText;

                if (showExplanation) {
                  if (isCorrect) {
                    cardStyle = styles.optionCorrect;
                    textStyle = styles.optionTextCorrect;
                  } else if (isSelected) {
                    cardStyle = styles.optionWrong;
                    textStyle = styles.optionTextWrong;
                  }
                }

                return (
                  <TouchableOpacity
                    key={idx}
                    style={cardStyle}
                    onPress={() => handleSelectOption(idx)}
                    activeOpacity={0.8}
                  >
                    <Text style={[textStyle, isRTL && styles.rtl]}>
                      {isRTL && opt.textAr ? opt.textAr : opt.text}
                    </Text>

                    {showExplanation && isCorrect && (
                      <CheckCircle2 size={18} color={colors.secondaryDark} />
                    )}
                    {showExplanation && isSelected && !isCorrect && (
                      <XCircle size={18} color={colors.terracotta} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Explanation */}
            {showExplanation && (
              <View style={styles.explanationBox}>
                <View style={styles.explanationHeader}>
                  <BookOpen size={14} color={colors.primary} />
                  <Text style={styles.explanationTitle}>{t.quiz.explanationTitle}</Text>
                </View>
                <Text style={[styles.explanationText, isRTL && styles.rtl]}>
                  {currentQuestion.explanation}
                </Text>

                <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                  <Text style={styles.nextBtnText}>
                    {currentIndex + 1 < questions.length ? t.quiz.next : t.quiz.seeResults}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          /* Finished Result Screen */
          <View style={styles.resultCard}>
            <View style={styles.awardCircle}>
              <Award size={48} color={colors.primary} />
            </View>
            <Text style={styles.resultTag}>SESSION TERMINÉE</Text>
            <Text style={styles.scoreDisplay}>
              {score} <Text style={styles.scoreTotal}>/ {questions.length}</Text>
            </Text>
            <Text style={styles.resultComment}>
              {score >= 2
                ? 'Excellente maîtrise des principes clés de la loi marocaine (Loi 103-13 et Code Pénal).'
                : 'Poursuivez votre découverte : la bibliothèque juridique SANAD vous aide à connaître vos droits au quotidien.'}
            </Text>

            <TouchableOpacity style={styles.retryBtn} onPress={handleRestart}>
              <RotateCcw size={15} color={colors.white} />
              <Text style={styles.retryBtnText}>{t.quiz.retry}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.browseLegalBtn}
              onPress={() => router.push('/(tabs)/legal')}
            >
              <Text style={styles.browseLegalText}>Consulter les textes de loi</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: 16 },
  rtl: { textAlign: 'right' },

  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.chalk,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
  progressCounter: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.mist,
  },

  quizCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.chalk,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  progressTrack: {
    height: 5,
    backgroundColor: colors.background,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 18,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  quizTag: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.ink,
    lineHeight: 25,
    marginBottom: 20,
    letterSpacing: -0.3,
  },

  optionsStack: { gap: 10 },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.chalk,
  },
  optionCorrect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.secondaryLight,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.secondary,
  },
  optionWrong: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.terracottaLight,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.terracotta,
  },
  optionText: {
    flex: 1,
    fontSize: 13.5,
    color: colors.slate,
    fontWeight: '600',
    lineHeight: 18,
  },
  optionTextCorrect: {
    flex: 1,
    fontSize: 13.5,
    color: colors.secondaryDark,
    fontWeight: '800',
    lineHeight: 18,
  },
  optionTextWrong: {
    flex: 1,
    fontSize: 13.5,
    color: colors.terracotta,
    fontWeight: '800',
    lineHeight: 18,
  },

  explanationBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 16,
    marginTop: 18,
    gap: 10,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  explanationTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  explanationText: {
    fontSize: 13,
    color: colors.ink,
    lineHeight: 19,
  },
  nextBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  nextBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },

  resultCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.chalk,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  awardCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTag: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.mist,
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  scoreDisplay: {
    fontSize: 46,
    fontWeight: '900',
    color: colors.ink,
    letterSpacing: -1,
  },
  scoreTotal: {
    fontSize: 24,
    color: colors.fog,
    fontWeight: '700',
  },
  resultComment: {
    fontSize: 13,
    color: colors.mist,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 12,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    width: '100%',
    marginBottom: 10,
  },
  retryBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
  browseLegalBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  browseLegalText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
});
