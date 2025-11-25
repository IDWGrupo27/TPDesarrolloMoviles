import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { materialColors } from "../../../../utils/colors";
import Map from "@app/tabs/screens/refugios/map";
import { fetchOrganizations } from "@utils/helpers/organizationsHelpers";
import { Organization } from "@shares/models/organizations";
import RefugiosCard from "./refugiosCard";
import { RootStackParamList } from "@utils/RootStackParamList";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type NavProp = NativeStackNavigationProp<RootStackParamList, "Refugios">;

export default function RefugiosScreen() {
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<NavProp>();

    useEffect(() => {
        const loadOrgs = async () => {
            try {
                const orgs = await fetchOrganizations();
                setOrganizations(orgs);
            } catch (error) {
                console.error("Error al cargar organizaciones:", error);
                Alert.alert("Error", "No se pudieron cargar los refugios.");
            } finally {
                setLoading(false);
            }
        };

        loadOrgs();
    }, []);

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const handleSelect = (org: Organization) => {
        setSelectedOrg(org);
    };

    const handleOpenDetail = (org: Organization) => {
        navigation.navigate("DetalleRefugio", { org });
    };

    return (
        <View style={styles.container}>
            <Map
                organizations={organizations}
                onSelect={(org) => setSelectedOrg(org as any)}
            />

            {selectedOrg && (
                <View style={styles.topCardContainer} pointerEvents="box-none">
                    {/* <RefugiosCard org={selectedOrg} onPress={() => setSelectedOrg(null)} /> */}
                    <RefugiosCard
                        org={selectedOrg}
                        style={styles.topCard}
                        onPress={() => handleOpenDetail(selectedOrg)}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: materialColors.schemes.light.surface,
    },
    topCardContainer: {
        position: "absolute",
        top: 40,
        left: 0,
        right: 0,
        alignItems: "center",
    },
    topCard: {
        width: "92%",
    },
})