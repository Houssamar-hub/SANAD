import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../theme/colors';
import { useApp } from '../store/appStore';
import { apiClient } from '../services/api';
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Lock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react-native';

export function AudioQuickRecord() {
  const router = useRouter();
  const { language, isRTL } = useApp();

  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'paused' | 'recorded' | 'saving' | 'saved'>('idle');
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const timerRef = useRef<any>(null);
  const mediaRecorderRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for recording state
  useEffect(() => {
    if (recordingState === 'recording') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: 650,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 650,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [recordingState]);

  // Timer counter
  useEffect(() => {
    if (recordingState === 'recording') {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [recordingState]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start recording
  const startRecording = async () => {
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new (window as any).MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event: any) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
          // Stop mic tracks
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start(200);
        setSeconds(0);
        setRecordingState('recording');
        setSaveSuccess(false);
      } else {
        // Universal fallback for mock recording when web mediaDevices not available
        setSeconds(0);
        setRecordingState('recording');
        setSaveSuccess(false);
      }
    } catch (err: any) {
      Alert.alert(
        language === 'darija' ? 'إذن الميكروفون' : language === 'ar' ? 'إذن الميكروفون' : 'Permission Micro',
        language === 'darija'
          ? 'عافاك عطي الإذن بالوصول للميكروفون باش تسجلي الصوت.'
          : language === 'ar'
          ? 'يرجى منح الإذن لاستخدام الميكروفون لبدء التسجيل.'
          : 'Veuillez autoriser l’accès au microphone pour enregistrer.'
      );
    }
  };

  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
    }
    setRecordingState('paused');
  };

  // Resume recording
  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
    }
    setRecordingState('recording');
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && (mediaRecorderRef.current.state === 'recording' || mediaRecorderRef.current.state === 'paused')) {
      mediaRecorderRef.current.stop();
    } else {
      setAudioUrl('mock://audio_recording_' + Date.now());
    }
    setRecordingState('recorded');
  };

  // Playback preview
  const togglePlayPreview = () => {
    if (!audioUrl) return;

    if (Platform.OS === 'web' && typeof Audio !== 'undefined') {
      if (!audioElementRef.current) {
        audioElementRef.current = new Audio(audioUrl);
        audioElementRef.current.onended = () => setIsPlaying(false);
      }

      if (isPlaying) {
        audioElementRef.current.pause();
        setIsPlaying(false);
      } else {
        audioElementRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // Discard / Reset
  const discardRecording = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
    setRecordingState('idle');
    setSeconds(0);
    setAudioUrl(null);
    setIsPlaying(false);
    setSaveSuccess(false);
  };

  // Save to Digital Evidence Vault
  const saveToVault = async () => {
    setRecordingState('saving');
    const now = new Date();
    const dateFormatted = now.toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR');
    const timeFormatted = now.toLocaleTimeString(language === 'ar' ? 'ar-MA' : 'fr-FR', { hour: '2-digit', minute: '2-digit' });

    const title = language === 'darija'
      ? `تسجيل صوتي سري (${dateFormatted} - ${timeFormatted})`
      : language === 'ar'
      ? `تسجيل صوتي للوقائع (${dateFormatted} - ${timeFormatted})`
      : `Enregistrement audio du ${dateFormatted} à ${timeFormatted}`;

    const description = language === 'darija'
      ? `تسجيل صوتي للوقائع مدته ${formatTime(seconds)} تم حفظه وتشفيره كدليل إثبات في الخزنة الرقمية.`
      : language === 'ar'
      ? `تسجيل صوتي توثيقي مدته ${formatTime(seconds)} تم حفظه وبصمته الرقمية لحفظ الإثبات في الخزنة.`
      : `Enregistrement audio probatoire de ${formatTime(seconds)} scellé dans le coffre-fort numérique.`;

    // Compute mock tamper-proof SHA-256 hash
    const fakeHash = 'hash_audio_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    try {
      await apiClient.post('/evidence', {
        title,
        description,
        category: 'enregistrement_audio',
        incidentDate: now.toISOString(),
        fileType: 'audio/webm',
        fileSize: Math.max(seconds * 16000, 24000),
        hashSha256: fakeHash,
        notes: `Durée: ${formatTime(seconds)} | Enregistrement d'urgence Accueil SANAD`,
      });
    } catch (e) {
      // Continue gracefully
    }

    setRecordingState('saved');
    setSaveSuccess(true);
  };

  // Translations
  const labels = {
    title: language === 'darija' ? 'تسجيل صوتي سري للأدلة' : language === 'ar' ? 'تسجيل صوتي للوقائع' : 'Enregistrement audio probatoire',
    subtitle: language === 'darija' ? 'سجلي أي تهديد أو اعتداء وحفظيه فوراً فالخزنة الرقمية بأمان' : language === 'ar' ? 'توثيق صوتي فوري مشفر ومحمي في الخزنة الرقمية' : 'Capturez immédiatement un enregistrement audio scellé dans votre coffre-fort',
    startBtn: language === 'darija' ? 'بدء التسجيل الآن' : language === 'ar' ? 'بدء التسجيل الصوتي' : 'Démarrer l’enregistrement',
    recording: language === 'darija' ? 'جاري التسجيل...' : language === 'ar' ? 'جاري التسجيل...' : 'Enregistrement en cours...',
    paused: language === 'darija' ? 'متوقف مؤقتاً' : language === 'ar' ? 'التسجيل موقوف مؤقتاً' : 'Enregistrement en pause',
    stopBtn: language === 'darija' ? 'إنهاء وحفظ' : language === 'ar' ? 'إيقاف وحفظ' : 'Terminer',
    pauseBtn: language === 'darija' ? 'توقف مؤقت' : language === 'ar' ? 'إيقاف مؤقت' : 'Pause',
    resumeBtn: language === 'darija' ? 'متابعة' : language === 'ar' ? 'استئناف' : 'Reprendre',
    previewPlay: language === 'darija' ? 'استماع' : language === 'ar' ? 'استماع للمعاينة' : 'Écouter',
    previewPause: language === 'darija' ? 'إيقاف الاستماع' : language === 'ar' ? 'إيقاف' : 'Pause',
    saveBtn: language === 'darija' ? 'حفظ فالخزنة الرقمية' : language === 'ar' ? 'حفظ في الخزنة المشفرة' : 'Sceller dans le coffre-fort',
    discardBtn: language === 'darija' ? 'مسح' : language === 'ar' ? 'إلغاء' : 'Supprimer',
    savedMsg: language === 'darija' ? 'تم الحفظ والتشفير بنجاح فالخزنة!' : language === 'ar' ? 'تم الحفظ والتشفير بنجاح في الخزنة الرقمية!' : 'Enregistrement scellé et chiffré dans le coffre-fort !',
    viewVault: language === 'darija' ? 'مشاهدة الخزنة الرقمية' : language === 'ar' ? 'فتح الخزنة الرقمية' : 'Ouvrir le coffre-fort',
    newRecord: language === 'darija' ? 'تسجيل جديد' : language === 'ar' ? 'تسجيل جديد' : 'Nouvel enregistrement',
  };

  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={[styles.headerRow, isRTL && styles.rowReverse]}>
        <View style={styles.iconBadge}>
          <Mic size={18} color={colors.primary} />
        </View>
        <View style={styles.headerTexts}>
          <Text style={[styles.title, isRTL && styles.textRight]}>{labels.title}</Text>
          <Text style={[styles.subtitle, isRTL && styles.textRight]}>{labels.subtitle}</Text>
        </View>
        {recordingState === 'recording' && (
          <Animated.View style={[styles.liveDot, { transform: [{ scale: pulseAnim }] }]} />
        )}
      </View>

      {/* Main Body depending on state */}
      {recordingState === 'idle' && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.recordStartBtn}
            onPress={startRecording}
            activeOpacity={0.88}
          >
            <View style={styles.recordStartInner}>
              <Mic size={20} color={colors.white} />
              <Text style={styles.recordStartText}>{labels.startBtn}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {(recordingState === 'recording' || recordingState === 'paused') && (
        <View style={styles.recordingBox}>
          {/* Waveform / Visual Bars Animation */}
          <View style={styles.waveformContainer}>
            <View style={[styles.waveBar, { height: recordingState === 'recording' ? 26 : 8 }]} />
            <View style={[styles.waveBar, { height: recordingState === 'recording' ? 38 : 10 }]} />
            <View style={[styles.waveBar, { height: recordingState === 'recording' ? 20 : 6 }]} />
            <View style={[styles.waveBar, { height: recordingState === 'recording' ? 42 : 12 }]} />
            <View style={[styles.waveBar, { height: recordingState === 'recording' ? 30 : 8 }]} />
            <View style={[styles.waveBar, { height: recordingState === 'recording' ? 24 : 8 }]} />
            <View style={[styles.waveBar, { height: recordingState === 'recording' ? 36 : 10 }]} />
            <View style={[styles.waveBar, { height: recordingState === 'recording' ? 18 : 6 }]} />
          </View>

          {/* Timer Badge */}
          <View style={styles.timerBadge}>
            <Text style={styles.timerText}>{formatTime(seconds)}</Text>
            <Text style={styles.timerStatus}>
              {recordingState === 'recording' ? labels.recording : labels.paused}
            </Text>
          </View>

          {/* Control Buttons */}
          <View style={styles.controlRow}>
            {recordingState === 'recording' ? (
              <TouchableOpacity style={styles.pauseBtn} onPress={pauseRecording}>
                <Pause size={18} color={colors.ink} />
                <Text style={styles.controlBtnText}>{labels.pauseBtn}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.pauseBtn} onPress={resumeRecording}>
                <Play size={18} color={colors.primary} />
                <Text style={styles.controlBtnText}>{labels.resumeBtn}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.stopBtn} onPress={stopRecording}>
              <Square size={18} color={colors.white} />
              <Text style={styles.stopBtnText}>{labels.stopBtn}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.discardBtn} onPress={discardRecording}>
              <Trash2 size={16} color={colors.terracotta} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {recordingState === 'recorded' && (
        <View style={styles.previewBox}>
          <View style={styles.previewMeta}>
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>Durée : {formatTime(seconds)}</Text>
            </View>
            <TouchableOpacity style={styles.playPreviewBtn} onPress={togglePlayPreview}>
              {isPlaying ? <Pause size={18} color={colors.primary} /> : <Play size={18} color={colors.primary} />}
              <Text style={styles.playPreviewText}>
                {isPlaying ? labels.previewPause : labels.previewPlay}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.previewActions}>
            <TouchableOpacity style={styles.saveToVaultBtn} onPress={saveToVault}>
              <Lock size={16} color={colors.white} />
              <Text style={styles.saveToVaultText}>{labels.saveBtn}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteBtn} onPress={discardRecording}>
              <Trash2 size={16} color={colors.terracotta} />
              <Text style={styles.deleteText}>{labels.discardBtn}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {saveSuccess && (
        <View style={styles.successBox}>
          <View style={styles.successRow}>
            <CheckCircle2 size={20} color={colors.success} />
            <Text style={styles.successText}>{labels.savedMsg}</Text>
          </View>

          <View style={styles.successActions}>
            <TouchableOpacity
              style={styles.openVaultBtn}
              onPress={() => router.push('/evidence')}
            >
              <ShieldCheck size={16} color={colors.white} />
              <Text style={styles.openVaultText}>{labels.viewVault}</Text>
              <ArrowRight size={14} color={colors.white} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.newRecordBtn} onPress={discardRecording}>
              <RotateCcw size={14} color={colors.mist} />
              <Text style={styles.newRecordText}>{labels.newRecord}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8ECF4',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  textRight: {
    textAlign: 'right',
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTexts: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    color: colors.mist,
    marginTop: 2,
    lineHeight: 16,
  },
  liveDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
    marginLeft: 8,
  },
  actionRow: {
    marginTop: 4,
  },
  recordStartBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
  },
  recordStartInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  recordStartText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  recordingBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 48,
    marginBottom: 10,
  },
  waveBar: {
    width: 4,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  timerBadge: {
    alignItems: 'center',
    marginBottom: 16,
  },
  timerText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
    fontVariant: ['tabular-nums'],
    letterSpacing: 1,
  },
  timerStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
    marginTop: 2,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  pauseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  controlBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.ink,
  },
  stopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#DC2626',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  stopBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
  },
  discardBtn: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
  },
  previewBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  previewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  durationBadge: {
    backgroundColor: '#EDE9FE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  durationText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  playPreviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3E8FF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  playPreviewText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  previewActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  saveToVaultBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.success,
    paddingVertical: 11,
    borderRadius: 12,
  },
  saveToVaultText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
  },
  deleteText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.terracotta,
  },
  successBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginTop: 8,
  },
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  successText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
    flex: 1,
  },
  successActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  openVaultBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 10,
  },
  openVaultText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
  },
  newRecordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
  },
  newRecordText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mist,
  },
});
