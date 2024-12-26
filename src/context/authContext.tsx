"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

type User = {
  id: number;
  username: string;
  email: string;
  full_name: string;
  profile_picture: string | null;
  otp: string | null;
  other_data: any | null;
  createdAt: string;
  updatedAt: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
  login: (user: User) => void;
  logout: () => void;
};

const authContextDefaultValues: AuthContextType = {
  user: null,
  isAuthenticated: false,
  setUser: () => {},
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(authContextDefaultValues);

export function useAuth() {
  return useContext(AuthContext);
}

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = (user: User) => {
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    setUser,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
