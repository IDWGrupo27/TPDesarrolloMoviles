// Root.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext, useEffect, useState } from 'react';
import TabsScreen from './tabs';
import AuthStackScreen from './auth';
import DetalleMascota from './tabs/screens/detalleMascota';
import { RootStackParamList } from '../utils/RootStackParamList';
import { AUTH_ACTIONS, AuthContext } from '../shares/context';
import { deleteUser, getUser } from '../utils/secure-store';
import * as SplashScreen from 'expo-splash-screen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Root() {

    const { state, dispatch } = useContext(AuthContext);
    const [isSigned, setIsSigned] = useState(false);

    useEffect(() => {
        if (state?.user) {
            setIsSigned(true);
        } else {
            setIsSigned(false);
        }
    }, [state]);

    useEffect(() => {
        getUser().then(user => {
            if (user) {
                dispatch({ type: AUTH_ACTIONS.SET_USER, payload: { user } });
                setIsSigned(true);
            }
            SplashScreen.hideAsync();
        });
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
