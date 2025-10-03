"use client";
import { Chat } from "@/types/entity-type.ts/user";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  unreads: Record<string, number>;
  resetUnread: (roomId: string) => void;
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
});

export const SocketProvider = ({ children, chats }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const joinedRoomsRef = useRef<string[]>([]);
  const [unreads, setUnreads] = useState<Record<string, number>>({});

  // Initialize socket
  useEffect(() => {
    const newSocket = io("http://localhost:3000/chats", { withCredentials: true });

    newSocket.on("connect", () => {
      console.log("Socket connected with id:", newSocket.id);
      setSocket(newSocket);
    });

    newSocket.on("receiveMessage", (msg: SocketMessage) => {
      setUnreads((prev) => ({
        ...prev,
        [msg.roomId]: (prev[msg.roomId] || 0) + 1,
      }));
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

    return () => {
      newSocket.disconnect();
      setSocket(null);
      joinedRoomsRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    chats.forEach((chat) => {
      if (!joinedRoomsRef.current.includes(chat.id)) {
        socket.emit("joinRoom", { roomId: chat.id });
        joinedRoomsRef.current.push(chat.id);
        console.log("Joined room:", chat.id);
      }
    });
  }, [chats, socket]);

  // Reset unread count for a room
  const resetUnread = (roomId: string) => {
    setUnreads((prev) => ({
      ...prev,
      [roomId]: 0,
    }));
  };

  return (
    <SocketContext.Provider value={{ socket, unreads, resetUnread }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
