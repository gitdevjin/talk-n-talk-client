"use client";
import { Chat } from "@/types/entity-type.ts/user";
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "./use-user";

interface SocketContextType {
  socket: Socket | null;
  unreads: Record<string, number>;
  resetUnread: (roomId: string) => void;
  joinRoom: (roomId: string) => void;
}

interface SocketProviderProps {
  children: ReactNode;
  chats: Chat[];
}

interface SocketMessage {
  roomId: string;
  sender: string;
  message: string;
  createdAt: string;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  unreads: {},
  resetUnread: () => {},
  joinRoom: () => {},
});

export const SocketProvider = ({ children, chats }: SocketProviderProps) => {
  const { user } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const joinedRoomsRef = useRef<string[]>([]);
  const [unreads, setUnreads] = useState<Record<string, number>>({});

  // Initialize socket
  useEffect(() => {
    const timer = setTimeout(() => {
      const newSocket = io(`${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/chats`, {
        withCredentials: true,
      });

      newSocket.on("connect", () => {
        console.log("Socket connected with id:", newSocket.id);
      });

      newSocket.on("receiveMessage", (msg: SocketMessage) => {
        setUnreads((prev) => ({
          ...prev,
          [msg.roomId]: (prev[msg.roomId] || 0) + 1,
        }));
      });

      // optional: listen for connection errors
      newSocket.on("connect_error", (err) => {
        console.error("❌ Socket connection error:", err.message);
      });

      newSocket.on("authError", async () => {
        try {
          const res = await fetch("/api/auth/refresh", { method: "POST", credentials: "include" });
          if (res.ok) {
            window.location.reload(); // token refreshed, reconnect
          } else {
            window.location.href = "/auth/login";
          }
        } catch {
          window.location.href = "/auth/login";
        }
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        setSocket(null);
        joinedRoomsRef.current = [];
      };
    }, 500); // 200ms is usually enough

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!socket) return;

    chats.forEach((chat) => {
      if (!joinedRoomsRef.current.includes(chat.id)) {
        socket.emit("joinRoom", { roomId: chat.id });
        joinedRoomsRef.current.push(chat.id);
        console.log("📦 Joined room:", chat.id);
      }
    });
  }, [socket, chats]);

  // Reset unread count for a room
  const resetUnread = (roomId: string) => {
    setUnreads((prev) => ({
      ...prev,
      [roomId]: 0,
    }));
  };

  const joinRoom = (roomId: string) => {
    if (!socket) return;
    if (!joinedRoomsRef.current.includes(roomId)) {
      socket.emit("joinRoom", { roomId });
      joinedRoomsRef.current.push(roomId);
      console.log("✅ Joined new room dynamically:", roomId);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, unreads, resetUnread, joinRoom }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
