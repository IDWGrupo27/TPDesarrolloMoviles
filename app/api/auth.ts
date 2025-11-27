// api/auth.ts
import { supabase } from './supabaseClient';

/**
 * Traduce mensajes de error técnicos de Supabase a mensajes amigables para el usuario
 */
function translateErrorMessage(errorMessage: string): string {
  // Email ya existe
  if (errorMessage.includes('duplicate key value violates unique constraint')) {
    return 'Este correo electrónico ya está registrado. Intenta con otro o inicia sesión.';
  }
  if (errorMessage.includes('User already registered')) {
    return 'Este correo electrónico ya está registrado. Intenta con otro o inicia sesión.';
  }
  
  // Errores de contraseña
  if (errorMessage.includes('Password') || errorMessage.includes('password')) {
    return 'La contraseña no cumple con los requisitos de seguridad. Intenta con una más fuerte.';
  }
  
  // Errores de validación
  if (errorMessage.includes('invalid')) {
    return 'Los datos ingresados no son válidos. Verifica que todo esté correcto.';
  }
  
  // Errores de conexión
  if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Network')) {
    return 'Error de conexión. Verifica tu internet e intenta de nuevo.';
  }
  
  // Errores de base de datos
  if (errorMessage.includes('violates foreign key')) {
    return 'Ocurrió un error al guardar tus datos. Por favor, intenta de nuevo.';
  }
  
  // Error por defecto
  return 'Ocurrió un error. Por favor, intenta de nuevo.';
}

/**
 * Función para registrar usuario + perfil
 */
export async function signUpWithProfile({
  email,
  password,
  nombre,
  apellido,
  direccion,
  telefono,
  descripcion,
}: {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  descripcion?: string;
}) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    console.error('❌ Error al registrarse:', authError.message);
    return { error: { message: translateErrorMessage(authError.message) } };
  }

  const user = authData.user;
  if (!user) return { error: new Error('No se obtuvo el usuario') };
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([
      {
        id: user.id, 
        nombre,
        apellido,
        direccion,
        telefono,
        descripcion,
      },
    ]);

  if (profileError) {
    console.error('❌ Error al crear perfil:', profileError.message);
    return { error: { message: translateErrorMessage(profileError.message) } };
  }

  return { user };
}

/**
 * Función para hacer login
 */
export async function loginWithProfile({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('❌ Error en login:', error.message);
    return { error: { message: translateErrorMessage(error.message) } };
  }

  const user = data.user;
  const session = data.session;

  if (!user || !session) return { error: new Error('No se pudo iniciar sesión') };

  return {
    user,
    token: session.access_token,
    refreshToken: session.refresh_token,
  };
}
