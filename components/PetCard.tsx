import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/RootStackParamList';
import AspectRatioImage from './AspectRatioImage'; 
import { Pet} from "../utils/helpers/petfinderHelpers";

interface PetCardProps {
    pet:Pet;
}

export default function PetCard({ pet }: PetCardProps) {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const cardWidth = Dimensions.get('window').width - 40;

    return (
        <TouchableOpacity 
            onPress={() => navigation.navigate("DetalleMascota", { pet })}
            style={[styles.petCard, { width: cardWidth }]}
        >
           
            {pet.photos && pet.photos[0] && (
                <AspectRatioImage uri={pet.photos[0].medium} style={styles.imageWrapper} />
            )}

            <View style={styles.petNameContainer}>
                <Text style={styles.petName}>{pet.name}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    petCard: {
        marginBottom: 20,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        alignSelf: 'center',
        flexDirection: 'column',
    },
    imageWrapper: {
        width: '100%',
    },
    petNameContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingVertical: 6,
        alignItems: 'center',
    },
    petName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
