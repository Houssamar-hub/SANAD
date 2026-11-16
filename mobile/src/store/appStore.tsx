import React, { createContext, useContext, useState, useEffect } from 'react';
import { Linking, Platform } from 'react-native';
import { Language, translations } from '../i18n/translations';

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
  trustedContacts: TrustedContactItem[];
  addTrustedContact: (contact: Omit<TrustedContactItem, 'id'>) => void;
  removeTrustedContact: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('fr');
  const [sosModalVisible, setSosModalVisible] = useState(false);
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

  /**
   * Quick Exit: immediately redirects out of sensitive screens to a neutral page
   */
  const quickExit = () => {
    // Open neutral page (Météo Maroc)
    Linking.openURL('https://www.google.com/search?q=meteo+maroc').catch(() => {});
  };

  const addTrustedContact = (contact: Omit<TrustedContactItem, 'id'>) => {
    const newItem: TrustedContactItem = {
      ...contact,
      id: Date.now().toString()
    };
    setTrustedContacts(prev => [...prev, newItem]);
  };

  const removeTrustedContact = (id: string) => {
    setTrustedContacts(prev => prev.filter(c => c.id !== id));
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
