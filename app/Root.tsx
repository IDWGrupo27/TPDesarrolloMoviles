// app/Root.tsx 

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import TabsScreen from './tabs';
import AuthStackScreen from './auth';
import DetalleMascota from './tabs/screens/detalleMascota';
import NewPassword from './auth/screen/NewPassword'; 
import { RootStackParamList } from '../utils/RootStackParamList';
import { AUTH_ACTIONS, AuthContext } from '../shares/context';
import { getUser } from '../utils/secure-store';

const Stack = createNativeStackNavigator<RootStackParamList>();

SplashScreen.preventAutoHideAsync();

export default function Root() {
    const { state, dispatch } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeApp = async () => {
            const storedUser = await getUser();
            if (storedUser) {
                dispatch({ type: AUTH_ACTIONS.SET_USER, payload: { user: JSON.parse(storedUser as string) } });
            }
            setIsLoading(false);
            SplashScreen.hideAsync();
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
                </>
            )}
                       
            <Stack.Screen name="NewPassword" component={NewPassword} options={{ headerShown: true }}/>
        </Stack.Navigator>
    );
}