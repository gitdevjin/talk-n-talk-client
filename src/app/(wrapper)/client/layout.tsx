"use client";
import Sidebar from "@/components/Sidebar";
import { useUser } from "@/hooks/use-user";
import { GroupChat } from "@/types/entity-type.ts/user";
import { useRouter } from "next/navigation";

import { ReactNode, useEffect, useState } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [chatrooms, setChatrooms] = useState<GroupChat[]>([]);

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

        const chatrooms = await resChatRooms.json();
        console.log(chatrooms);
        setChatrooms(chatrooms);

        setUser(user);
      } catch (err) {
        console.log("failed to fetch user ", err);
        router.push("/auth/login");
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="h-screen bg-amber-100">
      <div>chat layout</div>
      <div className="flex flex-row h-full">
        {/* Sidbarmust be client */}
        {user ? <Sidebar groupChats={chatrooms} /> : <div>loading</div>}
        {children} {/* can be server */}
      </div>
      <div>current user : {user?.email}</div>
    </div>
  );
}
