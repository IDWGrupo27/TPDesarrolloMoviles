// services/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// --- IMPORTA TUS ARCHIVOS DE TRADUCCIÓN ---
// A medida que crees más archivos .json, los importas aquí.
import authEs from '../translations/es/auth.json';


// Objeto con todas las traducciones
const resources = {
  es: {
    auth: authEs,     // Namespace "auth"
  },
  // Aquí agregarías otros idiomas en el futuro, por ejemplo 'en': { ... }
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
    ns: ['common', 'auth'],
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