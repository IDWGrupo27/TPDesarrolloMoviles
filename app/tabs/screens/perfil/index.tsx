import { useNavigation } from "@react-navigation/native"
import { View, Text } from "react-native"
import styled from "styled-components/native"

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`

export default function Perfil() {
    const navigation = useNavigation()

    return (
        <Container>
            <Text>Perfil</Text>
        </Container>
    )
}