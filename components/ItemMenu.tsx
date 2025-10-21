import { StyleSheet, Text, View } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';


interface ItemProps {
    name: string
    logo: string
}

export default function ItemMenu(item: ItemProps) {

    return (
        <View style={style.boxItem}>
            <Ionicons name={item.logo as any} size={24} color="white" />
            <Text style={style.item}> {item.name} </Text>
        </View>
    )
}

const style = StyleSheet.create({
    
    boxItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    
    item: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '900'
    }
})