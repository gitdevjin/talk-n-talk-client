"use client";
import { DirectMessage, GroupChat } from "@/types/entity-type.ts/user";
import { createContext, ReactNode, useContext, useState } from "react";

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
  const [dms, setDms] = useState(initialDms);
  const [groupChats, setGroupChats] = useState(initialGroupChats);

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
