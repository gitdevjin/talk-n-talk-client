"use client";

import Sidebar from "@/components/Sidebar";
import { useChat } from "@/hooks/use-chat";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function ChatLayout({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const { groupChats } = useChat();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/auth/login"); // redirect
    }
  }, [user, router]);

  return (
    <div className="h-screen bg-amber-100">
      <div>client layout</div>
      <div className="flex flex-row h-full w-full">
        {user ? (
          <div className="flex flex-row h-full w-full">
            <Sidebar
              user={{ id: "hello world", email: "abcd@naver.com", username: "hello world" }}
              groupChats={groupChats}
            />
            {children} {/* DM, chatroom/id page */}
          </div>
        ) : (
          <div>loading</div>
        )}
      </div>
      <div>current user : {user?.email}</div>
    </div>
  );
}
