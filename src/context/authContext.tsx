"use client";

import { User } from "@/props/authProps";
import axiosInstance from "@/utils/axiosInstance";
import { initializeSocket, userJoin } from "@/utils/socket";
import { useRouter, usePathname } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
  loginUser: () => Promise<void>;
};

const authContextDefaultValues: AuthContextType = {
  user: null,
  isAuthenticated: false,
  setUser: () => {},
  loginUser: async () => {},
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
  const router = useRouter();

  const getCurrentUser = async () => {
    try {
      const response = await axiosInstance.get("/me");

      if (response && response?.data?.user) {
        setUser(response?.data?.user);
        setIsAuthenticated(true);
        const currentUserId = response?.data?.user?.id ?? -1;

        if (currentUserId !== -1) {
          initializeSocket();
          userJoin(currentUserId);
        }
      }
    } catch (err: any) {
      if ((err && err.status === 401) || (err && err.status === 404)) {
        localStorage.removeItem("accessToken");
        router.push("/");
      }
      console.error("Error in token authorization: ", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      getCurrentUser();
      setIsAuthenticated(true);
    }
  }, []);

  const loginUser = async () => {
    await getCurrentUser();
  };

  const value = {
    user,
    setUser,
    isAuthenticated,
    loginUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
