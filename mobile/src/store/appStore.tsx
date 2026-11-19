import React, { createContext, useContext, useState, useEffect } from 'react';
import { Linking } from 'react-native';
import { Language, translations } from '../i18n/translations';
import { apiClient } from '../services/api';

export interface TrustedContactItem {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: typeof translations.fr;
  sosModalVisible: boolean;
  openSos: () => void;
  closeSos: () => void;
  quickExit: () => void;
  // Smart Discreet Camouflage Mode
  isCamouflaged: boolean;
  enableCamouflage: () => void;
  disableCamouflage: () => void;
  unlockWithCode: (inputPin: string) => boolean;
  panicExit: () => void;
  // Voice Guidance (Accessibility for non-reading/writing users)
  voiceGuidanceEnabled: boolean;
  toggleVoiceGuidance: () => void;
  trustedContacts: TrustedContactItem[];
  addTrustedContact: (contact: Omit<TrustedContactItem, 'id'>) => void;
  removeTrustedContact: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('fr');
  const [sosModalVisible, setSosModalVisible] = useState(false);
  const [isCamouflaged, setIsCamouflaged] = useState(false);
  const [voiceGuidanceEnabled, setVoiceGuidanceEnabled] = useState(false);
  const [trustedContacts, setTrustedContacts] = useState<TrustedContactItem[]>([
    { id: '1', name: 'Sara (Sœur)', phone: '0661234567', relationship: 'Famille' }
  ]);

  const isRTL = language === 'ar' || language === 'darija';
  const t = translations[language];

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const openSos = () => setSosModalVisible(true);
  const closeSos = () => setSosModalVisible(false);

  const enableCamouflage = () => setIsCamouflaged(true);
  const disableCamouflage = () => setIsCamouflaged(false);

  const unlockWithCode = (inputPin: string): boolean => {
    // Secret code default is 1234 or 2026
    if (inputPin === '1234' || inputPin === '2026' || inputPin.toLowerCase() === 'sanad') {
      setIsCamouflaged(false);
      return true;
    }
    return false;
  };

  /**
   * Quick Panic Exit:
   * Instantly flips to the benign Moroccan Recipes Cooking portal,
   * dismisses all active modals, stops any audio, and protects the user immediately.
   */
  const panicExit = () => {
    setSosModalVisible(false);
    setIsCamouflaged(true);
  };

  const quickExit = () => {
    panicExit();
    // External backup link option
    Linking.openURL('https://www.google.com/search?q=meteo+maroc').catch(() => {});
  };

  const toggleVoiceGuidance = () => {
    setVoiceGuidanceEnabled(prev => !prev);
  };

  // Synchronize trusted contacts with backend MongoDB
  useEffect(() => {
    apiClient
      .get('/trusted-contacts')
      .then((res) => {
        if (res.data?.contacts && Array.isArray(res.data.contacts) && res.data.contacts.length > 0) {
          setTrustedContacts(
            res.data.contacts.map((c: any) => ({
              id: c._id || c.id || Date.now().toString(),
              name: c.name,
              phone: c.phone,
              relationship: c.relationship || 'Proche',
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const addTrustedContact = (contact: Omit<TrustedContactItem, 'id'>) => {
    const tempId = Date.now().toString();
    const newItem: TrustedContactItem = {
      ...contact,
      id: tempId,
    };
    setTrustedContacts((prev) => [...prev, newItem]);

    apiClient
      .post('/trusted-contacts', {
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relationship || 'Proche',
      })
      .then((res) => {
        if (res.data?.contact?._id) {
          const serverId = res.data.contact._id;
          setTrustedContacts((prev) =>
            prev.map((c) => (c.id === tempId ? { ...c, id: serverId } : c))
          );
        }
      })
      .catch(() => {});
  };

  const removeTrustedContact = (id: string) => {
    setTrustedContacts((prev) => prev.filter((c) => c.id !== id));
    apiClient.delete(`/trusted-contacts/${id}`).catch(() => {});
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        isRTL,
        t,
        sosModalVisible,
        openSos,
        closeSos,
        quickExit,
        isCamouflaged,
        enableCamouflage,
        disableCamouflage,
        unlockWithCode,
        panicExit,
        voiceGuidanceEnabled,
        toggleVoiceGuidance,
        trustedContacts,
        addTrustedContact,
        removeTrustedContact
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
