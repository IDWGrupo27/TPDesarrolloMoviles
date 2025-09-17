import { View, Text, StyleSheet } from "react-native";
import Header from "../../../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {

    return (
        <>
            <Header />
            <View style={styles.container}>
                <Text style={{ fontSize: 20 }}>Home</Text>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
})
