"use client";
import Sidebar from "@/components/Sidebar";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";

import { ReactNode, useEffect } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, setUser } = useUser();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/users/me`, {
          method: "GET",
          credentials: "include",
        });

        console.log(res);

        if (!res.ok) {
          router.push("/auth/login");
          return;
        }

        const user = await res.json();
        console.log(user);

        const resChatRooms = await fetch(`${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/chats/group`, {
          method: "GET",
          credentials: "include",
        });

        if (!resChatRooms.ok) {
          console.log("error");
        }

        const chatRooms = await resChatRooms.json();
        console.log(chatRooms);

        setUser(user);
      } catch (err) {
        console.log("failed to fetch user ", err);
        router.push("/auth/login");
      }
    };

    if (!user) {
      fetchUser();
    }
  }, []);

  return (
    <div className="h-screen bg-amber-100">
      <div>chat layout</div>
      <div className="flex flex-row">
        {/* Sidbarmust be client */}
        {user ? <Sidebar user={user} /> : <div>loading</div>}
        {children} {/* can be server */}
      </div>
      <div>current user : {user?.email}</div>
    </div>
  );
}
