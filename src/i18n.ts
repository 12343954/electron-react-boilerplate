import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en.json';
import zhTranslation from './locales/zh.json';

// get language name from localStorage
const savedLanguage = localStorage.getItem('language') as 'en' | 'zh' | null;
const defaultLanguage = savedLanguage || 'en'; // default language
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      zh: {
        translation: zhTranslation
      }
    },
    lng: defaultLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // XSS has been processed
    }
  });

export default i18n;
