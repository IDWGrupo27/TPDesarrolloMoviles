import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TAB_ROUTES } from "../../utils/constants";
import { HomeScreen, Nosotros } from "./screens";
import { Ionicons } from "@expo/vector-icons";
import { materialColors } from "../../utils/colors";
import Perfil from "./screens/perfil";

const Tab = createBottomTabNavigator();

export default function TabsScreen() {

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
                    } else if (route.name === TAB_ROUTES.PERFIL) {
                        iconName = focused ? 'person' : 'person-outline';
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
            <Tab.Screen name={TAB_ROUTES.PERFIL} component={Perfil}
                options={{
                    title: "Perfil",
                }}
            />
        </Tab.Navigator>
    )
}