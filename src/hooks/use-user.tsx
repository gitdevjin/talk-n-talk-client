import { User } from "@/types/entity-type.ts/user";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<void>;
}

const userContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const base64string = btoa(`${email}:${password}`);
    const res = await fetch(`${process.env.TNT_SERVER_URL}/auth/login/email`, {
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

    const userRes = await fetch(`${process.env.TNT_SERVER_URL}/users/me`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${data.accessToken}`,
      },
    });
    const userObject = await userRes.json();

    setUser(userObject);
  };

  return <userContext.Provider value={{ user, setUser, login }}>{children}</userContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error("UserContext Error");
  }

  return context;
};
