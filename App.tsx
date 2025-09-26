import { StatusBar } from 'expo-status-bar';
import Header from './components/Header';
import Root from './app/Root';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext, AuthProvider } from './shares/context';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <AuthProvider>
        <Root />
      </AuthProvider>
    </NavigationContainer>
  );
}
