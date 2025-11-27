import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import Header from "../../../../components/Header";
import { materialColors } from '../../../../utils/colors';
import FilterBar from '../../../../components/FilterBar';
import { fetchPets } from '../../../../utils/helpers/petfinderHelpers';
import PetsList from '../../../../utils/helpers/PetsList';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';

const animalTypes = [
    { key: 'dog', label: 'Perros' },
    { key: 'cat', label: 'Gatos' },
    { key: 'horse', label: 'Caballos' },
];

export default function HomeScreen() {

    const [selectedType, setSelectedType] = useState<string>("dog");

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header />
            <View style={styles.container}>
                <FilterBar
                    animalTypes={animalTypes}
                    selectedType={selectedType}
                    onSelectType={setSelectedType}
                />
                <PetsList type={selectedType} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingTop: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
        color: materialColors.schemes.dark.primary,
    },
});
