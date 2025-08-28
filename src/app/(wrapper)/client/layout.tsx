"use client";

import { UserProvider, useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { setUser } = useUser();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        router.push("/auth/login");
        return;
      }
      const res = await fetch(`${process.env.TNT_SERVER_URL}/users/me`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!res.ok) {
        router.push("auth/login");
        return;
      }

      const user = await res.json();
      setUser(user);
    };

    fetchUser();
  }, []);

  return (
    <div>
      <div>chat layout</div>
      <div>Sidebar</div>
      {children}
    </div>
  );
}
