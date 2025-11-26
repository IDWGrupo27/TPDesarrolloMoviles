import React, { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import Header from "../../../../components/Header";
import { materialColors } from "../../../../utils/colors";
import { useNavigation } from "@react-navigation/native";
import { TAB_ROUTES } from "../../../../utils/constants";
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { openWhatsApp, openInstagram, openGmail } from './links';


export default function Nosotros() {


    const navigation = useNavigation()

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        Animated.timing(translateY, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 10 }}>
            <Header />
            <ScrollView>
                <Animated.View style={[{
                    opacity: fadeAnim,
                    transform: [{ translateY }],
                }]}>
                    <View style={styles.container}>
                        <Text style={styles.subtitle}>¿Quienes somos?</Text>
                        <Image
                            source={require("../../../../assets/petImage.png")}
                            style={styles.imgContainer}
                            resizeMode="contain" />
                        <Text style={styles.paragraph}>
                            PetWay es la aplicacion N° 1 en el mundo de la adopcion de mascotas, nuestro proposito
                            es brindarles a nuestros amiguitos de 4 patas la posibilidad de conseguir esa familia
                            que tanto amor les puede brindar
                        </Text>
                        <TouchableOpacity
                            style={styles.btn}
                            /*onPress={() => navigation.navigate(TAB_ROUTES.HOME)}*/>
                            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>ADOPTA AHORA</Text>
                        </TouchableOpacity>
                        <Text style={styles.paragraph}>
                            Nuestro equipo está formado por veterinarios, desarrolladores, voluntarios y amantes de los animales. Cada uno aporta desde su lugar para que más mascotas encuentren una familia.

                            Más de 500 mascotas adoptadas desde nuestro lanzamiento. Cada historia nos impulsa a seguir creciendo.
                        </Text>
                        <Text style={{ textAlign: 'center', fontSize: 16, padding: 15, fontStyle: 'italic' }}>
                            “No se trata solo de adoptar una mascota. Se trata de cambiar dos vidas para siempre.”
                        </Text>
                        <Image
                            source={require("../../../../assets/2petImage.png")}
                            style={styles.imgContainer}
                            resizeMode="contain" />
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={openWhatsApp}
                        >
                            <Ionicons name={'logo-whatsapp'} size={20} color={'#fff'} />
                            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>WHATSAPP</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={openGmail}

                        >
                            <Ionicons name={'mail-sharp'} size={20} color={'#fff'} />
                            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>GMAIL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={openInstagram}

                        >
                            <Ionicons name={'logo-instagram'} size={20} color={'#fff'} />
                            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>INSTAGRAM</Text>
                        </TouchableOpacity>

                    </View>
                </Animated.View>
            </ScrollView >
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10
    },

    subtitle: {
        color: materialColors.schemes.light.primary,
        fontSize: 40,
        textAlign: 'center',
        paddingTop: 50,
        fontWeight: 'bold'

    },

    imgContainer: {
        height: 300,
        width: '100%'
    },

    paragraph: {
        fontSize: 25,
        padding: 20,
        textAlign: 'center'
    },

    btn: {
        minWidth: 180,
        marginHorizontal: 30,
        marginVertical: 10,
        backgroundColor: '#5e2b83',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 25,
        flexDirection: 'row',
        gap: 5,
        justifyContent: 'center'
    }

})
