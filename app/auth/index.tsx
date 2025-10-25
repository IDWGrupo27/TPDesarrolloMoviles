import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screen/Login";
import Register from "./screen/Register";
import ForgotPassword from "./screen/ForgotPassword";
import NewPassword from "./screen/NewPassword";
import { AuthStackParamList } from "../../utils/RootStackParamList";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStackScreen() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="NewPassword" component={NewPassword} />
    </Stack.Navigator>
  );
}
