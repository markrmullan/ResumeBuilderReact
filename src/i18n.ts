import I18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import XHRBackend from 'i18next-xhr-backend';
import { reactI18nextModule } from 'react-i18next';

const ENGLISH: string = 'en';

I18n
  .use(detector)
  .use(XHRBackend)
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    ns: ['common'],
    defaultNS: 'common',

    lng: 'en',
    fallbackLng: ENGLISH,

    interpolation: {
      escapeValue: false // react already safes from xss
    },

    react: {
      wait: true
    }
  });

export { I18n as i18n };
