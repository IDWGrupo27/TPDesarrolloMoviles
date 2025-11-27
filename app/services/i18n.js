// services/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// ACÁ VAN LOS ARchivos que vamos creando  de .json
import authEs from '../translations/es/auth.json';
import petDetailEs from '../translations/es/petDetail.json';


// Objeto con todas las traducciones
const resources = {
  es: {
    auth: authEs,     // Namespace "auth"
    petDetail: petDetailEs, // Namespace "petDetail"
  },
  // acá se pueden agregar más idiomas a futuro, por ejemplo 'en': { ... }
};

i18n
  .use(initReactI18next) // Conecta i18next con React/React Native
  .init({
    // --- CONFIGURACIÓN PRINCIPAL ---
    
    // Objeto con todas las traducciones
    resources,

    // Idioma con el que empieza la app
    lng: 'es', 

    // Si no encuentra una traducción en el idioma actual, la busca en este idioma
    fallbackLng: 'es',

    // Namespaces (los "módulos" que definimos)
    ns: ['common', 'auth', 'petDetail'],
    // Namespace que carga por defecto si no especificas uno
    defaultNS: 'common',

    // Configuración importante para React
    interpolation: {
      escapeValue: false, // React ya se encarga de la seguridad (evitar XSS)
    },
    
    // Compatibilidad con React Native
    compatibilityJSON: 'v3'
  });

export default i18n;