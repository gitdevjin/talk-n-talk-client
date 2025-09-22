"use client";

import Sidebar from "@/components/Sidebar";
import { useChat } from "@/hooks/use-chat";
import { useUser } from "@/hooks/use-user";
import { ReactNode } from "react";

export default function ChatLayout({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const { groupChats } = useChat();
  return (
    <div className="h-screen bg-amber-100">
      <div>client layout</div>
      <div className="flex flex-row h-full">
        {user ? (
          <div className="flex flex-row h-full">
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
