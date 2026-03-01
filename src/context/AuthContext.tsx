import React, { createContext, useContext, useState, useCallback } from "react";
import { mockAdminUser, mockStudentUser, type UserProfile } from "@/data/mockData";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: "admin" | "student") => boolean;
  logout: () => void;
  role: "admin" | "student" | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
  role: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem("edunest-user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((email: string, _password: string, role: "admin" | "student") => {
    const mockUser = role === "admin" ? mockAdminUser : mockStudentUser;
    setUser(mockUser);
    localStorage.setItem("edunest-user", JSON.stringify(mockUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("edunest-user");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        role: user?.role || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
