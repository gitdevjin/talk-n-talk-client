"use client";

import Sidebar from "@/components/Sidebar";
import { SocketProvider } from "@/hooks/use-socket";
import { useUser } from "@/hooks/use-user";
import { ChatRoom } from "@/types/entity-type.ts/user";
import { ReactNode } from "react";

export default function ClientShellLayout({
  children,
  chats,
}: {
  children: ReactNode;
  chats: ChatRoom[];
}) {
  const { user } = useUser();
  const groupChats = chats.filter((c) => c.isGroup == true);
  return (
    <div className="h-screen bg-amber-100">
      <div>client layout</div>
      <div className="flex flex-row h-full">
        {user ? (
          <SocketProvider chats={chats}>
            <div className="flex flex-row h-full">
              <Sidebar user={user} groupChats={groupChats} />
              {children} {/* DM, chatroom/id page */}
            </div>
          </SocketProvider>
        ) : (
          <div>loading</div>
        )}
      </div>
      <div>current user : {user?.email}</div>
    </div>
  );
}
