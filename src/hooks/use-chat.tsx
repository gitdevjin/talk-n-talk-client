"use client";
import { DirectMessage, GroupChat, User } from "@/types/entity-type.ts/user";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useSocket } from "./use-socket";
import { fetchWithRefreshClient } from "@/lib/client-api";

interface ChatContextType {
  dms: DirectMessage[];
  setDms: React.Dispatch<React.SetStateAction<DirectMessage[]>>;
  groupChats: GroupChat[];
  setGroupChats: React.Dispatch<React.SetStateAction<GroupChat[]>>;
}

interface ChatProviderProps {
  children: ReactNode;
  initialDms: DirectMessage[];
  initialGroupChats: GroupChat[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children, initialDms, initialGroupChats }: ChatProviderProps) => {
  const { socket, joinRoom } = useSocket();
  const [dms, setDms] = useState(initialDms);
  const [groupChats, setGroupChats] = useState(initialGroupChats);

  useEffect(() => {
    if (!socket) return;

    const handleInvite = async ({ roomId, inviter }: { roomId: string; inviter: User }) => {
      console.log(`Invited to ${roomId} by ${inviter}`);
      const groupChats = await fetchWithRefreshClient(
        `${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/chats`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      setGroupChats(groupChats);
      joinRoom(roomId);
    };

    socket.on("chatroom:invited", handleInvite);

    // ✅ wrap in arrow so return type is void
    return () => {
      socket.off("chatroom:invited", handleInvite);
    };
  }, [socket]);
  return (
    <ChatContext.Provider value={{ dms, setDms, groupChats, setGroupChats }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("ChatContext Error");
  }
  return context;
};
