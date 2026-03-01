import React, { createContext, useContext, useState, useCallback } from "react";
import { authApi, userApi, type UserProfile } from "@/lib/api";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: "admin" | "student") => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (data: { name?: string; email?: string; avatar?: string | null; currentPassword?: string; newPassword?: string }) => Promise<{ success: boolean; error?: string }>;
  role: "admin" | "student" | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => ({ success: false }),
  logout: () => {},
  updateUser: async () => ({ success: false }),
  role: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem("edunest-user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, password: string, _role?: "admin" | "student") => {
    setIsLoading(true);
    try {
      const { token, user: loggedInUser } = await authApi.login(email, password);
      localStorage.setItem("edunest-token", token);
      localStorage.setItem("edunest-user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Login failed" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (data: Parameters<typeof userApi.updateProfile>[0]) => {
    try {
      const updated = await userApi.updateProfile(data);
      setUser(updated);
      localStorage.setItem("edunest-user", JSON.stringify(updated));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to update profile" };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("edunest-token");
    localStorage.removeItem("edunest-user");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
        role: user?.role || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
