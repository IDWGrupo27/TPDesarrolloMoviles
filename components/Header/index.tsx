import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { materialColors } from "../../utils/colors";
import { Ionicons } from '@expo/vector-icons';
import { useContext, useState } from "react";
import { AUTH_ACTIONS, AuthContext } from "../../shares/context";
import Logout from "../Logout";
import { useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import Menu from "../Menu";
import React from "react";

interface LogoutProps {
    logout: () => void;
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;



export default function Header() {

    const [isPressed, setIsPressed] = useState<boolean>(false)

    const handleMenu = () => {
        if (!isPressed) {
            setIsPressed(true)
        } else {
            setIsPressed(false)
        }
    }

    const { state, dispatch } = useContext(AuthContext);

    const handleLogout = () => {
        dispatch({ type: AUTH_ACTIONS.LOGOUT })
    }

    const route = useRoute();

    const hideLogout = route.name === 'Login' || route.name === 'Register' || route.name === 'ForgotPassword' || route.name === 'NewPassword';

    return (
        <LinearGradient
            colors={[materialColors.schemes.dark.onPrimary, materialColors.schemes.dark.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
        >
            <Menu onPress={handleMenu} press={isPressed} style={isPressed ? styles.showMenu : { position: "absolute", left: 0, top: 0 }} />

            <View style={styles.logo}>
                <Ionicons name="paw" size={30} color={materialColors.schemes.dark.onPrimary} />
            </View>

            <Text style={styles.appTitle}>PetWay</Text>

            <Text style={styles.appSubtitle}>Encuentra tu compañero ideal</Text>

            {/* <Logout logout={handleLogout} /> */}
            {!hideLogout && <Logout logout={handleLogout} />}

        </LinearGradient>

    );
}

const styles = StyleSheet.create({

    header: {
        paddingTop: 16,
        paddingBottom: 13,
        paddingHorizontal: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    logo: {
        width: 80,
        height: 80,
        backgroundColor: materialColors.schemes.light.background,
        borderRadius: 40, // La mitad del width/height para hacer círculo
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        elevation: 8,
        borderWidth: 3,// Grosor del borde
        borderColor: materialColors.schemes.dark.onPrimary,
    },
    logoEmoji: {
        fontSize: 40,
        borderColor: materialColors.schemes.light.onPrimary,
    },
    appTitle: {
        color: materialColors.schemes.light.onPrimary,
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    appSubtitle: {
        color: materialColors.schemes.light.onPrimary,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 5,
    },

    showMenu: {
        width: screenWidth / 2,
        height: screenHeight,
        backgroundColor: '#7a4f81e3',
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 1,
    },


});