import { FlatList, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import ItemMenu from "./ItemMenu";
import { useNavigation } from "@react-navigation/native";


interface ShowMenu {
    press: boolean,
    onPress: () => void,
    style?: ViewStyle
}

interface ItemProps {
    name: string
    logo: string
}

const itemList: ItemProps[] = [
    { name: 'Inicio', logo: 'home-outline', },
    { name: 'Mi cuenta', logo: 'person', },
    { name: 'Refugios', logo: 'location-sharp', },
    { name: 'Ayuda', logo: 'help-circle', },
    { name: 'Configuracion', logo: 'cog', },
]

export default function Menu(prop: ShowMenu): any {

    const { press, onPress, style } = prop
    const navigation = useNavigation()

    const handleSelectItem = (itemName: string) => {
        onPress();
        // Navegar a la pantalla correspondiente
        // 👉 navegar según la opción
        switch (itemName) {
            case "Inicio":
                navigation.navigate("TABS" as never);
                break;

            case "Mi cuenta":
                navigation.navigate("MiCuenta" as never);
                break;

            case "Refugios":
                navigation.navigate("Refugios" as never);
                break;

            case "Ayuda":
                navigation.navigate("Ayuda" as never);
                break;

            case "Configuracion":
                navigation.navigate("Configuracion" as never);
                break;
        }
    }


    return (
        <View style={style}>
            <TouchableOpacity style={{ position: "absolute", left: 10, top: 10 }} onPress={onPress}>
                <Ionicons name="menu" size={30} color="black" />
                {
                    press && (
                        <View>
                            {itemList.map((item: ItemProps, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.item}
                                    onPress={() => handleSelectItem(item.name)} // 👈 ahora navega
                                >
                                    <ItemMenu name={item.name} logo={item.logo} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    )
                }
            </TouchableOpacity>
        </View>
    )

}

const styles = StyleSheet.create({

    item: {
        height: 40,
        width: '100%',
        marginTop: 25,
        paddingLeft: 10

    }
})
