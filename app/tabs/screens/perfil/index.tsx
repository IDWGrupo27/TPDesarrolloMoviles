import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import Header from "../../../../components/Header";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useEffect, useState } from "react";
import { supabase } from "../../../api/supabaseClient";
import { AuthContext } from "../../../../shares/context";
import * as ImagePicker from "expo-image-picker";
import { Directory, File, Paths } from "expo-file-system";

const Container = styled.View`
    flex: 1;
    background-color: #fff;
`;

const Frame = styled.View`
    width: 100%;
    align-items: stretch;
    margin-bottom: 20px;
`;

const ProfileInfo = styled.View`
    margin-bottom: 24px;
    align-items: stretch;
    width: 100%;
    gap: 12px;
`;

const Title = styled.Text`
    font-size: 24px;
    font-weight: 800;
    color: #111315;
    flex: 1;
`;

const BioText = styled.Text`
    font-size: 16px;
    text-align: center;
    margin-bottom: 20px;
    padding: 10px;
`;

const InfoField = styled.View`
    flex-direction: column;
    gap: 6px;
    width: 100%;
`;

const InfoLabel = styled.Text`
    font-size: 14px;
    color: #6b7280;
`;

const InfoText = styled.Text`
    font-size: 16px;
    color: #111315;
`;

const StyledInput = styled.TextInput`
    font-size: 16px;
    color: #111315;
    width: 100%;
    border-width: 1px;
    border-color: #E5E7EB;
    border-radius: 10px;
    padding: 12px;
    background-color: #fff;
`;

const StyledMultiline = styled.TextInput`
    font-size: 16px;
    color: #111315;
    min-height: 120px;
    width: 100%;
    border-width: 1px;
    border-color: #E5E7EB;
    border-radius: 10px;
    padding: 12px;
    background-color: #fff;
`;

const ButtonsRow = styled.View`
    flex-direction: row;
    gap: 12px;
    margin-top: 12px;
    margin-bottom: 16px;
    align-self: stretch;
`;

const GhostButton = styled.TouchableOpacity`
    flex: 1;
    border-width: 1px;
    border-color: #E5E7EB;
    background-color: #F9FAFB;
    padding: 12px;
    border-radius: 12px;
`;

const GhostText = styled.Text`
    color: #111315;
    text-align: center;
    font-weight: 600;
`;

const PrimaryButton = styled.TouchableOpacity`
    background-color: #7A4F81;
    padding: 14px;
    border-radius: 12px;
    align-self: stretch;
`;

const PrimaryText = styled.Text`
    color: white;
    text-align: center;
    font-weight: 700;
    font-size: 16px;
`;

const OutlineButton = styled.TouchableOpacity`
    border: 1px solid #7A4F81;
    padding: 12px 14px;
    border-radius: 12px;
`;

const OutlineText = styled.Text`
    color: #7A4F81;
    text-align: center;
    font-weight: 700;
    font-size: 16px;
`;

const HeaderRow = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    margin-bottom: 12px;
`;

const AvatarContainer = styled.View`
    align-items: center;
    margin-bottom: 12px;
`;

const FooterButtons = styled.View`
    gap: 12px;
