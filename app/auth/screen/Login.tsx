import { Ionicons } from "@expo/vector-icons"
import { Formik } from "formik"
import { useState } from "react"
import {
    KeyboardAvoidingView,
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import * as Yup from 'yup'
import Button from "../../../components/Button"
import { useNavigation } from "@react-navigation/native"
import { AUTH_ROUTES } from "../../../utils/constants"
import Header from "../../../components/Header"
import Link from "../../../components/Link"
import { materialColors } from "../../../utils/colors"

interface IFormValues {
    email: string
    pass: string
}

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Email no tiene la forma adecuada')
        .required('Email es requerido'),
    pass: Yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('Contraseña es requerida')
})

export default function LoginFormik() {
    const navigation = useNavigation()
    const [showPassword, setShowPassword] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false); // Agregado para el estilo del label cuando el input tiene el foco
    const [passwordFocused, setPasswordFocused] = useState(false); // Agregado para el estilo del label cuando el input tiene el foco

    const handleLogin = (values: IFormValues) => {
        console.log(values)
    }

    const handleGoToRegister = () => {
        //@ts-ignore
        navigation.navigate(AUTH_ROUTES.REGISTER, { 'name': 'register' })
    }

    const handleGoToForgotPassword = () => {
        console.log('handleGoToForgotPassword')
    }

    return (
        <SafeAreaView style={styles.container}>

            <KeyboardAvoidingView
                behavior='height'
                style={styles.keyboardView}
                enabled={true}
            >

                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Header />
                    <Formik
                        initialValues={{
                            email: '',
                            pass: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleLogin}
                        validateOnMount={false}
                    >
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            values,
                            errors,
                            isValid,
                            isSubmitting,
                        }) => (
                            <View style={styles.formContainer}>
                                <View style={styles.inputContainer}>
                                    <Text style={[
                                        styles.label,
                                        emailFocused && styles.labelFocused,
                                    ]}>
                                        Email
                                    </Text>
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
                                    {errors && <Text style={styles.errorText}>{errors.email}</Text>}
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={[
                                        styles.label,
                                        passwordFocused && styles.labelFocused,
                                    ]}>
                                        Contraseña
                                    </Text>
                                    <View style={styles.passwordContainer}>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                styles.passwordInput,
                                                passwordFocused && styles.inputFocused,
                                            ]}
                                            value={values.pass}
                                            onChangeText={handleChange('pass')}
                                            onBlur={(e) => {
                                                handleBlur('pass')(e);
                                                setPasswordFocused(false);
                                            }}
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
                                            <Ionicons
                                                name={showPassword ? "eye" : "eye-off"}
                                                size={20}
                                                color="#6B7280"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {errors && <Text style={styles.errorText}>{errors.pass}</Text>}
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
        paddingTop: 40,
        paddingBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: materialColors.schemes.light.onBackground,
        marginBottom: 8,
        marginLeft: 4,
    },
    labelFocused: {
        color: materialColors.schemes.dark.onPrimary,
    },
    input: {
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
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
        top: 12,
        padding: 4,
    },
    errorText: {
        color: materialColors.schemes.light.error,
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    linksContainer: {
        marginTop: 32,
        alignItems: 'center',
    },
    registerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    registerText: {
        color: materialColors.palettes.neutral[25],
        fontSize: 14,
        marginBottom: 20,
    },
});
