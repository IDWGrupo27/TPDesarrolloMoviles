// api/auth.ts
import { supabase } from './supabaseClient';

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
    return { error: authError };
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
    return { error: profileError };
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
    return { error };
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
