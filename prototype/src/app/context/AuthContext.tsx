import React, { createContext, useContext, useState, useEffect } from "react";

type Role = "candidate" | "company" | null;

interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
  companyId?: string;
  avatar?: string;
  tags?: string[];
  bio?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (role: Role, email: string, password?: string) => Promise<void>;
  register: (role: Role, email: string, name: string, companyName?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("futurecareer_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (role: Role, email: string) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      email,
      role,
      name: role === "candidate" ? "สมชาย รักดี" : "Jane Recruiter",
      companyId: role === "company" ? "comp_1" : undefined,
      tags: role === "candidate" ? ["React", "TypeScript", "Tailwind CSS"] : [],
      bio: role === "candidate" ? "Frontend Developer based in Bangkok" : "Senior HR Manager at TechCorp",
      phone: "081-234-5678",
    };
    setUser(newUser);
    localStorage.setItem("futurecareer_user", JSON.stringify(newUser));
    setIsLoading(false);
  };

  const register = async (role: Role, email: string, name: string, companyName?: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      email,
      role,
      name,
      companyId: role === "company" ? "comp_" + Math.random().toString(36).substring(7) : undefined,
      tags: [],
    };
    setUser(newUser);
    localStorage.setItem("futurecareer_user", JSON.stringify(newUser));
    setIsLoading(false);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem("futurecareer_user", JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("futurecareer_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
