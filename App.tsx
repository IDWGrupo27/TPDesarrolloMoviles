import { StatusBar } from 'expo-status-bar';
import Root from './app/Root';
import { NavigationContainer } from '@react-navigation/native';
import {AuthProvider } from './shares/context';
import './app/services/i18n';
import { navigationRef } from './utils/NavigationService';
export default function App() {
  return (
    <NavigationContainer ref={navigationRef}> 
      <StatusBar style="auto" />
      <AuthProvider>
        <Root />
      </AuthProvider>
    </NavigationContainer>

  );
}
