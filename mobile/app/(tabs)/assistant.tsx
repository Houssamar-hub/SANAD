import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Header } from '../../src/components/Header';
import { colors } from '../../src/theme/colors';
import { useApp } from '../../src/store/appStore';
import { apiClient } from '../../src/services/api';
import {
  Send,
  Sparkles,
  PhoneCall,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Info,
} from 'lucide-react-native';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  isEmergency?: boolean;
  sources?: Array<{ title: string; lawNumber?: string; url?: string }>;
  timestamp: Date;
}

export default function AssistantScreen() {
  const { t, isRTL, language, openSos } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'assistant',
      text: t.assistant.welcome,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<any>(null);

  const sendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText.trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const res = await apiClient.post('/ai/chat', { message: query, language });
      const data = res.data;
      setMessages((prev) => [
        ...prev,
        {
          id: 'ast_' + Date.now(),
          sender: 'assistant',
          text: data.answer,
          isEmergency: data.isEmergency,
          sources: data.sources,
          timestamp: new Date(),
        },
      ]);
    } catch {
      const fallback =
        language === 'ar' || language === 'darija'
          ? `بناءً على القانون المغربي (القانون 103-13) :\n\n1. الحماية : يجرم القانون العنف والتحرش والابتزاز الإلكتروني.\n2. الإجراءات : احتفظي بالأدلة وتوجهي للشرطة (19) أو الدرك (177).\n3. تذكير : هذه المعلومات للإرشاد فقط.`
          : `D'après la législation marocaine (Loi 103-13) :\n\n1. Protection : La loi sanctionne les violences, harcèlement et chantage numérique (Art. 447-1).\n2. Démarches : Conservez les preuves et déposez plainte auprès de la Police (19) ou Gendarmerie (177).\n3. Rappel : Ce conseil est indicatif et ne remplace pas un avocat.`;
      setMessages((prev) => [
        ...prev,
        {
          id: 'ast_err_' + Date.now(),
          sender: 'assistant',
          text: fallback,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 150);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatScroll}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top badge */}
          <View style={styles.topBadge}>
            <Sparkles size={14} color={colors.primary} />
            <Text style={styles.topBadgeText}>
              SmartLegal AI · CNDH Maroc · FR / AR / دارجة
            </Text>
          </View>

          {/* Quick suggestions */}
          {messages.length <= 2 && (
            <View style={styles.suggestionsBlock}>
              <Text style={[styles.suggestionsTitle, isRTL && styles.rtl]}>
                Questions fréquentes :
              </Text>
              {t.assistant.suggestions.map((s: string, i: number) => (
                <TouchableOpacity
                  key={i}
                  style={styles.suggestionChip}
                  onPress={() => sendMessage(s)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.suggestionText, isRTL && styles.rtl]}>
                    « {s} »
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Message bubbles */}
          {messages.map((msg) => {
            const isAI = msg.sender === 'assistant';
            return (
              <View
                key={msg.id}
                style={[
                  styles.bubbleWrap,
                  isAI ? styles.bubbleWrapLeft : styles.bubbleWrapRight,
                ]}
              >
                {isAI && (
                  <View style={styles.aiAvatar}>
                    <Sparkles size={12} color={colors.white} />
                  </View>
                )}
                <View
                  style={[
                    styles.bubble,
                    isAI ? styles.bubbleAI : styles.bubbleUser,
                  ]}
                >
                  {/* Emergency detection badge */}
                  {msg.isEmergency && (
                    <TouchableOpacity style={styles.emergencyBanner} onPress={openSos}>
                      <PhoneCall size={14} color={colors.white} />
                      <Text style={styles.emergencyBannerText}>
                        SITUATION D'URGENCE — Composez le 19 ou le 177
                      </Text>
                    </TouchableOpacity>
                  )}

                  <Text
                    style={[
                      styles.bubbleText,
                      isAI ? styles.bubbleTextAI : styles.bubbleTextUser,
                      isRTL && styles.rtl,
                    ]}
                  >
                    {msg.text}
                  </Text>

                  {/* Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <View style={styles.sources}>
                      <Text style={styles.sourcesLabel}>Sources juridiques :</Text>
                      {msg.sources.map((s, i) => (
                        <Text key={i} style={styles.sourceItem}>
                          • {s.title} {s.lawNumber ? `(${s.lawNumber})` : ''}
                        </Text>
                      ))}
                    </View>
                  )}

                  {/* Feedback actions */}
                  {isAI && (
                    <View style={styles.bubbleActions}>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => Alert.alert('Information', 'Texte copié dans le presse-papiers.')}
                      >
                        <Copy size={12} color={colors.mist} />
                        <Text style={styles.actionBtnText}>{t.assistant.copy}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() =>
                          Alert.alert('Merci !', 'Votre avis aide SANAD à s\'améliorer.')
                        }
                      >
                        <ThumbsUp size={12} color={colors.mist} />
                        <Text style={styles.actionBtnText}>{t.assistant.helpful}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() =>
                          Alert.alert('Merci !', 'Votre avis aide SANAD à s\'améliorer.')
                        }
                      >
                        <ThumbsDown size={12} color={colors.mist} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            );
          })}

          {/* Loading indicator */}
          {loading && (
            <View style={styles.loadingRow}>
              <View style={styles.aiAvatar}>
                <Sparkles size={12} color={colors.white} />
              </View>
              <View style={styles.loadingBubble}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.loadingText}>Analyse juridique des textes marocains…</Text>
              </View>
            </View>
          )}

          {/* Disclaimer */}
          <View style={styles.disclaimerRow}>
            <Info size={13} color={colors.fog} />
            <Text style={styles.disclaimerText}>{t.assistant.disclaimer}</Text>
          </View>
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={[styles.input, isRTL && styles.rtl]}
            placeholder={t.assistant.placeholder}
            placeholderTextColor={colors.fog}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={600}
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              (!inputText.trim() || loading) && styles.sendBtnDisabled,
            ]}
            onPress={() => sendMessage()}
            disabled={!inputText.trim() || loading}
          >
            <Send size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  rtl: { textAlign: 'right' },

  chatScroll: { flex: 1 },
  chatContent: { padding: 16, gap: 4 },

  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 16,
  },
  topBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },

  suggestionsBlock: { marginBottom: 16 },
  suggestionsTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.slate,
    marginBottom: 8,
  },
  suggestionChip: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.chalk,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 6,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  suggestionText: {
    fontSize: 13,
    color: colors.ink,
    fontWeight: '600',
  },

  bubbleWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 10,
  },
  bubbleWrapLeft: { alignSelf: 'flex-start', maxWidth: '88%' },
  bubbleWrapRight: { alignSelf: 'flex-end', flexDirection: 'row-reverse', maxWidth: '82%' },

  aiAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  bubble: {
    borderRadius: 20,
    padding: 14,
    flex: 1,
  },
  bubbleAI: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.chalk,
    borderBottomLeftRadius: 4,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleText: { fontSize: 14, lineHeight: 21 },
  bubbleTextAI: { color: colors.ink },
  bubbleTextUser: { color: colors.white },

  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.terracotta,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  emergencyBannerText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    flex: 1,
  },

  sources: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.chalk,
    gap: 3,
  },
  sourcesLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  sourceItem: { fontSize: 11, color: colors.mist, lineHeight: 16 },

  bubbleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.chalk,
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionBtnText: { fontSize: 11, color: colors.mist, fontWeight: '700' },

  loadingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.chalk,
    padding: 12,
  },
  loadingText: { fontSize: 12, color: colors.mist },

  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  disclaimerText: { flex: 1, fontSize: 11, color: colors.fog, lineHeight: 15 },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.chalk,
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.ink,
    borderWidth: 1,
    borderColor: colors.chalk,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: colors.fog,
    opacity: 0.5,
  },
});
