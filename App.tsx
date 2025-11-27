// App.tsx

import { StatusBar } from 'expo-status-bar';
import Root from './app/Root';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './shares/context';
import './app/services/i18n';
import { navigationRef } from './utils/NavigationService';
import * as Linking from 'expo-linking';
import { useContext } from 'react';
import AuthContext from './shares/context/auth-context';
import { AuthTokens } from './shares/models/users';
import { Buffer } from 'buffer';
import NotificationListener from './app/tabs/screens/detalleMascota/notifications';

// Aplicamos el shim de Buffer
global.Buffer = global.Buffer || Buffer;

// --- 1: CORREGIR EL ENLACE ---
const parseSupabaseUrl = (url: string) => {
    let parsedUrl = url;
    if (url.includes("#")) {
        parsedUrl = url.replace("#", "?");
    }
    return parsedUrl;
};

// Componente interno que usa el contexto DENTRO del Provider
function AppContent() {
    const { loginWithTokens } = useContext(AuthContext);

    // --- 2: OBTENER LINK INICIAL ---
    const getInitialURL = async () => {
        const url = await Linking.getInitialURL();
        if (url !== null) {
            return parseSupabaseUrl(url);
        }
        return url;
    };

    // --- 3: SUSCRIPCIÓN MANUAL ---
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

    // Configuración del objeto linking
    const linking = {
        prefixes: [Linking.createURL("/")],
        config: {
            screens: {
                NewPassword: "reset-password",
            },
        },
        getInitialURL: getInitialURL,
        subscribe: subscribe,
    };

    return (
        <NavigationContainer ref={navigationRef} linking={linking}>
            <StatusBar style="auto" />
            <Root />
            <NotificationListener />
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}