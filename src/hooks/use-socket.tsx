"use client";
import { Chat } from "@/types/entity-type.ts/user";
import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}

interface SocketProviderProps {
  children: ReactNode;
  chats: Chat[];
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const SocketProvider = ({ children, chats }: SocketProviderProps) => {
  const socketRef = useRef<Socket | null>(null);
  const joinedRef = useRef(false);

  useEffect(() => {
    console.log("hello socket");
    if (socketRef.current) return;

    const socket = io("http://localhost:3000/chats", {
      withCredentials: true,
    });
    socketRef.current = socket;

    const joinRooms = () => {
      if (joinedRef.current) return;

      chats.forEach((chat) => {
        socket.emit("joinRoom", { roomId: chat.id });
        console.log("joined!");
      });

      joinedRef.current = true;
    };

    if (socket.connected) {
      joinRooms();
    } else {
      socket.once("connect", joinRooms);
    }

    return () => {
      socket.disconnect();
      socketRef.current = null;
      joinedRef.current = false;
    };
  }, [chats]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
