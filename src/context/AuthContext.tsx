import { createContext, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (name: string, email: string) => void;
  logout: () => void;
}

/**
 * Context object for authentication state management.
 * Proporciona acceso a los valores de autenticación en toda la aplicación.
 * 
 * @remarks
 * Este createContext crea un contexto de React que permite compartir
 * el estado de autenticación entre componentes sin necesidad de pasar props manualmente.
 * El tipo genérico AuthContextValue | undefined indica que el contexto puede no estar
 * inicializado si se accede fuera de su proveedor.
 * 
 * @see {@link AuthContextValue} para ver la estructura de datos del contexto
 */
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<AuthUser | null>("dev-health-auth-user", null);

  const login = (name: string, email: string) => {
    // Simulación de autenticación: en fase real esto vendría de un backend.
    setUser({
      id: "session-user",
      name,
      email
    });
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
