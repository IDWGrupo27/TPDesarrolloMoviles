import styled from "styled-components/native";
import Header from "../../../../components/Header";
import { Image, TouchableOpacity, TextInput, View, Alert, Text, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../../../api/supabaseClient";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

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
    margin-vertical: 10px;
`;

const BioText = styled.Text`
    font-size: 16px;
    text-align: center;
    padding-vertical: 20px;
    border-bottom-width: 1px;
    border-bottom-color: #ccc;
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

const EditableField = styled.TextInput`
    font-size: 16px;
    color: black;
    width: 100%;
    padding-vertical: 4px;
    border-bottom-width: 1px;
    border-bottom-color: #ccc;
`;

const ProfileButtons = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

const ProfileButton = styled.TouchableOpacity`
    padding: 10px;
    border-radius: 5px;
    align-items: center;
    margin-right: 10px;
    flex: 0.3;
    background-color: #de9bf873;
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

export default function Perfil() {
    const navigation = useNavigation();
    const [profile, setProfile] = useState<Profile | null>(null);

    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

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
                setAvatarUrl(data.avatar_url || null);
                setNewDescripcion(data.descripcion || "");
                setNewTelefono(data.telefono || "");
                setNewDireccion(data.direccion || "");
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
            Alert.alert("Perfil actualizado", "Tu perfil se actualizó correctamente.");
        }
    };

    const pickAndUploadImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permiso necesario", "Se necesita permiso para acceder a la galería.");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: "images",
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (result.canceled) return;

            const uri = result.assets?.[0]?.uri ?? (result as any).uri;
            if (!uri) return;

            setUploading(true);

            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) throw new Error("No user");

            // -> Usar arrayBuffer en vez de blob (más compatible en RN/Expo)
            const response = await fetch(uri);
            const arrayBuffer = await response.arrayBuffer();
            const fileBuffer = new Uint8Array(arrayBuffer);

            // detectar extensión
            const extMatch = uri.split(".").pop();
            const ext = extMatch ? extMatch.split(/\#|\?/)[0] : "jpg";
            const contentType = `image/${ext === "jpg" ? "jpeg" : ext}`;

            const filePath = `avatars/${user.id}-${Date.now()}.${ext}`;

            const { data, error } = await supabase.storage
                .from("avatars")
                .upload(filePath, fileBuffer, { cacheControl: "3600", upsert: true, contentType });

            if (error) {
                console.error("Upload error:", error);
                Alert.alert("Error", "No se pudo subir la imagen.");
                return;
            }

            const { data: publicData } = supabase.storage.from("avatars").getPublicUrl(filePath);
            const publicUrl = publicData.publicUrl;

            const { error: profileError } = await supabase
                .from("profiles")
                .update({ avatar_url: publicUrl })
                .eq("id", user.id);

            if (profileError) {
                console.error("Profile update error:", profileError);
                Alert.alert("Error", "No se pudo guardar la imagen en tu perfil.");
            } else {
                setAvatarUrl(publicUrl);
                Alert.alert("Éxito", "Foto de perfil actualizada.");
            }
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "Algo salió mal al subir la imagen.");
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return profile ? (
            <ScrollView>
                <Header />
                <Container>
                    <Frame>
                        <View style={{ position: "relative" }}>
                            <Image
                                source={
                                    avatarUrl
                                        ? { uri: avatarUrl }
                                        : require("../../../../assets/profile.png")
                                }
                                style={{ width: 125, height: 125, borderRadius: 75 }}
                            />
                            {editing && (
                                <TouchableOpacity
                                    onPress={pickAndUploadImage}
                                    style={{
                                        backgroundColor: "#c3d6b8c2",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: 15,
                                        padding: 10,
                                        position: "absolute",
                                        bottom: 0,
                                        right: 0,
                                    }}
                                >
                                    <FontAwesome name="camera" size={24} color="black" />
                                </TouchableOpacity>
                            )}
                        </View>
                        <Title>
                            {profile.nombre} {profile.apellido}
                        </Title>
                        <ProfileInfo>
                            <InfoField>
                                {editing ? (
                                    <>
                                        <EditableField
                                            value={newDescripcion}
                                            onChangeText={setNewDescripcion}
                                        />
                                    </>
                                ) : (
                                    <BioText>{profile.descripcion || "Sin descripción"}</BioText>
                                )}
                            </InfoField>

                            <InfoField>
                                <InfoLabel>Teléfono</InfoLabel>
                                {editing ? (
                                    <EditableField
                                        value={newTelefono}
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
                                        value={newDireccion}
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
                            <ProfileButtons>
                                <ProfileButton onPress={updateProfile}>
                                    <InfoText style={{ color: "blue" }}>Guardar</InfoText>
                                </ProfileButton>
                                <ProfileButton onPress={() => setEditing(false)}>
                                    <InfoText style={{ color: "red" }}>Cancelar</InfoText>
                                </ProfileButton>
                            </ProfileButtons>
                        ) : (
                            <ProfileButtons>
                                <ProfileButton onPress={() => setEditing(true)}>
                                    <InfoText style={{ color: "blue" }}>Editar Perfil</InfoText>
                                </ProfileButton>
                            </ProfileButtons>
                        )}
                    </Frame>
                </Container>
            </ScrollView>
    ) : null;
}
