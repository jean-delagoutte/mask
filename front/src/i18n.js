import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
.use(initReactI18next)
.use(LanguageDetector)
.use(HttpApi)
.init({
    detection: {
      order: ['cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['cookie'],
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    fallbackLng: 'fr',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    nsSeparator: false,
    defaultNS: 'translation',
    react: {
      useSuspense: false,
    },
});

export default i18n;