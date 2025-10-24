// App.tsx

import { StatusBar } from 'expo-status-bar';
import Root from './app/Root';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './shares/context';
import './app/services/i18n';
import { navigationRef } from './utils/NavigationService';

// --- NUEVAS IMPORTACIONES DE LINKING ---
import * as Linking from 'expo-linking';
import { useContext } from 'react';
import AuthContext from './shares/context/auth-context'; 
import { AuthTokens } from './shares/models/users'; 
import { Buffer } from 'buffer';

// Aplicamos el shim de Buffer
global.Buffer = global.Buffer || Buffer; 

// --- FUNCIÓN CLAVE 1: CORREGIR EL ENLACE ---
const parseSupabaseUrl = (url: string) => {
    let parsedUrl = url;
    if (url.includes("#")) {
        parsedUrl = url.replace("#", "?"); 
    }
    return parsedUrl;
};


export default function App() {
    // Obtenemos el contexto (usando el tipo para evitar el error 'is not a function')
    const context = useContext(AuthContext); 
    
    if (!context || typeof context.loginWithTokens !== 'function') {
        // Retornar solo el contenido básico si el contexto aún no está listo
        return (
            <NavigationContainer ref={navigationRef}>
                <StatusBar style="auto" />
                <AuthProvider>
                    <Root />
                </AuthProvider>
            </NavigationContainer>
        );
    }
    
    const { loginWithTokens } = context; 

    // --- FUNCIÓN CLAVE 2: OBTENER LINK INICIAL ---
    const getInitialURL = async () => {
        const url = await Linking.getInitialURL();
        if (url !== null) {
            return parseSupabaseUrl(url); 
        }
        return url;
    };
    
    // --- FUNCIÓN CLAVE 3: SUSCRIPCIÓN MANUAL ---
    const subscribe = (listener: (url: string) => void) => {
        const onReceiveURL = ({ url }: { url: string }) => {
            const transformedUrl = parseSupabaseUrl(url);
            const parsedUrl = Linking.parse(transformedUrl);
            
            const access_token = parsedUrl.queryParams?.access_token;
            const refresh_token = parsedUrl.queryParams?.refresh_token;

            if (typeof access_token === "string" && typeof refresh_token === "string") {
                console.log("App: Tokens received! Forcing login with tokens.");
                void loginWithTokens({ access_token, refresh_token } as AuthTokens);
            }
            
            listener(transformedUrl); 
        };
        
        const subscription = Linking.addEventListener("url", onReceiveURL);
        return () => { subscription.remove(); };
    };

    // Configuramos el objeto linking
    const linking = {
        prefixes: [Linking.createURL("/")], 
        config: {
            screens: {
                NewPassword: "reset-password", // Mapea petway://reset-password
            },
        },
        getInitialURL: getInitialURL, 
        subscribe: subscribe,
    };


    return (
        <NavigationContainer ref={navigationRef} linking={linking}> 
            <StatusBar style="auto" />
            <AuthProvider>
                <Root />
            </AuthProvider>
        </NavigationContainer>
    );
}