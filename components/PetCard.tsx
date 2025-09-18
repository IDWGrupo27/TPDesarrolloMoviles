import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/RootStackParamList';

interface PetCardProps {
    pet: {
        id: number;
        name: string;
        photos: { medium: string }[];
        [key: string]: any;
    }
}

export default function PetCard({ pet }: PetCardProps) {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const cardWidth = Dimensions.get('window').width - 40;
    const [imageAspect, setImageAspect] = useState(1.5);

    useEffect(() => {
        Image.getSize(pet.photos[0].medium, (width, height) => {
            setImageAspect(width / height);
        }, (error) => {
            console.warn("No se pudo obtener tamaño de imagen:", error);
        });
    }, [pet.photos]);

    return (
        <TouchableOpacity 
            onPress={() => navigation.navigate("DetalleMascota", { pet })}
            style={[styles.petCard, { width: cardWidth }]}
        >
            <View style={[styles.imageWrapper, { aspectRatio: imageAspect }]}>
                <Image
                    source={{ uri: pet.photos[0].medium }}
                    style={styles.petImage}
                    resizeMode="contain"
                />
            </View>
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
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    petImage: {
        width: '100%',
        height: '100%',
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
