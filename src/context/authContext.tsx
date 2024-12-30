"use client";

import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
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
  profile_picture:
    | string
    | "https://i.pinimg.com/736x/1a/09/3a/1a093a141eeecc720c24543f2c63eb8d.jpg";
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
  const router = useRouter();

  const getCurrentUser = async () => {
    try {
      const response = await axiosInstance.get("/me");

      if (response && response?.data?.user) {
        setUser(response?.data?.user);
      }
    } catch (err: any) {
      if ((err && err.status === 401) || (err && err.status === 404)) {
        console.log(err.status);
        localStorage.removeItem("accessToken");
        router.push("/");
      }
      console.error("Error in token authorization: ", err);
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
