import { View, Text, StyleSheet } from "react-native";
import Header from "../../../../components/Header";

export default function Nosotros() {

    return (
        <>
            <Header />
            <View style={styles.container}>
                <Text style={{ fontSize: 20 }}>Nosotros</Text>
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
