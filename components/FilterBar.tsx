// components/FilterBar.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { materialColors } from "../utils/colors";

interface FilterBarProps {
    animalTypes: { key: string, label: string }[];
    selectedType: string;
    onSelectType: (type: string) => void;
}

export default function FilterBar({ animalTypes, selectedType, onSelectType }: FilterBarProps) {
    return (
        <View style={styles.filterContainer}>
            {animalTypes.map((type) => {
                const isActive = selectedType === type.key;
                return (
                    <TouchableOpacity
                        key={type.key}
                        style={[styles.filterButton, isActive && styles.filterButtonActive]}
                        activeOpacity={0.7}
                        onPress={() => onSelectType(type.key)}
                    >
                        <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                            {type.label}
                        </Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10, // espacio entre chips
        marginVertical: 15,
    },
  filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 25,
        backgroundColor: materialColors.schemes.dark.secondary, // morado oscuro tipo header
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    filterButtonActive: {
        backgroundColor: '#5e2b83ff', // un lila más vivo para el activo
        shadowOpacity: 0.3,
        transform: [{ scale: 1.05 }],
    },
    filterText: {
        fontSize: 16,
        color: '#E0E0E0', 
    },
    filterTextActive: {
        color: '#FFF', 
        fontWeight: 'bold',
    },
});
