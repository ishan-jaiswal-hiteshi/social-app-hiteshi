"use client";

import axiosInstance from "@/utils/axiosInstance";
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

type OtherData = {
  cover_picture: string | null;
  location: string | null;
  job_title: string | null;
  university: string | null;
  bio: string | null;
  friends: number | null;
  following: number | null;
  posts: number | null;
};

type User = {
  id: number;
  username: string;
  email: string;
  full_name: string;
  profile_picture: string | undefined;
  otp: string | null;
  other_data: OtherData | null;
  createdAt: string;
  updatedAt: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
};

const authContextDefaultValues: AuthContextType = {
  user: null,
  isAuthenticated: false,
  setUser: () => {},
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

  const getCurrentUser = async () => {
    const response = await axiosInstance.get("/me");

    if (response && response?.data?.user) {
      setUser(response?.data?.user);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsAuthenticated(true);
      getCurrentUser();
    }
  }, [isAuthenticated]);

  const value = {
    user,
    setUser,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
