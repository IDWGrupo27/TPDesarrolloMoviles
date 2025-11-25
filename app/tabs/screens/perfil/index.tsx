import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import Header from "../../../../components/Header";
import { Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Container = styled.View`
    flex: 1;
    align-self: center;
    align-items: center;
    padding-top: 20px;
    background-color: #fff;
    width: 100%;
`;

const Frame = styled.View`
    width: 90%;
    align-items: center;
    margin-bottom: 20px;
`;

const ProfileInfo = styled.View`
    margin-bottom: 20px;
    align-items: flex-start;
    width: 100%;
    gap: 5px;
`;

const Title = styled.Text`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
`;

const BioText = styled.Text`
    font-size: 16px;
    text-align: center;
    margin-bottom: 20px;
    padding: 10px;
`;

const InfoField = styled.View`
    flex-direction: column;
    margin-bottom: 10px;
    padding: 8px;
    width: 100%;
    border-bottom-width: 1px;
    border-bottom-color: #ccc;
`;

const InfoLabel = styled.Text`
    font-size: 14px;
    color: #6e6c6cff;
    margin-bottom: 4px;
`;

const InfoText = styled.Text`
    font-size: 16px;
    color: black;
`;

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
    bio: "Trabajo en un refugio de animales donde ayudamos a cuidar y encontrar hogares para perros y gatos abandonados.",
};

export default function Perfil() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 10 }}>
            <Header />
            <Container>
                <Frame>
                    <Image
                        source={require("../../../../assets/profile.png")}
                        style={{ width: 125, height: 125, borderRadius: 75 }}
                    />
                    <Title>{profile.name}</Title>
                    <ProfileInfo>
                        <BioText>{profile.bio}</BioText>
                        <InfoField>
                            <InfoLabel>Email</InfoLabel>
                            <InfoText>{profile.email}</InfoText>
                        </InfoField>
                        <InfoField>
                            <InfoLabel>Teléfono</InfoLabel>
                            <InfoText>{profile.phone}</InfoText>
                        </InfoField>
                        <InfoField>
                            <InfoLabel>Dirección</InfoLabel>
                            <InfoText>{profile.address}</InfoText>
                        </InfoField>
                        <InfoField>
                            <InfoLabel>Edad</InfoLabel>
                            <InfoText>{profile.age} años</InfoText>
                        </InfoField>
                    </ProfileInfo>
                </Frame>
            </Container>
        </SafeAreaView>
    );
}
