import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { supabase } from "../../api/supabaseClient";
import Button from "../../../components/Button";
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
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    
                    <Text style={styles.mainTitle}>🔐 Acceso a tu Cuenta</Text>
                    <Text style={styles.instructionTitle}>Verificación y Nueva Contraseña</Text>

                    {/* Instrucciones */}
                    <View style={styles.instructionsContainer}>
                         <Text style={styles.instructionStep}>1. Revisa tu email (código de seguridad).</Text>
                         <Text style={styles.instructionStep}>2. Ingresa el código, tu email y tu nueva clave.</Text>
                         <Text style={styles.instructionStep}>3. ¡Listo! Acceso restaurado.</Text>
                    </View>

                    {/* Campo Email */}
                    <TextInput 
                        placeholder="Email (Usado para el reseteo)" 
                        placeholderTextColor="#777"
                        value={email} 
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!initialEmail} 
                        style={[styles.input, initialEmail && styles.inputDisabled]}
                    />

                    {/* Campo Token/Código */}
                    <TextInput 
                        style={styles.input} 
                        placeholder="Código de Seguridad (Token)" 
                        placeholderTextColor="#777"
                        value={token} 
                        onChangeText={setToken}
                        autoCapitalize="none"
                    />

                    {/* Campo Nueva Contraseña */}
                    <View style={styles.passwordContainer}>
                        <TextInput 
                            style={styles.passwordInput}
                            secureTextEntry={!passwordVisible} 
                            placeholder="Nueva Contraseña (mín. 6 caracteres)" 
                            placeholderTextColor="#777"
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                        <TouchableOpacity style={styles.eyeIcon} onPress={() => setPasswordVisible(!passwordVisible)}>
                            <Ionicons name={passwordVisible ? "eye" : "eye-off"} size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    {/* Campo Confirmar Contraseña */}
                    <View style={styles.passwordContainer}>
                        <TextInput 
                            style={styles.passwordInput} 
                            secureTextEntry={!passwordVisible}
                            placeholder="Confirmar Contraseña" 
                            placeholderTextColor="#777"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                        <TouchableOpacity style={styles.eyeIcon} onPress={() => setPasswordVisible(!passwordVisible)}>
                            <Ionicons name={passwordVisible ? "eye" : "eye-off"} size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <Button 
                        title={isSubmitting ? "ACTUALIZANDO..." : "ACTUALIZAR CONTRASEÑA"}
                        onPress={handleReset} 
                        disabled={isSubmitting} 
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: materialColors.schemes.light.surface 
    },
    scrollContainer: { 
        flexGrow: 1, 
        justifyContent: 'center', 
        paddingHorizontal: 24, 
        paddingVertical: 40,
    },
    mainTitle: { 
        fontSize: 28, 
        fontWeight: 'bold', 
        color: materialColors.schemes.light.primary, 
        textAlign: 'center', 
        marginBottom: 4, 
    },
    instructionTitle: {
        fontSize: 16, 
        color: materialColors.schemes.light.onSurfaceVariant, 
        textAlign: 'center', 
        marginBottom: 20, 
    },
    instructionsContainer: {
        backgroundColor: materialColors.schemes.light.surfaceVariant, 
        padding: 15,
        borderRadius: 12,
        marginBottom: 30,
    },
    instructionStep: {
        fontSize: 14,
        color: materialColors.schemes.light.onSurface,
        paddingVertical: 3,
        fontWeight: '600',
    },
    input: { 
        backgroundColor: materialColors.schemes.light.surface,
        borderColor: materialColors.schemes.light.outline,
        color: materialColors.schemes.light.onSurface, // Texto negro
        borderWidth: 1, 
        borderRadius: 12, 
        paddingHorizontal: 16, 
        paddingVertical: 12, 
        marginBottom: 15,
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
        marginBottom: 15,
        paddingHorizontal: 16,
    },
    passwordInput: { 
        flex: 1, 
        paddingVertical: 12, 
        fontSize: 16,
        color: materialColors.schemes.light.onSurface, // Texto negro
    },
    eyeIcon: { 
        padding: 5,
        marginLeft: 10,
    },
});
