import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TAB_ROUTES } from "../../utils/constants";
import { HomeScreen, Nosotros } from "./screens";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { materialColors } from "../../utils/colors";
import { useContext } from "react";
import { AUTH_ACTIONS, AuthContext } from "../../shares/context";
import { TouchableOpacity } from "react-native";

const Tab = createBottomTabNavigator();

export default function TabsScreen() {

    const { state, dispatch } = useContext(AuthContext);

    const handleLogout = () => {
        dispatch({ type: AUTH_ACTIONS.LOGOUT })   // Implement logout functionality here
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === TAB_ROUTES.HOME) {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === TAB_ROUTES.MY_NETWORK) {
                        iconName = focused ? 'people' : 'people-outline';
                    }

                    //@ts-ignore
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: materialColors.schemes.light.primary,
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name={TAB_ROUTES.HOME} component={HomeScreen}
                options={{
                    title: "Home",
                }}
            />
            <Tab.Screen name={TAB_ROUTES.MY_NETWORK} component={Nosotros}
                options={{
                    title: "Nosotros",
                }}
            />
        </Tab.Navigator>
    )
}