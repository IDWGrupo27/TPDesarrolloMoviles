import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { Organization } from "@shares/models/organizations";
import { RootStackParamList } from "../../../../utils/RootStackParamList"; // ver más abajo
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@components/Header";

type RefugioDetailRouteProp = RouteProp<RootStackParamList, "DetalleRefugio">;

type Props = {
    route: RefugioDetailRouteProp;
};

export default function RefugioDetailScreen({ route }: Props) {
    const { org } = route.params;

    const imageUrl =
        org.photos && org.photos.length > 0 ? org.photos[0].medium : null;

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 10 }}>
            <Header />
            <ScrollView contentContainerStyle={styles.container}>
                {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
                <Text style={styles.name}>{org.name}</Text>
                {org.address?.city && (
                    <Text style={styles.location}>
                        {org.address.city}, {org.address.state}
                    </Text>
                )}

                <Text style={styles.location}>{org.description}</Text>
                <Text style={styles.location}>{org.phone}</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 12,
        marginBottom: 16,
    },
    name: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 8,
    },
    location: {
        fontSize: 16,
        color: "#666",
        marginBottom: 16,
    },
});