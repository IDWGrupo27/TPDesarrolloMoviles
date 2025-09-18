// Root.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';
import TabsScreen from './tabs';
import AuthStackScreen from './auth';
import DetalleMascota from './tabs/screens/detalleMascota'; // asegurate de la casing exacta
import { RootStackParamList } from '../utils/RootStackParamList';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Root() {
    const [isSigned, setIsSigned] = useState(true);

    return (
        <Stack.Navigator
            initialRouteName={isSigned ? "TABS" : "AUTH"} // literal keys
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
