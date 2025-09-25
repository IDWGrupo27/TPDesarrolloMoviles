import { useNavigation } from "@react-navigation/native"
import { View, Text } from "react-native"
import styled from "styled-components/native"
import Header from "../../../../components/Header";

const Container = styled.View`
  flex: 1;
  align-self: center;
  align-items: center;
  margin-top: 40px;
  width: 90%
`

const ProfileInfo = styled.View`
    margin-bottom: 20px;
    align-items: flex-start;
    width: 100%;
    gap: 5px;
`

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`

const Title2 = styled.Text`
    font-size: 20px;
`

const BioText = styled.Text`
  font-size: 16px;
  text-align: center;
  margin-bottom: 20px;
`

const Contact = styled.View`
  font-size: 16px;
  margin-bottom: 5px;
  flex-direction: column;
`

interface Profile {
    name: string;
    age: number;
    email: string;
    phone: string;
    address: string;
    bio: string;
}

const profile: Profile = {
    name: "Juan Perez",
    age: 25,
    email: "juan.perez@dam.com",
    phone: "54 9 11 1234-5678",
    address: "Florida 123, CABA",
    bio: "Lorem ipsum dolor sit amet. Consectetur adipiscing elit."
}

export default function Perfil() {
    const navigation = useNavigation()

    return (
        <>
            <Header />
            <Container>
                <Title>{profile.name}</Title>
                <ProfileInfo>
                    <Title2>Sobre mí</Title2>
                    <Text>{profile.age} años</Text>
                    <BioText>{profile.bio}</BioText>

                    <Contact>
                        <Title2>Contacto:</Title2>
                        <Text>{profile.email}</Text>
                        <Text>{profile.phone}</Text>
                        <Text>{profile.address}</Text>
                    </Contact>
                </ProfileInfo>
            </Container>
        </>
    );
}