'use client';
import { createContext, useContext, useState } from 'react';
import en from '@/locales/en.json';

const LocaleContext = createContext<{ locale: 'vi' | 'en'; setLocale: (locale: 'vi' | 'en') => void }>({ locale: 'vi', setLocale: () => {} });
export function LocaleProvider({ initialLocale, children }: { initialLocale: 'vi' | 'en'; children: React.ReactNode }) {
  const [locale, updateLocale] = useState(initialLocale);
  const setLocale = (next: 'vi' | 'en') => {
    updateLocale(next);
    document.cookie = `internmatch_locale=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    document.documentElement.lang = next;
  };
  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}
export function useLocale() { return useContext(LocaleContext); }
export function useT() {
  const { locale } = useLocale();
  return (text: string) => {
    const translated = (en as Record<string, string>)[text.trim()];
    return locale === 'en' && translated ? text.replace(text.trim(), translated) : text;
  };
}
