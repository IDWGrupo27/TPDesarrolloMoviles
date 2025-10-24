// shares/context/auth-context.ts

import { Context, createContext } from "react";
// Debes tener estos tipos disponibles en el contexto
import { AuthTokens } from "../models/users"; 
import { AUTH_ACTIONS } from "./enums"; 


// --- 1. Definimos la estructura completa del Contexto ---
interface AuthContextProps {
  state: any; 
  dispatch: React.Dispatch<{ type: AUTH_ACTIONS; payload?: any }>;
  // 👇 AGREGAMOS LA FUNCIÓN DE INICIO DE SESIÓN MANUAL 👇
  loginWithTokens: (tokens: AuthTokens) => Promise<void>; 
}

// --- 2. Creamos el contexto con el tipo correcto y valor inicial de la función ---
// Le decimos a TypeScript que el valor por defecto debe tener la función.
const AuthContext: Context<AuthContextProps> = createContext({
    state: {},
    dispatch: () => { },
    loginWithTokens: async () => {}, // Valor inicial vacío para la función
} as AuthContextProps); // Usamos 'as AuthContextProps' para satisfacer al compilador

export default AuthContext;