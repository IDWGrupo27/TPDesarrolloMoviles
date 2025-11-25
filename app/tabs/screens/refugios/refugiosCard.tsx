import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ViewStyle,
} from "react-native";
import { Organization } from "@shares/models/organizations";

type Props = {
    org: Organization;
    onPress?: (org: Organization) => void;
    style?: ViewStyle;
};

export default function RefugiosCard({ org, onPress, style }: Props) {
    const city = org.address?.city ?? "";
    const state = org.address?.state ?? "";
    const locationText =
        [city, state].filter(Boolean).join(", ") || "Ubicación no disponible";

    const imageUrl =
        org.photos && org.photos.length > 0 ? org.photos[0].medium : null;

    const Container: any = onPress ? TouchableOpacity : View;

    return (
        <Container
            style={[styles.card, style]}
            onPress={onPress ? () => onPress(org) : undefined}
            activeOpacity={0.8}
        >
            {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.image} />
            ) : (
                <View style={[styles.image, styles.imagePlaceholder]}>
                    <Text style={styles.imagePlaceholderText}>Sin foto</Text>
                </View>
            )}

            <View style={styles.info}>
                <Text style={styles.name}>{org.name}</Text>
                <Text style={styles.location}>{locationText}</Text>
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        padding: 12,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 10,
        backgroundColor: "#FFF",
        borderColor: "Black",
        borderWidth: 2,
        elevation: 2,
    },
    image: {
        width: 64,
        height: 64,
        borderRadius: 8,
        marginRight: 12,
    },
    imagePlaceholder: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EEE",
    },
    imagePlaceholderText: {
        fontSize: 10,
        color: "#666",
    },
    info: {
        flex: 1,
        justifyContent: "center",
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    location: {
        fontSize: 14,
        color: "#666",
    },
});