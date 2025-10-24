// shares/context/auth-provider.tsx

import React, { createContext, useReducer, ReactNode } from "react"; // <-- Corregido: Imports de React
import { Alert } from "react-native"; // <-- Corregido: Alert importado de react-native

// Importaciones necesarias
import AuthContext from "./auth-context";
import { AUTH_ACTIONS } from "./enums";
import { AuthTokens, IUser } from "../models/users"; // <-- Asegurate que esta ruta sea correcta
import { deleteUser, setUser } from "../../utils/secure-store";
import { supabase } from "../../app/api/supabaseClient"; // <-- Asegurate que esta ruta sea correcta


interface Action {
    type: AUTH_ACTIONS;
    payload?: any;
}

interface State {
    isLoading: boolean;
    token: string | null;
    user: IUser | null;
    refreshToken: string | null;
    recoveryMode: boolean; 
}


const initialState: State = {
    isLoading: false,
    token: null,
    user: null,
    refreshToken: null,
    recoveryMode: false, 
};

export { AuthContext };
const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer((prevState: State, action: Action): State => {
        // Tu lógica de reducer queda igual
        console.log("AuthProvider action", action);
        console.log("AuthProvider prevState", prevState);
        const { payload } = action;

        switch (action.type) {
            case AUTH_ACTIONS.LOGIN:
                if (payload?.user) {
                    setUser(payload.user);
                }
                return {
                    ...prevState,
                    isLoading: false, 
                    token: payload?.token || null, 
                    user: payload?.user || null, 
                    refreshToken: payload?.refreshToken || null, 
                    recoveryMode: false, 
                };

            case AUTH_ACTIONS.LOGOUT:
                deleteUser(); 
                return initialState;

            case AUTH_ACTIONS.SET_USER:
                return {
                    ...prevState,
                    isLoading: false, 
                    user: payload?.user || null, 
                };

            case AUTH_ACTIONS.ENTER_RECOVERY:
                return { ...prevState, user: null, recoveryMode: true };

            case AUTH_ACTIONS.EXIT_RECOVERY:
                return { ...prevState, recoveryMode: false };

            case AUTH_ACTIONS.SET_LOADING:
                return { ...prevState, isLoading: payload?.isLoading ?? true }; 

            default:
                return prevState;
        }
    }, initialState);


    // --- FUNCIÓN CLAVE DEL POST: loginWithTokens ---
    const loginWithTokens = async ({ access_token, refresh_token }: AuthTokens) => {
        try {
            console.log("Context: Attempting loginWithTokens...");
            
            // 1. Establece la sesión con los tokens recibidos
            const { error: setSessionError } = await supabase.auth.setSession({ access_token, refresh_token });
            
            if (setSessionError) {
                 console.error("Context: setSession FAILED:", setSessionError);
                 throw new Error(setSessionError.message);
            }
            
            // 2. Refresca la sesión para obtener el usuario actual y validar
            const { data: { user: supabaseUser }, error: refreshError } = await supabase.auth.refreshSession();
            
            if (refreshError) {
                 console.error("Context: refreshSession FAILED:", refreshError);
                 throw new Error(refreshError.message);
            }

            // 3. Usa el dispatch de tu contexto para hacer un LOGIN normal
            if (supabaseUser) {
                dispatch({ type: AUTH_ACTIONS.LOGIN, payload: { user: supabaseUser } });
                console.log("Context: loginWithTokens SUCCEEDED.");
            }

        } catch (e: any) {
            console.error("Context: Error logging in with token:", e);
            Alert.alert("Error de Sesión", e.message || "No se pudo establecer la sesión de recuperación. Intenta de nuevo.");
            dispatch({ type: AUTH_ACTIONS.LOGOUT }); 
        }
    };


    return (
        // Pasamos la nueva función en el value
        <AuthContext.Provider value={{ state, dispatch, loginWithTokens }}> 
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;