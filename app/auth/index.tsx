import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AUTH_ROUTES } from "../../utils/constants";
import Login from "./screen/Login";
import Register from "./screen/Register";
import ForgotPassword from "./screen/ForgotPassword";
import NewPassword from "./screen/NewPassword";
const Stack = createNativeStackNavigator();

export default function AuthStackScreen() {

    return (
        <Stack.Navigator initialRouteName={AUTH_ROUTES.LOGIN} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={AUTH_ROUTES.LOGIN} component={Login} />
            <Stack.Screen name={AUTH_ROUTES.REGISTER} component={Register} />
            <Stack.Screen name={AUTH_ROUTES.FORGOT_PASSWORD} component={ForgotPassword} />
            <Stack.Screen name="NewPassword" component={NewPassword} />
        </Stack.Navigator>
    )
}