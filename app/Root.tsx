import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ROOT_ROUTES } from '../utils/constants';
import TabsScreen from './tabs';
import AuthStackScreen from './auth';

const Stack = createNativeStackNavigator();

export default function Root() {

    const [isSigned, setIsSigned] = useState(false);

    return (
        <Stack.Navigator initialRouteName={isSigned ? ROOT_ROUTES.TABS : ROOT_ROUTES.AUTH} screenOptions={{ headerShown: false }}>
            {
                isSigned ?
                    <Stack.Screen name={ROOT_ROUTES.TABS} component={TabsScreen} />
                    :
                    <Stack.Screen name={ROOT_ROUTES.AUTH} component={AuthStackScreen} />
            }
        </Stack.Navigator>
    );
}