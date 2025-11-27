import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { supabase } from "../../api/supabaseClient";
import Button from "../../../components/Button";
import Link from "../../../components/Link";
import Header from "../../../components/Header";
import { Ionicons } from '@expo/vector-icons';
import { materialColors } from "../../../utils/colors"; 

// Tipo de las props de la ruta (para recibir el email)
type RouteParams = { email?: string }; 

export default function NewPassword() {
    const navigation = useNavigation();
    const route = useRoute();
    
    // se precarga el Email
    const initialEmail = (route.params as RouteParams)?.email || '';

    const [email, setEmail] = useState(initialEmail);
    const [token, setToken] = useState(""); 
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    
    const [passwordVisible, setPasswordVisible] = useState(false); 
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleReset = async () => {
        if (!email || !token || !newPassword || newPassword !== confirmPassword) {
            Alert.alert("Error", "Por favor, completa todos los campos y verifica que las contraseñas coincidan.");
            return;
        }
        // Validación de 6 dígitos
        if (newPassword.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Verificar el Código OTP/Token (¡Esto activa la sesión!)
            const { error: verifyError } = await supabase.auth.verifyOtp({
                email: email,
                token: token, 
                type: 'email', // Tipo:'email' porque es lo que Supabase espera para el canal de email
            });

            if (verifyError) {
                Alert.alert("Error de Código", verifyError.message);
                setIsSubmitting(false);
                return;
            }
            
            // 2. Si es válido, la sesión temporal está activa. Cambiamos la contraseña.
            const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

            if (updateError) {
                Alert.alert("Error al Actualizar", updateError.message);
            } else {
                Alert.alert("Éxito", "Contraseña actualizada correctamente. ¡Ya puedes iniciar sesión!");
                // Cerramos la sesión temporal y volvemos al login
                await supabase.auth.signOut(); 
                // @ts-ignore
                navigation.reset({ index: 0, routes: [{ name: "Login" }] });
            }

        } catch (e: any) {
            Alert.alert("Error", e.message || "Algo salió mal. Intenta nuevamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <Header />
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    
                    <Text style={styles.mainTitle}>Acceso a tu Cuenta</Text>
                    <Text style={styles.subtitle}>Ingresa el código del email y tu nueva contraseña</Text>

                    {/* Campo Email */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput 
                            placeholder="tu@email.com" 
                            placeholderTextColor={materialColors.schemes.light.outline}
                            value={email} 
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!initialEmail} 
                            style={[styles.input, initialEmail && styles.inputDisabled]}
                        />
                    </View>

                    {/* Campo Token/Código */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Código de Seguridad</Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Pega el código del email aquí" 
                            placeholderTextColor={materialColors.schemes.light.outline}
                            value={token} 
                            onChangeText={setToken}
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Campo Nueva Contraseña */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nueva Contraseña</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput 
                                style={styles.passwordInput}
                                secureTextEntry={!passwordVisible} 
                                placeholder="Mínimo 6 caracteres" 
                                placeholderTextColor={materialColors.schemes.light.outline}
                                value={newPassword}
                                onChangeText={setNewPassword}
                            />
                            <TouchableOpacity style={styles.eyeIcon} onPress={() => setPasswordVisible(!passwordVisible)}>
                                <Ionicons name={passwordVisible ? "eye" : "eye-off"} size={20} color={materialColors.schemes.light.outline} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Campo Confirmar Contraseña */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirmar Contraseña</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput 
                                style={styles.passwordInput} 
                                secureTextEntry={!passwordVisible}
                                placeholder="Repite tu nueva contraseña" 
                                placeholderTextColor={materialColors.schemes.light.outline}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <TouchableOpacity style={styles.eyeIcon} onPress={() => setPasswordVisible(!passwordVisible)}>
                                <Ionicons name={passwordVisible ? "eye" : "eye-off"} size={20} color={materialColors.schemes.light.outline} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Button 
                        title={isSubmitting ? "ACTUALIZANDO..." : "Actualizar Contraseña"}
                        onPress={handleReset} 
                        disabled={isSubmitting} 
                    />

                    <View style={styles.linksContainer}>
                        <Link link="Volver al Login" onPress={() => navigation.goBack()} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: materialColors.schemes.light.background
    },
    scrollContainer: { 
        flexGrow: 1, 
        justifyContent: 'center', 
        paddingHorizontal: 24, 
        paddingVertical: 20,
    },
    mainTitle: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: materialColors.schemes.light.primary, 
        textAlign: 'center', 
        marginBottom: 8, 
    },
    subtitle: {
        fontSize: 14,
        color: materialColors.schemes.light.onSurfaceVariant,
        textAlign: 'center',
        marginBottom: 32,
    },
    inputContainer: { 
        marginBottom: 18 
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: materialColors.schemes.light.onBackground,
        marginBottom: 8,
        marginLeft: 4,
    },
    input: { 
        backgroundColor: materialColors.schemes.light.surface,
        borderColor: materialColors.schemes.light.outline,
        color: materialColors.schemes.light.onSurface,
        borderWidth: 1, 
        borderRadius: 12, 
        paddingHorizontal: 16, 
        paddingVertical: 12, 
        fontSize: 16,
    },
    inputDisabled: {
        backgroundColor: materialColors.schemes.light.surfaceVariant,
        color: materialColors.schemes.light.onSurfaceVariant,
    },
    passwordContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: materialColors.schemes.light.surface,
        borderColor: materialColors.schemes.light.outline,
        borderWidth: 1, 
        borderRadius: 12, 
        paddingHorizontal: 16,
    },
    passwordInput: { 
        flex: 1, 
        paddingVertical: 12, 
        fontSize: 16,
        color: materialColors.schemes.light.onSurface,
    },
    eyeIcon: { 
        padding: 8,
    },
    linksContainer: { 
        marginTop: 24, 
        alignItems: 'center' 
    },
});
