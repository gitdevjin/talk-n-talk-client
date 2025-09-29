"use client";

import { User } from "@/types/entity-type.ts/user";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

const userContext = createContext<UserContextType | undefined>(undefined);

// fix refresh problem,
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ 1. Fetch current user when app starts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/users/me`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const userObject: User = await res.json();
          setUser(userObject);
        } else {
          // Try refreshing token if access token expired
          const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            console.log(data.accessToken); // just to check if it works fine, this code should be deleted later

            const newUserRes = await fetch(`${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/users/me`, {
              method: "GET",
              credentials: "include",
            });

            if (newUserRes.ok) {
              const refreshedUser: User = await newUserRes.json();
              setUser(refreshedUser);
            } else {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    const base64string = btoa(`${email}:${password}`);
    const res = await fetch(`${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/auth/login/email`, {
      method: "POST",
      headers: {
        authorization: `Basic ${base64string}`,
      },
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    localStorage.setItem("accessToken", data.accessToken);

    const userRes = await fetch(`${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/users/me`, {
      method: "GET",
      credentials: "include",
    });

    const userObject: User = await userRes.json();

    setUser(userObject);
  };

  return (
    <userContext.Provider value={{ user, setUser, login, loading }}>
      {children}
    </userContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error("UserContext Error");
  }

  return context;
};
