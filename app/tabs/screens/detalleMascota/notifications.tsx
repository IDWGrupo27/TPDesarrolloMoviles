import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Linking, Platform } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Pet } from '../../../../utils/helpers/petfinderHelpers';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../utils/RootStackParamList';
import { useLastNotificationResponse } from 'expo-notifications'

interface DatosNotification {
    edad?: string
    genero?: string
    tamaño?: string
}

async function requestNotificationPermissions() {
    try {
        const { status: existingStatus } = await Notifications.requestPermissionsAsync()
        let finalStatus = existingStatus

        if (existingStatus !== Notifications.PermissionStatus.GRANTED) {
            const { status } = await Notifications.getPermissionsAsync()
            finalStatus = status
        }

        if (finalStatus !== Notifications.PermissionStatus.GRANTED) {
            return false
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
            });
        };


    } catch (error) {
        console.error('Error al solicitar permisos de notificaciones:', error);
        return false
    }

}


export const sendNotification = async (d: Date, pet: Pet, datos: DatosNotification) => {
    try {
        const permissions = requestNotificationPermissions()

        if (!permissions) {
            return null
        }

        const identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Recordatorio de adopcion!',
                body: `Generaste un recordatorio para una publicacion de adopcion que te intereso:\nNombre: ${pet.name}\nEdad: ${datos.edad}\nGénero: ${datos.genero}\nTamaño: ${datos.tamaño} `,
                data: { pet }
            },
            trigger: {
                date: d,
                type: Notifications.SchedulableTriggerInputTypes.DATE
            }
        });

        return identifier

    } catch (error) {
        console.error(error)
    }

}


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true
    })
});

export default function NotificationListener() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const lastNotificationResponse = useLastNotificationResponse()

    useEffect(() => {
        if (lastNotificationResponse) {
            const data = lastNotificationResponse.notification.request.content.data as { pet: Pet }
            if (data?.pet) {
                navigation.navigate('DetalleMascota', { pet: data.pet })
            }
        }
    }, [lastNotificationResponse, navigation])

    // Manejo de notificaciones mientras la app está abierta
    useEffect(() => {
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data as { pet: Pet }
            if (data?.pet) {
                navigation.navigate('DetalleMascota', { pet: data.pet })
            }
        })
        return () => subscription.remove()
    }, [navigation])

    return null
}



/*export default function NotificationListener() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    useEffect(() => {
        async function checkInitialNotification() {
            
            const lastResponse = Notifications.useLastNotificationResponse()

            if (lastResponse) {
                const data = lastResponse.notification.request.content.data as { pet: Pet }
                if (data?.pet) {
                    navigation.navigate("DetalleMascota", { pet: data.pet })
                }
            }
        }

        checkInitialNotification()


    useEffect(() => {
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data as { pet: Pet }
            if (data?.pet) {
                navigation.navigate('DetalleMascota', { pet: data.pet })
            }
        })
        return () => subscription.remove()
    }, [navigation])

}*/

