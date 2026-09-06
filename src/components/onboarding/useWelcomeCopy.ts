'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { getWelcomeLocale, welcomeCopy } from './welcome-copy';

export function useWelcomeCopy() {
  const { language, setLanguage, isLoading } = useLanguage();
  const locale = getWelcomeLocale(language);
  return { locale, copy: welcomeCopy[locale], setLanguage, isLoading };
}
