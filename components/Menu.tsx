import { FlatList, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import ItemMenu from "./ItemMenu";
import { useContext } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TAB_ROUTES } from "../utils/constants";


interface ShowMenu {
    press: boolean,
    onPress: () => void,
    style?: ViewStyle
}

interface ItemProps {
    name: string
    logo: string
    route?: string | undefined
}

const itemList: ItemProps[] = [
    { name: 'Inicio', logo: 'home-outline', route: `${TAB_ROUTES.HOME}` },
    { name: 'Mi cuenta', logo: 'person', route: `${TAB_ROUTES.PERFIL}`},
    { name: 'Refugios', logo: 'location-sharp', },
    { name: 'Ayuda', logo: 'help-circle', },
    { name: 'Configuracion', logo: 'cog', },
]



export default function Menu(prop: ShowMenu): any {

    const route = useRoute()

    const { press, onPress, style } = prop

    if (route.name === 'Login' || route.name === 'Registrer' || route.name === 'ForgotPassword' || route.name === 'NewPassword'  ) {
        return null
    }

    const navigation = useNavigation()

    return (


        <View style={style}>
            <TouchableOpacity style={{ position: "absolute", left: 10, top: 10 }} onPress={onPress}>
                <Ionicons name="menu" size={30} color="black" />
                {
                    press && (
                        <View>
                            {
                                itemList.map((item: ItemProps, index) =>
                                    <TouchableOpacity key={index} style={styles.item}>
                                        <ItemMenu name={item.name} logo={item.logo} />
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
