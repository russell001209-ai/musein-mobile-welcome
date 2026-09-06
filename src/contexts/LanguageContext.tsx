'use client';

import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react';
import type { WelcomeLocale } from '@/components/onboarding/welcome-copy';

const storageKey = 'musein-welcome-language';
const changeEvent = 'musein-welcome:language';
let fallbackLanguage: WelcomeLocale = 'en';

function subscribe(notify: () => void) {
  window.addEventListener('storage', notify);
  window.addEventListener(changeEvent, notify);
  return () => {
    window.removeEventListener('storage', notify);
    window.removeEventListener(changeEvent, notify);
  };
}

function getSnapshot(): WelcomeLocale {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) return saved === 'zh' ? 'zh' : 'en';
  } catch {
    // The walkthrough remains usable when browser storage is unavailable.
  }
  return fallbackLanguage;
}

function setLanguage(language: WelcomeLocale) {
  fallbackLanguage = language === 'zh' ? 'zh' : 'en';
  try { localStorage.setItem(storageKey, fallbackLanguage); } catch { /* Session-only fallback. */ }
  window.dispatchEvent(new Event(changeEvent));
}

interface LanguageState {
  language: WelcomeLocale;
  setLanguage: typeof setLanguage;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageState | null>(null);

// Standalone adapter; use the host application's existing provider when integrating.
export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(subscribe, getSnapshot, () => 'en' as const);
  return <LanguageContext.Provider value={{ language, setLanguage, isLoading: false }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('Wrap the tutorial in LanguageProvider.');
  return context;
}
