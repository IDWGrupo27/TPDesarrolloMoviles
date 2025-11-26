import { Linking } from "react-native";

export const openWhatsApp = async () => {
    let phone = '5493442679769';
    let url = `whatsapp://send?phone=${phone}`;

    await Linking.canOpenURL(url)
        .then((supported) => {
            if (!supported) {
                alert('WhatsApp no está instalado en este dispositivo');
            } else {
                return Linking.openURL(url);
            }
        })
        .catch((err) => console.error('Error al abrir WhatsApp', err));
};

export const openInstagram = async () => {

    const url = `instagram://user?username=gonzamendez.6`;

    await Linking.canOpenURL(url)
        .then((supported) => {
            if (!supported) {
                alert('WhatsApp no está instalado en este dispositivo');

            } else {
                return Linking.openURL(url);
            }
        })
        .catch((err)=> {
            console.error('Error al abrir Instagram', err)
    }) 
 } 

export const openGmail = async () => {

    const url = `mailto:petway@gmail.com?subject=${encodeURIComponent('Consultas PetWay')}`;

    await Linking.canOpenURL(url)
        .then((supported) => {
            if (!supported) {
                alert('Gmail no está instalado en este dispositivo');

            } else {
                return Linking.openURL(url);
            }
        })
        .catch((err)=> {
            console.error('Error al abrir Instagram', err)
    }) 
 } 
