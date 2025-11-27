import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import Header from "../../../../components/Header";
import { Image, TouchableOpacity, TextInput, View } from "react-native";
import { supabase } from "../../../api/supabaseClient";
import { useEffect, useState } from "react";

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
  id: string;
  nombre: string;
  apellido: string;
  descripcion: string;
  email: string;
  telefono: string;
  direccion: string;
}

const EditableField = styled.TextInput`
  font-size: 16px;
  color: black;
  width: 100%;
  padding-vertical: 4px;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
`;

export default function Perfil() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState<Profile | null>(null);

  const [editing, setEditing] = useState(false);
  const [newTelefono, setNewTelefono] = useState("");
  const [newDireccion, setNewDireccion] = useState("");
  const [newDescripcion, setNewDescripcion] = useState("");

  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        const profileData: Profile = {
          id: data.id,
          nombre: data.nombre,
          apellido: data.apellido,
          descripcion: data.descripcion,
          email: user.email || "",
          telefono: data.telefono,
          direccion: data.direccion,
        };
        setProfile(profileData);
      }
    }
  };

  const updateProfile = async () => {
    if (!profile) return;
    const updatedProfile = {
        descripcion: newDescripcion || profile.descripcion,
        telefono: newTelefono || profile.telefono,
        direccion: newDireccion || profile.direccion,
    };
    const { error } = await supabase
      .from("profiles")
      .update(updatedProfile)
      .eq("id", profile.id);
    if (error) {
      console.error("Error updating profile:", error);
    } else {
      setProfile({ ...profile, ...updatedProfile });
      setEditing(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return profile ? (
    <>
      <Header />
      <Container>
        <Frame>
          <Image
            source={require("../../../../assets/profile.png")}
            style={{ width: 125, height: 125, borderRadius: 75 }}
          />
          <Title>
            {profile.nombre} {profile.apellido}
          </Title>
          <ProfileInfo>
            {editing ? (
              <>
                <EditableField
                  value={newDescripcion || profile.descripcion}
                  onChangeText={setNewDescripcion}
                  placeholder="Descripción"
                />
              </>
            ) : (
              <BioText>{profile.descripcion || "Sin descripción"}</BioText>
            )}
            <InfoField>
              <InfoLabel>Teléfono</InfoLabel>
              {editing ? (
                <EditableField
                  value={newTelefono || profile.telefono}
                  onChangeText={setNewTelefono}
                />
              ) : (
                <InfoText>{profile.telefono}</InfoText>
              )}
            </InfoField>
            <InfoField>
              <InfoLabel>Dirección</InfoLabel>
              {editing ? (
                <EditableField
                  value={newDireccion || profile.direccion}
                  onChangeText={setNewDireccion}
                />
              ) : (
                <InfoText>{profile.direccion}</InfoText>
              )}
            </InfoField>
            <InfoField>
              <InfoLabel>Email</InfoLabel>
              <InfoText>{profile.email}</InfoText>
            </InfoField>
          </ProfileInfo>
          {editing ? (
            <View style={{ flexDirection: "row", gap: 30 }}>
              <TouchableOpacity onPress={async () => {}}>
                <InfoText style={{ color: "blue" }}>Guardar</InfoText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditing(false)}>
                <InfoText style={{ color: "blue" }}>Cancelar</InfoText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setEditing(true)}>
              <InfoText style={{ color: "blue" }}>Editar Perfil</InfoText>
            </TouchableOpacity>
          )}
        </Frame>
      </Container>
    </>
  ) : null;
}
