"use client";

import { fetchWithRefreshClient } from "@/lib/client-api";
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
  logout: () => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  loading: boolean;
  refreshUser: () => void;
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

  const register = async (email: string, password: string, username: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/auth/register/email`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        username,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    setUser(data);
  };

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

    const userRes = await fetch(`${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/users/me`, {
      method: "GET",
      credentials: "include",
    });

    const userObject: User = await userRes.json();

    setUser(userObject);
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      setUser(null);

      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const refreshUser = async () => {
    try {
      const refreshedUser = await fetchWithRefreshClient(
        `${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/users/me`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      setUser(refreshedUser);
    } catch (err) {
      console.error("Failed to refresh user:", err);
      setUser(null);
    }
  };

  return (
    <userContext.Provider value={{ user, setUser, login, logout, register, loading, refreshUser }}>
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
