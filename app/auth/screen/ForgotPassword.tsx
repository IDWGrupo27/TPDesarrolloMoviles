// app/auth/screen/ForgotPassword.tsx

import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import * as Yup from 'yup';
import { useNavigation } from "@react-navigation/native";

import Header from "../../../components/Header";
import Button from "../../../components/Button";
import Link from "../../../components/Link";
import { supabase } from "../../api/supabaseClient";
import { materialColors } from "../../../utils/colors";

// --- 1. Reglas de Validación (solo para el email) ---
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Formato de email incorrecto')
    .required('El email es requerido'),
});

export default function ForgotPassword() {
  const navigation = useNavigation();
  const [emailFocused, setEmailFocused] = useState(false);

  // --- 2. La Lógica para llamar a Supabase ---
  const handlePasswordReset = async (values: { email: string }, { setSubmitting }: any) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: '', // Puedes dejar esto vacío por ahora
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert(
          'Revisa tu correo',
          'Si existe una cuenta con ese email, hemos enviado las instrucciones para restablecer tu contraseña.'
        );
        navigation.goBack(); // Vuelve a la pantalla de Login
      }
    } catch (e: any) {
      Alert.alert('Error', 'Algo salió mal. Intenta nuevamente.');
    } finally {
      setSubmitting(false); // Le decimos a Formik que terminamos
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="height" style={styles.keyboardView}>
        <Header />
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          
          {/* --- 3. El Cerebro del Formulario --- */}
          <Formik
            initialValues={{ email: '' }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={handlePasswordReset}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, isSubmitting }) => (
              <View style={styles.formContainer}>
                <Text style={styles.title}>Recuperar Contraseña</Text>
                <Text style={styles.subtitle}>
                  Ingresa tu email y te enviaremos las instrucciones para restablecer tu contraseña.
                </Text>

                {/* --- 4. La Parte Visual del Formulario --- */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, emailFocused && styles.labelFocused]}>
                    Email
                  </Text>
                  <TextInput
                    style={[styles.input, emailFocused && styles.inputFocused]}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={values.email}
                    onBlur={(e) => { handleBlur('email')(e); setEmailFocused(false); }}
                    onChangeText={handleChange('email')}
                    onFocus={() => setEmailFocused(true)}
                    placeholder="tu@email.com"
                  />
                  {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </View>

                <Button onPress={handleSubmit} disabled={!isValid || isSubmitting} title="Enviar Instrucciones" />

                <View style={styles.linksContainer}>
                  <Link link="Volver al Login" onPress={() => navigation.goBack()} />
                </View>
              </View>
            )}
          </Formik>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- 5. Estilos (muy parecidos a los de tu Login) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: materialColors.schemes.light.background },
  keyboardView: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center' },
  formContainer: { paddingHorizontal: 24, paddingBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 32 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: materialColors.schemes.light.onBackground, marginBottom: 8, marginLeft: 4 },
  labelFocused: { color: materialColors.schemes.dark.onPrimary },
  input: { borderWidth: 2, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 16, backgroundColor: '#F9FAFB', color: '#1F2937' },
  inputFocused: { borderColor: materialColors.schemes.light.primary },
  errorText: { color: materialColors.schemes.light.error, fontSize: 12, marginTop: 4, marginLeft: 4 },
  linksContainer: { marginTop: 32, alignItems: 'center' },
});