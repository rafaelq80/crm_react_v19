import { createContext, type ReactNode, useState, useCallback, useRef } from "react";
import type UsuarioLogin from "../models/UsuarioLogin";
import { ToastAlerta } from "../utils/ToastAlerta";
import { login } from "../services/Service";

interface AuthContextProps {
    usuario: UsuarioLogin;
    handleLogout(): void;
    handleLogin(usuario: UsuarioLogin): Promise<void>;
    isLoading: boolean;
    isLogout: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextProps)

export function AuthProvider({ children }: AuthProviderProps) {

    const [usuario, setUsuario] = useState<UsuarioLogin>({
        id: 0,
        nome: '',
        usuario: '',
        senha: '',
        foto: '',
        token: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    
    // useRef para saber se o logout foi intencional (botão) ou por sessão expirada (401)
    const isLogout = useRef(false);

    const handleLogin = useCallback(async (usuarioLogin: UsuarioLogin) => {
        setIsLoading(true);

        try {
            await login(`/usuarios/logar`, usuarioLogin, setUsuario);
            ToastAlerta("Usuário autenticado com sucesso!", "sucesso");
            isLogout.current = false; // Reset flag
        } catch (error) {
            ToastAlerta("Dados do Usuário inconsistentes!", "erro");
        }
        
        setIsLoading(false);
    }, []);

    const handleLogout = useCallback(() => {
        // Indica que o logout foi intencional (usuário clicou no botão)
        isLogout.current = true;
        
        setUsuario({
            id: 0,
            nome: '',
            usuario: '',
            senha: '',
            foto: '',
            token: ''
        });
    }, []);

    return (
        <AuthContext.Provider value={{ 
            usuario, 
            handleLogin, 
            handleLogout, 
            isLoading,
            isLogout: isLogout.current 
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;