// screens/auth/LoginFormik.tsx
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import { useContext, useState } from "react";
import {
    KeyboardAvoidingView,
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from 'yup';
import Button from "../../../components/Button";
import { useNavigation } from "@react-navigation/native";
import { AUTH_ROUTES } from "../../../utils/constants";
import Header from "../../../components/Header";
import Link from "../../../components/Link";
import { materialColors } from "../../../utils/colors";
import { AUTH_ACTIONS, AuthContext } from "../../../shares/context";
import { supabase } from '../../api/supabaseClient';
import * as SecureStore from 'expo-secure-store';
import { useTranslation } from 'react-i18next';

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Formato incorrecto de Email')
        .required('El campo Email, no puede estar vacio'),
    pass: Yup.string()
        .required('El campo Contraseña, no puede estar vacio')
});

export default function Login() {
    const navigation = useNavigation();
    const [showPassword, setShowPassword] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const { dispatch } = useContext(AuthContext);
    const { t } = useTranslation('auth'); 

   const handleLogin = async (values: { email: string; pass: string }) => {
      try {
          const { data, error } = await supabase.auth.signInWithPassword({
              email: values.email,
              password: values.pass
          });

          if (error || !data.user) {
              let mensajeError = error?.message;
              if (mensajeError === 'Invalid login credentials') {
                  mensajeError = t('invalidCredentials');
              }
              return Alert.alert(t('loginErrorTitle'), mensajeError || 'No se pudo iniciar sesión');
          }
         
          const user = data.user;

          const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('nombre, apellido') 
              .eq('id', user.id)         
              .single();                
         
          if (profileError) {
              console.error("Error al buscar perfil:", profileError);
              
          }
        
          const userName = profileData?.nombre || user.email; 
         
          await SecureStore.setItemAsync('user', JSON.stringify(user)); 
          dispatch({
              type: AUTH_ACTIONS.LOGIN,
              payload: { user: user } 
          });

          Alert.alert('¡Bienvenido!', `Hola ${userName}`);

      } catch (e: any) { 
          console.log("Error inesperado en handleLogin:", e);
          Alert.alert('Error', 'Algo salió mal. Intenta nuevamente.');
      }
  }; 

    const handleGoToRegister = () => {
        //@ts-ignore
        navigation.navigate(AUTH_ROUTES.REGISTER, { name: 'register' });
    };

   const handleGoToForgotPassword = () => {
    //@ts-ignore
    navigation.navigate("ForgotPassword"); 
};

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior="height" style={styles.keyboardView}>
                <Header />
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Formik
                        initialValues={{ email: '', pass: '' }}
                        validationSchema={validationSchema}
                        onSubmit={handleLogin}
                        validateOnMount={false}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, isSubmitting }) => (
                            <View style={styles.formContainer}>
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.label, emailFocused && styles.labelFocused]}>
                                        Email
                                    </Text>
                                    <TextInput
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        style={[styles.input, emailFocused && styles.inputFocused]}
                                        value={values.email}
                                        onBlur={(e) => { handleBlur('email')(e); setEmailFocused(false); }}
                                        onChangeText={handleChange('email')}
                                        onFocus={() => setEmailFocused(true)}
                                        placeholder="tu@email.com"
                                    />
                                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={[styles.label, passwordFocused && styles.labelFocused]}>
                                        Contraseña
                                    </Text>
                                    <View style={styles.passwordContainer}>
                                        <TextInput
                                            style={[styles.input, styles.passwordInput, passwordFocused && styles.inputFocused]}
                                            value={values.pass}
                                            onChangeText={handleChange('pass')}
                                            onBlur={(e) => { handleBlur('pass')(e); setPasswordFocused(false); }}
                                            onFocus={() => setPasswordFocused(true)}
                                            secureTextEntry={!showPassword}
                                            placeholder="Tu contraseña"
                                        />
                                        <TouchableOpacity
                                            style={styles.eyeIcon}
                                            onPress={() => setShowPassword(!showPassword)}
                                            activeOpacity={0.7}
                                            disabled={isSubmitting}
                                        >
                                            <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="#6B7280" />
                                        </TouchableOpacity>
                                    </View>
                                    {errors.pass && <Text style={styles.errorText}>{errors.pass}</Text>}
                                </View>

                                <Button onPress={handleSubmit} disabled={!isValid || isSubmitting} title="Iniciar Sesión" />

                                <View style={styles.linksContainer}>
                                    <Link link="¿Olvidaste tu contraseña?" onPress={handleGoToForgotPassword} isSubmitting={isSubmitting} />
                                    <View style={styles.registerContainer}>
                                        <Text style={styles.registerText}>¿No tienes cuenta? </Text>
                                        <Link link="Regístrate" onPress={handleGoToRegister} isSubmitting={isSubmitting} />
                                    </View>
                                </View>
                            </View>
                        )}
                    </Formik>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: materialColors.schemes.light.background },
    keyboardView: { flex: 1 },
    scrollContainer: { flexGrow: 1 },
    formContainer: { flex: 1, paddingHorizontal: 24, paddingTop: 30, paddingBottom: 20 },
    inputContainer: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: materialColors.schemes.light.onBackground, marginBottom: 8, marginLeft: 4 },
    labelFocused: { color: materialColors.schemes.dark.onPrimary },
    input: { borderWidth: 2, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 16, backgroundColor: '#F9FAFB', color: '#1F2937' },
    inputFocused: { borderColor: materialColors.schemes.light.primary, backgroundColor: materialColors.schemes.light.background, shadowColor: materialColors.schemes.light.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
    passwordContainer: { position: 'relative' },
    passwordInput: { paddingRight: 50 },
    eyeIcon: { position: 'absolute', right: 16, top: 12, padding: 4 },
    errorText: { color: materialColors.schemes.light.error, fontSize: 12, marginTop: 4, marginLeft: 4 },
    linksContainer: { marginTop: 32, alignItems: 'center' },
    registerContainer: { flexDirection: 'row', alignItems: 'center' },
    registerText: { color: materialColors.palettes.neutral[25], fontSize: 14, marginBottom: 20 },
});
