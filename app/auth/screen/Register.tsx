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
import { useNavigation, useRoute } from "@react-navigation/native";
import { AUTH_ROUTES } from "../../../utils/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../components/Header";

interface IFormValues {
    nombre: string
    apellido: string
    direccion: string
    telefono: string
    descripcion?: string
    email: string
    pass: string
}

interface IUser {
    id: number;
    nombre: string;
    apellido: string;
    direccion: string;
    telefono: string;
    descripcion?: string;
    pass: string;
    email: string;
}

const FormValidationSchema = Yup.object().shape({
    nombre: Yup.string()
        .required('Nombre es requerido'),
    apellido: Yup.string()
        .required('Apellido es requerido'),
    direccion: Yup.string()
        .required('Dirección es requerida'),
    telefono: Yup.string()
        .required('Teléfono es requerido'),
    email: Yup.string()
        .email('Email no tiene la forma adecuada').required('Email es requerido'),
    pass: Yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('Contraseña es requerida')
})
export default function Register() {
    const navigation = useNavigation()
    const [showPass, setShowPass] = useState<boolean>(false)
    const [nombreFocused, setNombreFocused] = useState(false);
    const [apellidoFocused, setApellidoFocused] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [direccionFocused, setDireccionFocused] = useState(false);
    const [telefonoFocused, setTelefonoFocused] = useState(false);
    const [descripcionFocused, setDescripcionFocused] = useState(false);

    const handleRegister = (values: IFormValues) => {
        Alert.alert('REGISTRO EXITOSO', 'Tu cuenta ha sido creada exitosamente',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        console.log('OK Pressed')
                        navigation.navigate(AUTH_ROUTES.LOGIN as never);
                    }
                },
            ]);
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior='height'
                style={styles.keyboardView}
                enabled={true}
            >
                <Header />
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >

                    <Formik
                        initialValues={{ nombre: '', apellido: '', direccion: '', telefono: '', email: '', pass: '', descripcion: '' }}
                        validationSchema={FormValidationSchema}
                        validateOnMount={false}
                        onSubmit={handleRegister}
                    >
                        {({
                            handleChange,
                            handleSubmit,
                            handleBlur,
                            errors,
                            isValid,
                            isSubmitting,
                            values
                        }) => (
                            <View style={styles.formContainer}>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            nombreFocused && styles.inputFocused,
                                        ]}
                                        placeholder="Nombre"
                                        value={values.nombre}
                                        onChangeText={handleChange('nombre')}
                                        onBlur={(e) => {
                                            handleBlur('nombre')(e);
                                            setNombreFocused(false);
                                        }}
                                        onFocus={() => setNombreFocused(true)}
                                    />
                                    {errors && <Text style={styles.error}>{errors.nombre}</Text>}
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            apellidoFocused && styles.inputFocused,
                                        ]}
                                        placeholder="Apellido"
                                        value={values.apellido}
                                        onChangeText={handleChange('apellido')}
                                        onBlur={(e) => {
                                            handleBlur('apellido')(e);
                                            setApellidoFocused(false);
                                        }}
                                        onFocus={() => setApellidoFocused(true)}
                                    />
                                    {errors && <Text style={styles.error}>{errors.apellido}</Text>}
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            direccionFocused && styles.inputFocused,
                                        ]}
                                        placeholder="Dirección"
                                        value={values.direccion}
                                        onChangeText={handleChange('direccion')}
                                        onBlur={(e) => {
                                            handleBlur('direccion')(e);
                                            setDireccionFocused(false);
                                        }}
                                        onFocus={() => setDireccionFocused(true)}
                                    />
                                    {errors && <Text style={styles.error}>{errors.direccion}</Text>}
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            telefonoFocused && styles.inputFocused,
                                        ]}
                                        placeholder="Teléfono"
                                        value={values.telefono}
                                        onChangeText={handleChange('telefono')}
                                        onBlur={(e) => {
                                            handleBlur('telefono')(e);
                                            setTelefonoFocused(false);
                                        }}
                                        onFocus={() => setTelefonoFocused(true)}
                                    />
                                    {errors && <Text style={styles.error}>{errors.telefono}</Text>}
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        style={[
                                            styles.input,
                                            emailFocused && styles.inputFocused,
                                        ]}
                                        value={values.email}
                                        onBlur={(e) => {
                                            handleBlur('email')(e);
                                            setEmailFocused(false);
                                        }}
                                        onChangeText={handleChange('email')}
                                        onFocus={() => setEmailFocused(true)}
                                        placeholder="tu@email.com"
                                    />
                                    {errors && <Text style={styles.error}>{errors.email}</Text>}
                                </View>

                                <View style={styles.inputContainer}>
                                    <View style={styles.passwordContainer}>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                styles.passwordInput,
                                                passwordFocused && styles.inputFocused,
                                            ]}
                                            placeholder="Contraseña"
                                            value={values.pass}
                                            onChangeText={handleChange('pass')}
                                            onBlur={(e) => {
                                                handleBlur('pass')(e);
                                                setPasswordFocused(false);
                                            }}
                                            onFocus={() => setPasswordFocused(true)}
                                            secureTextEntry={!showPass}
                                        />
                                        <TouchableOpacity
                                            style={styles.eyeIcon}
                                            onPress={() => setShowPass(!showPass)}
                                            activeOpacity={0.7}
                                            disabled={isSubmitting}
                                        >
                                            <Ionicons
                                                name={showPass ? "eye" : "eye-off"}
                                                size={20}
                                                color="#6B7280"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {errors && <Text style={styles.error}>{errors.pass}</Text>}
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[
                                            styles.textArea, styles.input,
                                        ]}
                                        placeholder="Cuentanos de ti..."
                                        value={values.descripcion}
                                        onChangeText={handleChange('descripcion')}
                                        onBlur={(e) => {
                                            handleBlur('descripcion')(e);
                                            setDescripcionFocused(false);
                                        }}
                                        onFocus={() => setDescripcionFocused(true)}
                                    />
                                    {/* {errors && <Text style={styles.error}>{errors.direccion}</Text>} */}
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
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: materialColors.schemes.light.background,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 30,
        paddingBottom: 20,
    },
    linksContainer: {
        marginTop: 32,
        alignItems: 'center',
    },
    inputContainer: {
        marginBottom: 10,
    },
    input: {
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 14,
        backgroundColor: '#F9FAFB',
        color: '#1F2937',
    },
    inputFocused: {
        borderColor: materialColors.schemes.light.primary,
        backgroundColor: materialColors.schemes.light.background,
        shadowColor: materialColors.schemes.light.primary,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    passwordContainer: {
        position: 'relative',
    },
    passwordInput: {
        paddingRight: 50,
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        top: 10,
        padding: 2,
    },
    error: {
        color: materialColors.schemes.light.error,
        fontSize: 12,
        marginTop: 1,
        marginLeft: 4,
    },
    textArea: {
        height: 140,
        textAlignVertical: 'top',
        paddingTop: 16,
        marginBottom: 5,
    }
})