import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from '../translations/en/en.json';
import vi from '../translations/vi/vi.json';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'vi',
  resources: {
    en: en,
    vi: vi,
  },
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
