"use client";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Sidebar() {
  const router = useRouter();
  const { user, setUser } = useUser();

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
  return <div>SideBar :{user?.email || "client component test"}</div>;
}
