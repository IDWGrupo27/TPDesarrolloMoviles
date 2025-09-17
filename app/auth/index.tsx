import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AUTH_ROUTES } from "../../utils/constants";
import Login from "./screen/Login";
import Register from "./screen/Register";

const Stack = createNativeStackNavigator();

export default function AuthStackScreen() {

    return (
        <Stack.Navigator initialRouteName={AUTH_ROUTES.LOGIN} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={AUTH_ROUTES.LOGIN} component={Login} />
            <Stack.Screen name={AUTH_ROUTES.REGISTER} component={Register} />
        </Stack.Navigator>
    )
}