`;

type ProfileRow = {
    id: string;
    nombre: string;
    apellido: string;
    direccion: string;
    telefono: string;
    descripcion?: string | null;
    avatar_url?: string | null;
};

export default function Perfil() {
    const navigation = useNavigation();
    const { state } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [direccion, setDireccion] = useState("");
    const [telefono, setTelefono] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
    const [isEditing, setIsEditing] = useState(false);
    const [snapshot, setSnapshot] = useState<{
        nombre: string; apellido: string; direccion: string; telefono: string; descripcion: string; avatarUrl?: string
    } | null>(null);

    const email = state?.user?.email ?? "";
    const userId = state?.user?.id;

    useEffect(() => {
        let isMounted = true;

        const fetchProfile = async () => {
            if (!userId) return;
            if (isMounted) setLoading(true);

            try {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("id,nombre,apellido,direccion,telefono,descripcion,avatar_url")
                    .eq("id", userId)
                    .maybeSingle();

                if (!isMounted) return;

                if (error) {
                    console.log("Perfil: error al cargar", error);
                }
                if (data) {
                    setNombre(data.nombre || "");
                    setApellido(data.apellido || "");
                    setDireccion(data.direccion || "");
                    setTelefono(data.telefono || "");
                    setDescripcion(data.descripcion || "");
                    const baseUri = data.avatar_url || undefined;
                    const stamped = baseUri ? `${baseUri.split('?')[0]}?t=${Date.now()}` : undefined;
                    setAvatarUrl(stamped);
                    setIsEditing(false);
                    setSnapshot({
                        nombre: data.nombre || "",
                        apellido: data.apellido || "",
                        direccion: data.direccion || "",
                        telefono: data.telefono || "",
                        descripcion: data.descripcion || "",
                        avatarUrl: stamped,
                    });
                }
            } catch (e) {
                console.error("Error cargando perfil:", e);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchProfile();
        return () => {
            isMounted = false;
        };
    }, [userId]);

    const enterEdit = () => {
        setSnapshot({ nombre, apellido, direccion, telefono, descripcion, avatarUrl });
        setIsEditing(true);
    };

    const cancelEdit = () => {
        if (snapshot) {
            setNombre(snapshot.nombre);
            setApellido(snapshot.apellido);
            setDireccion(snapshot.direccion);
            setTelefono(snapshot.telefono);
            setDescripcion(snapshot.descripcion);
            setAvatarUrl(snapshot.avatarUrl);
        }
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (!userId) return;
        try {
            setLoading(true);
            // Guardar sin timestamp (quitar query params)
            const cleanAvatarUrl = avatarUrl ? avatarUrl.split('?')[0] : null;
            const payload: Partial<ProfileRow> = {
                id: userId,
                nombre,
                apellido,
                direccion,
                telefono,
                descripcion,
                avatar_url: cleanAvatarUrl,
            };
            const { error } = await supabase
                .from("profiles")
                .upsert(payload, { onConflict: "id" });
            if (error) throw error;
            setIsEditing(false);
            setSnapshot({ nombre, apellido, direccion, telefono, descripcion, avatarUrl });
            Alert.alert("Perfil", "Datos guardados correctamente");
        } catch (e: any) {
            Alert.alert("Error", e.message || "No se pudo guardar el perfil");
        } finally {
            setLoading(false);
        }
    };

    const saveImageLocally = async (uri: string) => {
        if (!userId) throw new Error("Usuario no identificado");
        
        // Usar la nueva API de Expo v54
        const avatarsDir = new Directory(Paths.document, "avatars");
        
        // Crear directorio si no existe
        if (!(await avatarsDir.exists)) {
            await avatarsDir.create();
        }
        
        // Eliminar archivo previo si existe
        const destFile = new File(avatarsDir, `${userId}.jpg`);
        if (await destFile.exists) {
            await destFile.delete();
        }
        
        // Copiar archivo nuevo
        const sourceFile = new File(uri);
        await sourceFile.copy(destFile);
        
        // Agregar timestamp para evitar cache de React Native Image
        return `${destFile.uri}?t=${Date.now()}`;
    };

    const pickFromLibrary = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permisos", "Se requiere permiso para la galería");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });
        if (!result.canceled) {
            try {
                setLoading(true);
                const uri = result.assets[0].uri;
                const localPath = await saveImageLocally(uri);
                setAvatarUrl(localPath);
                Alert.alert("Foto", "Avatar guardada localmente");
            } catch (e: any) {
                Alert.alert("Error", e.message || "No se pudo subir la imagen");
            } finally {
                setLoading(false);
            }
        }
    };

    const pickFromCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permisos", "Se requiere permiso para la cámara");
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.8,
        });
        if (!result.canceled) {
            try {
                setLoading(true);
                const uri = result.assets[0].uri;
                const localPath = await saveImageLocally(uri);
                setAvatarUrl(localPath);
                Alert.alert("Foto", "Avatar guardada localmente");
            } catch (e: any) {
                Alert.alert("Error", e.message || "No se pudo subir la imagen");
            } finally {
                setLoading(false);
            }
        }
    };

    const displayName = `${nombre || ""} ${apellido || ""}`.trim() || "Tu Perfil";

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <Header />
            <Container>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
                        <Frame>
                            <HeaderRow>
                                <Title numberOfLines={1} ellipsizeMode="tail">{displayName}</Title>
                                {!isEditing ? (
                                    <OutlineButton onPress={enterEdit}>
                                        <OutlineText>Editar</OutlineText>
                                    </OutlineButton>
                                ) : null}
                            </HeaderRow>

                            <AvatarContainer>
                                {avatarUrl ? (
                                    <Image source={{ uri: avatarUrl }} style={{ width: 132, height: 132, borderRadius: 80 }} />
                                ) : (
                                    <Image source={require("../../../../assets/profile.png")} style={{ width: 132, height: 132, borderRadius: 80 }} />
                                )}
                            </AvatarContainer>

                            <ButtonsRow>
                                <GhostButton onPress={pickFromLibrary} disabled={!isEditing} style={{ opacity: isEditing ? 1 : 0.5 }}>
                                    <GhostText>🖼️ Galería</GhostText>
                                </GhostButton>
                                <GhostButton onPress={pickFromCamera} disabled={!isEditing} style={{ opacity: isEditing ? 1 : 0.5 }}>
                                    <GhostText>📷 Cámara</GhostText>
                                </GhostButton>
                            </ButtonsRow>

                            <ProfileInfo>
                                <InfoField>
                                    <InfoLabel>Email (no editable)</InfoLabel>
                                    <InfoText>{email}</InfoText>
                                </InfoField>
                                <InfoField>
                                    <InfoLabel>Nombre</InfoLabel>
                                    <StyledInput value={nombre} onChangeText={setNombre} placeholder="Nombre" editable={isEditing} style={{ backgroundColor: isEditing ? '#fff' : '#F3F4F6' }} />
                                </InfoField>
                                <InfoField>
                                    <InfoLabel>Apellido</InfoLabel>
                                    <StyledInput value={apellido} onChangeText={setApellido} placeholder="Apellido" editable={isEditing} style={{ backgroundColor: isEditing ? '#fff' : '#F3F4F6' }} />
                                </InfoField>
                                <InfoField>
                                    <InfoLabel>Dirección</InfoLabel>
                                    <StyledInput value={direccion} onChangeText={setDireccion} placeholder="Dirección" editable={isEditing} style={{ backgroundColor: isEditing ? '#fff' : '#F3F4F6' }} />
                                </InfoField>
                                <InfoField>
                                    <InfoLabel>Teléfono</InfoLabel>
                                    <StyledInput value={telefono} onChangeText={setTelefono} placeholder="Teléfono" keyboardType="phone-pad" editable={isEditing} style={{ backgroundColor: isEditing ? '#fff' : '#F3F4F6' }} />
                                </InfoField>
                                <InfoField>
                                    <InfoLabel>Descripción</InfoLabel>
                                    <StyledMultiline value={descripcion} onChangeText={setDescripcion} placeholder="Sobre mí" multiline editable={isEditing} style={{ backgroundColor: isEditing ? '#fff' : '#F3F4F6', textAlignVertical: 'top' }} />
                                </InfoField>
                            </ProfileInfo>

                            {isEditing ? (
                                <FooterButtons>
                                    <OutlineButton onPress={cancelEdit}>
                                        <OutlineText>Cancelar</OutlineText>
                                    </OutlineButton>
                                    <PrimaryButton disabled={loading} onPress={handleSave}>
                                        <PrimaryText>{loading ? 'Guardando...' : 'Guardar'}</PrimaryText>
                                    </PrimaryButton>
                                </FooterButtons>
                            ) : null}
                        </Frame>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Container>
        </SafeAreaView>
    );
}
