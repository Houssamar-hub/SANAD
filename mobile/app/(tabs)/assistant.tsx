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
  Linking,
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
  RotateCcw,
  Trash2,
  ExternalLink,
  ShieldAlert,
  Scale,
  MessageCircle,
} from 'lucide-react-native';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  mode?: 'MODE_A' | 'MODE_B' | 'MODE_C';
  isEmergency?: boolean;
  sources?: Array<{
    id?: string;
    code?: string;
    article?: string;
    title: string;
    url?: string;
    sourceName?: string;
  }>;
  suggestedQuestions?: string[];
  timestamp: Date;
}

export default function AssistantScreen() {
  const { t, isRTL, language, openSos } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'assistant',
      text: t.assistant.welcome,
      mode: 'MODE_A',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'MODE_A' | 'MODE_B' | 'MODE_C'>('MODE_A');
  const [lastUserQuery, setLastUserQuery] = useState<string>('');
  const scrollViewRef = useRef<any>(null);

  const sendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText.trim();
    if (!query || loading) return;

    setLastUserQuery(query);

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

    // Format previous turns for multi-turn context
    const historyPayload = messages.slice(-6).map((m) => ({
      sender: m.sender,
      text: m.text,
    }));

    try {
      const res = await apiClient.post('/ai/chat', {
        message: query,
        history: historyPayload,
        language,
      });
      const data = res.data;
      const respData = data.data || data;

      const aiMode = respData.mode || (respData.isEmergency ? 'MODE_C' : 'MODE_B');
      setActiveMode(aiMode);

      setMessages((prev) => [
        ...prev,
        {
          id: 'ast_' + Date.now(),
          sender: 'assistant',
          text: respData.response || respData.answer || data.answer,
          mode: aiMode,
          isEmergency: respData.isEmergency || (respData.safety && respData.safety.isEmergency),
          sources: respData.sources,
          suggestedQuestions: respData.suggestedQuestions,
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
          mode: 'MODE_B',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 150);
    }
  };

  const clearChat = () => {
    Alert.alert(
      'Effacer la discussion',
      'Voulez-vous réinitialiser l\'historique de la conversation ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Effacer',
          style: 'destructive',
          onPress: () => {
            setMessages([
              {
                id: 'welcome_' + Date.now(),
                sender: 'assistant',
                text: t.assistant.welcome,
                mode: 'MODE_A',
                timestamp: new Date(),
              },
            ]);
            setActiveMode('MODE_A');
          },
        },
      ]
    );
  };

  const copyToClipboard = (text: string) => {
    Alert.alert('Copié !', 'Le texte a été copié.');
  };

  const sendFeedback = async (rating: 'like' | 'dislike') => {
    try {
      await apiClient.post('/ai/feedback', { rating });
      Alert.alert('Merci !', 'Votre avis nous aide à améliorer SANAD.');
    } catch {
      // ignore
    }
  };

  const openUrl = (url?: string) => {
    if (!url) return;
    Linking.openURL(url).catch(() => {});
  };

  // Find latest suggestions
  const latestSuggestions =
    messages.length > 1 && messages[messages.length - 1].suggestedQuestions
      ? messages[messages.length - 1].suggestedQuestions
      : t.assistant.suggestions;

  return (
    <SafeAreaView style={styles.safe}>
      <Header />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top Control Bar: Active Mode Indicator & Clear Button */}
        <View style={styles.topControlBar}>
          <View style={styles.modeBadgeWrapper}>
            {activeMode === 'MODE_C' ? (
              <View style={[styles.modeBadge, styles.modeBadgeEmergency]}>
                <ShieldAlert size={14} color={colors.white} />
                <Text style={styles.modeBadgeTextEmergency}>Mode Urgence & Protection</Text>
              </View>
            ) : activeMode === 'MODE_B' ? (
              <View style={[styles.modeBadge, styles.modeBadgeLegal]}>
                <Scale size={14} color={colors.primary} />
                <Text style={styles.modeBadgeTextLegal}>Mode Conseil Juridique</Text>
              </View>
            ) : (
              <View style={[styles.modeBadge, styles.modeBadgeGeneral]}>
                <MessageCircle size={14} color={colors.mist} />
                <Text style={styles.modeBadgeTextGeneral}>Mode Conversation Naturelle</Text>
              </View>
            )}
          </View>

          {messages.length > 1 && (
            <TouchableOpacity style={styles.clearBtn} onPress={clearChat} activeOpacity={0.7}>
              <Trash2 size={16} color={colors.mist} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.chatScroll}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Quick suggestions if few messages */}
          {messages.length <= 2 && (
            <View style={styles.suggestionsBlock}>
              <Text style={[styles.suggestionsTitle, isRTL && styles.rtl]}>
                Suggestions rapides :
              </Text>
              {(latestSuggestions || []).map((s: string, i: number) => (
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
                  <View style={[
                    styles.aiAvatar,
                    msg.isEmergency && { backgroundColor: '#E53E3E' }
                  ]}>
                    {msg.isEmergency ? (
                      <ShieldAlert size={14} color={colors.white} />
                    ) : (
                      <Sparkles size={12} color={colors.white} />
                    )}
                  </View>
                )}
                <View
                  style={[
                    styles.bubble,
                    isAI ? styles.bubbleAI : styles.bubbleUser,
                    msg.isEmergency && styles.bubbleEmergency,
                  ]}
                >
                  {/* Emergency detection banner */}
                  {msg.isEmergency && (
                    <TouchableOpacity style={styles.emergencyBanner} onPress={openSos}>
                      <PhoneCall size={14} color={colors.white} />
                      <Text style={styles.emergencyBannerText}>
                        URGENCE SÉCURITÉ · Police (19) · Gendarmerie (177)
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

                  {/* Sources with official links */}
                  {msg.sources && msg.sources.length > 0 && (
                    <View style={styles.sources}>
                      <Text style={styles.sourcesLabel}>Sources officielles marocaines :</Text>
                      {msg.sources.map((s, i) => (
                        <TouchableOpacity
                          key={i}
                          style={styles.sourceItemRow}
                          onPress={() => openUrl(s.url)}
                          disabled={!s.url}
                        >
                          <Text style={styles.sourceItem}>
                            • {s.article ? `[${s.article}] ` : ''}{s.title}
                          </Text>
                          {s.url && <ExternalLink size={12} color={colors.primary} style={{ marginLeft: 4 }} />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* Action row */}
                  {isAI && (
                    <View style={styles.feedbackRow}>
                      <TouchableOpacity
                        onPress={() => copyToClipboard(msg.text)}
                        style={styles.actionBtn}
                      >
                        <Copy size={13} color={colors.mist} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => sendFeedback('like')}
                        style={styles.actionBtn}
                      >
                        <ThumbsUp size={13} color={colors.mist} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => sendFeedback('dislike')}
                        style={styles.actionBtn}
                      >
                        <ThumbsDown size={13} color={colors.mist} />
                      </TouchableOpacity>
                      {lastUserQuery ? (
                        <TouchableOpacity
                          onPress={() => sendMessage(lastUserQuery)}
                          style={styles.actionBtn}
                        >
                          <RotateCcw size={13} color={colors.mist} />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  )}
                </View>
              </View>
            );
          })}

          {/* Loading indicator */}
          {loading && (
            <View style={[styles.bubbleWrap, styles.bubbleWrapLeft]}>
              <View style={styles.aiAvatar}>
                <Sparkles size={12} color={colors.white} />
              </View>
              <View style={[styles.bubble, styles.bubbleAI, styles.loadingBubble]}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.loadingText}>SANAD analyse votre demande...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={[styles.input, isRTL && styles.rtl]}
            placeholder={
              language === 'ar' || language === 'darija'
                ? 'طرحي سؤالك أو هضري مع سند...'
                : 'Posez votre question ou discutez avec SANAD...'
            }
            placeholderTextColor={colors.mist}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={() => sendMessage()}
            disabled={!inputText.trim() || loading}
            activeOpacity={0.8}
          >
            <Send size={18} color={inputText.trim() ? colors.white : colors.mist} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  flex: {
    flex: 1,
  },
  topControlBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modeBadgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    gap: 6,
  },
  modeBadgeGeneral: {
    backgroundColor: '#EDF2F7',
  },
  modeBadgeLegal: {
    backgroundColor: '#EBF8FF',
  },
  modeBadgeEmergency: {
    backgroundColor: '#E53E3E',
  },
  modeBadgeTextGeneral: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
  },
  modeBadgeTextLegal: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  modeBadgeTextEmergency: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  clearBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#EDF2F7',
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 24,
  },
  suggestionsBlock: {
    marginBottom: 16,
  },
  suggestionsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.mist,
    marginBottom: 8,
  },
  suggestionChip: {
    backgroundColor: colors.white,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 18,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  suggestionText: {
    fontSize: 13,
    color: colors.ink,
  },
  bubbleWrap: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-end',
  },
  bubbleWrapLeft: {
    justifyContent: 'flex-start',
  },
  bubbleWrapRight: {
    justifyContent: 'flex-end',
  },
  aiAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '82%',
    padding: 14,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  bubbleAI: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleEmergency: {
    borderColor: '#E53E3E',
    borderWidth: 1.5,
  },
  emergencyBanner: {
    backgroundColor: '#E53E3E',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    gap: 6,
  },
  emergencyBannerText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 21,
  },
  bubbleTextAI: {
    color: colors.ink,
  },
  bubbleTextUser: {
    color: colors.white,
  },
  sources: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EDF2F7',
  },
  sourcesLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.mist,
    marginBottom: 4,
  },
  sourceItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  sourceItem: {
    fontSize: 11,
    color: colors.primary,
    flexShrink: 1,
  },
  feedbackRow: {
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F7FAFC',
    gap: 12,
  },
  actionBtn: {
    padding: 4,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  loadingText: {
    fontSize: 13,
    color: colors.mist,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.ink,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#EDF2F7',
  },
  rtl: {
    textAlign: 'right',
  },
});
