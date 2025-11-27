import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import * as Yup from 'yup';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import Header from "../../../components/Header";
import Button from "../../../components/Button";
import Link from "../../../components/Link";
import { supabase } from "../../api/supabaseClient";
import { materialColors } from "../../../utils/colors";

// --- 1. Reglas de Validación ---
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Formato de email incorrecto').required('El email es requerido'),
});

export default function ForgotPassword() {
  const navigation = useNavigation();
  const [emailFocused, setEmailFocused] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  // --- 2. Lógica para llamar a Supabase ---
  const handlePasswordReset = async (values: { email: string }, { setSubmitting }: any) => {
    try {
      // Usamos signInWithOtp (Magic Link) para enviar el código de seguridad
      const { error } = await supabase.auth.signInWithOtp({
          email: values.email,
          options: {
              
          },
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        // Mostrar pantalla de espera para copiar el código
        setEmailSent(true);
        setSentEmail(values.email);
      }
    } catch (e: any) {
      Alert.alert('Error', 'Algo salió mal. Intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="height" style={styles.keyboardView}>
        <Header />
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          
          {!emailSent ? (
            // Pantalla 1: Formulario para ingresar email
            <Formik
              initialValues={{ email: '' }}
              validationSchema={ForgotPasswordSchema}
              onSubmit={handlePasswordReset}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, isSubmitting }) => (
                <View style={styles.formContainer}>
                  <Text style={styles.title}>Recuperar Contraseña</Text>
                  <Text style={styles.subtitle}>
                    Ingresa tu email y te enviaremos un código de seguridad.
                  </Text>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, emailFocused && styles.labelFocused]}>Email</Text>
                    <TextInput
                      style={[styles.input, emailFocused && styles.inputFocused]}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onBlur={(e) => { handleBlur('email')(e); setEmailFocused(false); }}
                      onChangeText={handleChange('email')}
                      onFocus={() => setEmailFocused(true)}
                      value={values.email}
                      placeholder="tu@email.com"
                      placeholderTextColor={materialColors.schemes.light.outline}
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                  </View>

                  <Button onPress={handleSubmit} disabled={!isValid || isSubmitting} title="Enviar Código" />

                  <View style={styles.linksContainer}>
                    <Link link="Volver al Login" onPress={() => navigation.goBack()} />
                  </View>
                </View>
              )}
            </Formik>
          ) : (
            // Pantalla 2: Email enviado, esperar código
            <View style={styles.formContainer}>
              <View style={styles.successContainer}>
                <Ionicons 
                  name="mail-outline" 
                  size={80} 
                  color={materialColors.schemes.light.primary}
                  style={{ marginBottom: 20 }}
                />
                <Text style={styles.title}>Código Enviado</Text>
                <Text style={styles.successSubtitle}>
                  Hemos enviado un enlace de recuperación a:
                </Text>
                <Text style={styles.emailHighlight}>{sentEmail}</Text>
              </View>

              <View style={styles.instructionsContainer}>
                <Text style={styles.instructionsTitle}>Qué hacer ahora:</Text>
                <View style={styles.instructionStep}>
                  <Text style={styles.stepNumber}>1</Text>
                  <Text style={styles.stepText}>Abre tu aplicación de correo</Text>
                </View>
                <View style={styles.instructionStep}>
                  <Text style={styles.stepNumber}>2</Text>
                  <Text style={styles.stepText}>Copia el código o el enlace del email</Text>
                </View>
                <View style={styles.instructionStep}>
                  <Text style={styles.stepNumber}>3</Text>
                  <Text style={styles.stepText}>Regresa aquí y pégalo en la siguiente pantalla</Text>
                </View>
              </View>

              <Button 
                onPress={() => {
                  // @ts-ignore
                  navigation.navigate('NewPassword', { email: sentEmail });
                }} 
                title="Ya Copié el Código" 
              />

              <View style={styles.linksContainer}>
                <Link 
                  link="Volver al Login" 
                  onPress={() => {
                    setEmailSent(false);
                    setSentEmail('');
                    navigation.goBack();
                  }} 
                />
              </View>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
// --- 5. Estilos ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: materialColors.schemes.light.background },
  keyboardView: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center' },
  formContainer: { paddingHorizontal: 24, paddingBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 32 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: materialColors.schemes.light.onBackground, marginBottom: 8, marginLeft: 4 },
  labelFocused: { color: materialColors.schemes.light.primary },
  input: { borderWidth: 2, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 16, backgroundColor: '#F9FAFB', color: '#1F2937' },
  inputFocused: { borderColor: materialColors.schemes.light.primary },
  errorText: { color: materialColors.schemes.light.error, fontSize: 12, marginTop: 4, marginLeft: 4 },
  linksContainer: { marginTop: 32, alignItems: 'center' },
  
  // Estilos para pantalla de código enviado
  successContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingVertical: 20,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  emailHighlight: {
    fontSize: 16,
    fontWeight: '600',
    color: materialColors.schemes.light.primary,
    textAlign: 'center',
  },
  instructionsContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: materialColors.schemes.light.primary,
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 32,
    marginRight: 12,
    flexShrink: 0,
  },
  stepText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
});
