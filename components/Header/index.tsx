import { View, Text, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { materialColors } from "../../utils/colors";
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from "react-native-safe-area-context";

export default function Header() {
    return (

        <LinearGradient
            colors={[materialColors.schemes.dark.onPrimary, materialColors.schemes.dark.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
        >
            <View style={styles.logo}>
                <Ionicons name="paw" size={30} color={materialColors.schemes.dark.onPrimary} />
            </View>

            <Text style={styles.appTitle}>PetWay</Text>

            <Text style={styles.appSubtitle}>Encuentra tu compañero ideal</Text>
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
        marginBottom: 0,
    },
});