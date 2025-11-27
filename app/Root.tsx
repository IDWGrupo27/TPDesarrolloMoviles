// app/Root.tsx 

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import TabsScreen from './tabs';
import AuthStackScreen from './auth';
import DetalleMascota from './tabs/screens/detalleMascota';
import NewPassword from './auth/screen/NewPassword';
import { RootStackParamList } from '../utils/RootStackParamList';
import { AUTH_ACTIONS, AuthContext } from '../shares/context';
import { getUser } from '../utils/secure-store';
import Refugios from './tabs/screens/refugios';
import DetalleRefugio from './tabs/screens/refugios/detalleRefugio';

const Stack = createNativeStackNavigator<RootStackParamList>();

SplashScreen.preventAutoHideAsync();

export default function Root() {
    const { state, dispatch } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                const storedUser = await getUser();
                if (storedUser) {
                    // getUser ya devuelve el objeto parseado
                    dispatch({ type: AUTH_ACTIONS.SET_USER, payload: { user: storedUser as any } });
                }
            } catch (e) {
                console.warn('Root initializeApp error:', e);
            } finally {
                setIsLoading(false);
                SplashScreen.hideAsync();
            }
        };

        initializeApp();
    }, [dispatch]);

    if (isLoading) {
        return null;
    }

    const showAuthStack = !state.user || state.recoveryMode;

    return (
        <Stack.Navigator
            initialRouteName={showAuthStack ? "AUTH" : "TABS"}
            screenOptions={{ headerShown: false }}
        >

            {showAuthStack ? (
                <Stack.Screen name="AUTH" component={AuthStackScreen} />
            ) : (
                <>
                    <Stack.Screen name="TABS" component={TabsScreen} />
                    <Stack.Screen name="DetalleMascota" component={DetalleMascota} />
                    <Stack.Screen name="Refugios" component={Refugios} />
                    <Stack.Screen name="DetalleRefugio" component={DetalleRefugio} />
                </>
            )}

            <Stack.Screen name="NewPassword" component={NewPassword} options={{ headerShown: true }} />
        </Stack.Navigator>
    );
}