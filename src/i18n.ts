import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";

i18n
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: {
          "welcome": "Welcome to React and react-i18next"
        }
      }
    },
    lng: "en",
    fallbackLng: "en",

    interpolation: {
      escapeValue: false // react already safes from xss
    },

  });

export default i18n;
