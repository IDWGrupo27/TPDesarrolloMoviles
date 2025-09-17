import { StatusBar } from 'expo-status-bar';
import Header from './components/Header';
import Root from './app/Root';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {/* <Header /> */}
      <Root />
    </NavigationContainer>
  );
}
