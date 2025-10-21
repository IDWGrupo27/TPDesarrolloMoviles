// app/auth/screen/NewPassword.tsx

import React, { useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../../components/Button";
import { supabase } from "../../api/supabaseClient";
import { materialColors } from "../../../utils/colors";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from "../../../utils/RootStackParamList";
import { AuthContext, AUTH_ACTIONS } from "../../../shares/context";

export default function NewPassword() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { dispatch } = useContext(AuthContext);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    // ... (tus validaciones de contraseña quedan igual)
    if (password !== confirmPassword) {
      return Alert.alert('Error', 'Las contraseñas no coinciden.');
    }
    if (password.length < 6) {
      return Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password: password });
    setLoading(false);

    if (updateError) {
      Alert.alert('Error', updateError.message);
    } else {
      Alert.alert(
        'Éxito',
        'Tu contraseña ha sido actualizada. Serás redirigido al Login.',
        [
          {
            text: 'OK',
            onPress: () => {
              // --- 👇 ¡ESTA ES LA ACCIÓN FORZADA! 👇 ---

              // 1. AVISO INMEDIATO AL ESTADO GLOBAL
              dispatch({ type: AUTH_ACTIONS.LOGOUT });
              
              // 2. ORDEN DIRECTA Y AGRESIVA AL NAVEGADOR
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });

              // 3. TAREA EN SEGUNDO PLANO (Fire and Forget)
              supabase.auth.signOut();
            }
          }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Crea una Nueva Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Nueva Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Nueva Contraseña"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Button
          title={loading ? "Actualizando..." : "Actualizar Contraseña"}
          onPress={handleUpdatePassword}
          disabled={loading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: materialColors.schemes.light.background, justifyContent: 'center' },
  formContainer: { paddingHorizontal: 24 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 32 },
  input: { borderWidth: 2, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 16, marginBottom: 20 },
});