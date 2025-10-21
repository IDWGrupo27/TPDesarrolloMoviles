// app/Root.tsx

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';

import TabsScreen from './tabs';
import AuthStackScreen from './auth';
import DetalleMascota from './tabs/screens/detalleMascota';
import { RootStackParamList } from '../utils/RootStackParamList';
import { AUTH_ACTIONS, AuthContext } from '../shares/context';
import { getUser } from '../utils/secure-store';
import { supabase } from './api/supabaseClient';
import { navigate } from '../utils/NavigationService'; // Asegúrate que la ruta sea correcta

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Root() {
    const { state, dispatch } = useContext(AuthContext);
    const [isSigned, setIsSigned] = useState(false);

    // Efecto para sincronizar el estado de la app con el contexto de autenticación
    useEffect(() => {
        if (state?.user) {
            setIsSigned(true);
        } else {
            setIsSigned(false);
        }
    }, [state]);

    // Efecto para verificar si hay un usuario guardado al iniciar la app
    useEffect(() => {
        getUser().then(user => {
            if (user) {
                dispatch({ type: AUTH_ACTIONS.SET_USER, payload: { user } });
                setIsSigned(true);
            }
            // Oculta la pantalla de carga una vez que se ha verificado el estado del usuario
            SplashScreen.hideAsync();
        });
    }, []);

    // --- 👇 NUEVA LÓGICA PARA MANEJAR DEEP LINKS 👇 ---
    useEffect(() => {
        const handleDeepLink = (event: { url: string }) => {
            const { url } = event;

            // 1. Separamos la URL por el '#' para obtener el fragmento
            const fragment = url.split('#')[1];
            if (!fragment) return; // Si no hay fragmento, no hacemos nada

            // 2. Usamos URLSearchParams para convertir el fragmento en un objeto fácil de usar
            const params = new URLSearchParams(fragment);
            
            // 3. Obtenemos los valores que nos interesan
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');
            const type = params.get('type');

            // 4. Verificamos si es un enlace de recuperación válido
            if (accessToken && refreshToken && type === 'recovery') {
                supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken,
                }).then(({ error }: { error: any }) => {
                    if (!error) {
                        // ¡Ahora sí navegamos!
                        navigate('NewPassword');
                    } else {
                        console.error("Error al establecer la sesión desde el deep link:", error);
                    }
                });
            }
        };
        
        const subscription = Linking.addEventListener('url', handleDeepLink);

        return () => {
            subscription.remove();
        };
    }, []);

    return (
        <Stack.Navigator
            initialRouteName={isSigned ? "TABS" : "AUTH"}
            screenOptions={{ headerShown: false }}
        >
            {isSigned ? (
                <>
                    <Stack.Screen name="TABS" component={TabsScreen} />
                    <Stack.Screen name="DetalleMascota" component={DetalleMascota} />
                </>
            ) : (
                <Stack.Screen name="AUTH" component={AuthStackScreen} />
            )}
        </Stack.Navigator>
    );
}