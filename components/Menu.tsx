import { FlatList, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import ItemMenu from "./ItemMenu";


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

    return (
        <View style={style}>
            <TouchableOpacity style={{ position: "absolute", left: 10, top: 10 }} onPress={onPress}>
                <Ionicons name="menu" size={30} color="black" />
                {
                    press && (
                        <View>
                            {
                                itemList.map((item: ItemProps, index) =>
                                    <TouchableOpacity key={index} style={styles.item} >
                                        <ItemMenu name={item.name} logo={item.logo}/>
                                    </TouchableOpacity>
                                )
                            }
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
