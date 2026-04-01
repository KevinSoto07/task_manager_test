import { createContext, useContext, useState } from "react";
import type { ReactNode} from "react";

interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

//El context es una forma de compartir datos (como lo es el token) entre todos los componentes sin tener que pasarlo de componente en componente manualmente
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode}) =>{
    const [token, setToken] = useState<string | null>(
        localStorage.getItem('token')
    )

    const login = (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    }

    return (
        <AuthContext.Provider value ={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
    return context;
}