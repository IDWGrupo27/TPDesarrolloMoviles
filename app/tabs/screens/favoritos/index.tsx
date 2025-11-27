import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from "react-native";
import Header from "../../../../components/Header";
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { Pet } from '../../../../utils/helpers/petfinderHelpers';
import { getFavorites } from '../../../../utils/helpers/favoritesHelper';
import PetCard from '../../../../components/PetCard';
import { useFocusEffect } from '@react-navigation/native';

export default function FavoritosScreen() {
    const [favorites, setFavorites] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadFavorites();
        }, [])
    );

    const loadFavorites = async () => {
        setLoading(true);
        try {
            const favs = await getFavorites();
            setFavorites(favs);
        } catch (err) {
            console.error("Error cargando favoritos:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header />
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Cargando favoritos...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (favorites.length === 0) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header />
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>💙</Text>
                    <Text style={styles.emptyTitle}>Sin favoritos aún</Text>
                    <Text style={styles.emptyText}>
                        Toca el corazón en las mascotas que te gusten para guardarlas aquí
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header />
            <View style={styles.container}>
                <Text style={styles.title}>Mis Favoritos</Text>
                <FlatList
                    data={favorites}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <PetCard pet={item} fullWidth />}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    style={{ paddingHorizontal: 0 }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 0,
        paddingTop: 12,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: '#333',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    },
});
