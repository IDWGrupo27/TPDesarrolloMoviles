import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Alert
} from "react-native";
import { useState } from "react";
import Link from "../../../components/Link";
import Button from "../../../components/Button";
import { materialColors } from "../../../utils/colors";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from "@react-navigation/native";
import { AUTH_ROUTES } from "../../../utils/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../components/Header";
import { signUpWithProfile } from '../../api/auth';

interface IFormValues {
  nombre: string
  apellido: string
  direccion: string
  telefono: string
  email: string
  pass: string
}

const FormValidationSchema = Yup.object().shape({
  nombre: Yup.string().required('Nombre es requerido'),
  apellido: Yup.string().required('Apellido es requerido'),
  direccion: Yup.string().required('Dirección es requerida'),
  telefono: Yup.string().required('Teléfono es requerido'),
  email: Yup.string().email('Email no tiene la forma adecuada').required('Email es requerido'),
  pass: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('Contraseña es requerida')
});

export default function Register() {
  const navigation = useNavigation();
  const [showPass, setShowPass] = useState<boolean>(false);
  const [nombreFocused, setNombreFocused] = useState(false);
  const [apellidoFocused, setApellidoFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [direccionFocused, setDireccionFocused] = useState(false);
  const [telefonoFocused, setTelefonoFocused] = useState(false);

  const placeholderColor = materialColors.schemes.light.outline;

  const handleRegister = async (values: IFormValues) => {
    const { error, user } = await signUpWithProfile({
      email: values.email,
      password: values.pass,
      nombre: values.nombre,
      apellido: values.apellido,
      direccion: values.direccion,
      telefono: values.telefono, 
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Registro exitoso 😎', 'Tu cuenta ha sido creada correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.navigate(AUTH_ROUTES.LOGIN as never),
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior='height' style={styles.keyboardView} enabled={true}>
        <Header />
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Formik
            initialValues={{ nombre: '', apellido: '', direccion: '', telefono: '', email: '', pass: '' }}
            validationSchema={FormValidationSchema}
            validateOnMount={false}
            onSubmit={handleRegister}
          >
            {({ handleChange, handleSubmit, handleBlur, errors, isValid, isSubmitting, values }) => (
              <View style={styles.formContainer}>
                <Text style={styles.title}>Crea tu Cuenta PetWay</Text>

                {/* Nombre */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, nombreFocused && styles.labelFocused]}>Nombre</Text>
                  <TextInput
                    style={[styles.input, nombreFocused && styles.inputFocused]}
                    placeholder="Tu nombre"
                    placeholderTextColor={nombreFocused ? materialColors.schemes.light.primary : placeholderColor}
                    value={values.nombre}
                    onChangeText={handleChange('nombre')}
                    onBlur={(e) => { handleBlur('nombre')(e); setNombreFocused(false); }}
                    onFocus={() => setNombreFocused(true)}
                  />
                  {errors.nombre && <Text style={styles.error}>{errors.nombre}</Text>}
                </View>

                {/* Apellido */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, apellidoFocused && styles.labelFocused]}>Apellido</Text>
                  <TextInput
                    style={[styles.input, apellidoFocused && styles.inputFocused]}
                    placeholder="Tu apellido"
                    placeholderTextColor={apellidoFocused ? materialColors.schemes.light.primary : placeholderColor}
                    value={values.apellido}
                    onChangeText={handleChange('apellido')}
                    onBlur={(e) => { handleBlur('apellido')(e); setApellidoFocused(false); }}
                    onFocus={() => setApellidoFocused(true)}
                  />
                  {errors.apellido && <Text style={styles.error}>{errors.apellido}</Text>}
                </View>

                {/* Dirección */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, direccionFocused && styles.labelFocused]}>Dirección</Text>
                  <TextInput
                    style={[styles.input, direccionFocused && styles.inputFocused]}
                    placeholder="Tu dirección completa"
                    placeholderTextColor={direccionFocused ? materialColors.schemes.light.primary : placeholderColor}
                    value={values.direccion}
                    onChangeText={handleChange('direccion')}
                    onBlur={(e) => { handleBlur('direccion')(e); setDireccionFocused(false); }}
                    onFocus={() => setDireccionFocused(true)}
                  />
                  {errors.direccion && <Text style={styles.error}>{errors.direccion}</Text>}
                </View>

                {/* Teléfono */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, telefonoFocused && styles.labelFocused]}>Teléfono</Text>
                  <TextInput
                    style={[styles.input, telefonoFocused && styles.inputFocused]}
                    placeholder="Tu número de teléfono"
                    placeholderTextColor={telefonoFocused ? materialColors.schemes.light.primary : placeholderColor}
                    keyboardType="phone-pad"
                    value={values.telefono}
                    onChangeText={handleChange('telefono')}
                    onBlur={(e) => { handleBlur('telefono')(e); setTelefonoFocused(false); }}
                    onFocus={() => setTelefonoFocused(true)}
                  />
                  {errors.telefono && <Text style={styles.error}>{errors.telefono}</Text>}
                </View>

                {/* Email */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, emailFocused && styles.labelFocused]}>Email</Text>
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
                    placeholderTextColor={emailFocused ? materialColors.schemes.light.primary : placeholderColor}
                  />
                  {errors.email && <Text style={styles.error}>{errors.email}</Text>}
                </View>

                {/* Contraseña */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, passwordFocused && styles.labelFocused]}>Contraseña</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={[styles.input, styles.passwordInput, passwordFocused && styles.inputFocused]}
                      placeholder="Mínimo 6 caracteres"
                      placeholderTextColor={passwordFocused ? materialColors.schemes.light.primary : placeholderColor}
                      value={values.pass}
                      onChangeText={handleChange('pass')}
                      onBlur={(e) => { handleBlur('pass')(e); setPasswordFocused(false); }}
                      onFocus={() => setPasswordFocused(true)}
                      secureTextEntry={!showPass}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowPass(!showPass)}
                      activeOpacity={0.7}
                      disabled={isSubmitting}
                    >
                      <Ionicons name={showPass ? "eye" : "eye-off"} size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                  {errors.pass && <Text style={styles.error}>{errors.pass}</Text>}
                </View>

                <Button onPress={handleSubmit} disabled={!isValid || isSubmitting} title="Registrarse!" />

                <View style={styles.linksContainer}>
                  <Link link="Volver al Login!" onPress={() => navigation.goBack()} />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: materialColors.schemes.light.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  keyboardView: { flex: 1 },
  scrollContainer: { flexGrow: 1, paddingVertical: 20 },
  formContainer: { flex: 1, paddingHorizontal: 24, paddingTop: 10, paddingBottom: 20 },
  linksContainer: { marginTop: 32, alignItems: 'center' },
  inputContainer: { marginBottom: 15 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: materialColors.schemes.light.onBackground,
    marginBottom: 5,
    marginLeft: 2,
  },
  labelFocused: {
    color: materialColors.schemes.light.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: materialColors.schemes.light.outline,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: materialColors.schemes.light.surface,
    color: materialColors.schemes.light.onSurface,
  },
  inputFocused: {
    borderColor: materialColors.schemes.light.primary,
    backgroundColor: materialColors.schemes.light.background,
    shadowColor: materialColors.schemes.light.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  passwordContainer: { position: 'relative' },
  passwordInput: { paddingRight: 50 },
  eyeIcon: { position: 'absolute', right: 16, top: 12, padding: 2 },
  error: { color: materialColors.schemes.light.error, fontSize: 12, marginTop: 4, marginLeft: 4 },
  textArea: { height: 140, textAlignVertical: 'top', paddingTop: 16, marginBottom: 5 }
});
