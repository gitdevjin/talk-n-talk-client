"use client";

import { useSocket } from "@/hooks/use-socket";
import { fetchWithRefreshClient } from "@/lib/client-api";
import { Message } from "@/types/entity-type.ts/user";
import { useParams } from "next/navigation";
import { MouseEventHandler, useEffect, useState } from "react";

export default function GroupChatPage() {
  const { id } = useParams<{ id: string }>();
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const [newMessage, setNewMessage] = useState<string>("");
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await fetchWithRefreshClient(
          `${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/chats/${id}/messages`,
          {
            method: "GET",
            credentials: "include", // include cookies automatically
          }
        );

        setMessages(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [id]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (msg: Message) => {
      if (msg.roomId === id) setMessages((prev) => [...prev, msg]);
    };

    if (socket.connected) {
      socket.on("receiveMessage", handleMessage);
    } else {
      socket.once("connect", () => {
        socket.on("receiveMessage", handleMessage);
      });
    }

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, [socket, id]);

  const sendMessage = () => {
    console.log(socket);
    console.log(newMessage);

    if (!socket) return;

    socket.emit("sendMessage", { roomId: id, content: newMessage });
    setNewMessage(""); // clear
  };

  if (loading) return <div>Loading messages...</div>;

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h2>GroupChat Messages: {id}</h2>
      </div>

      {/* Messages box */}
      <div className="flex flex-1 flex-col overflow-y-auto p-2">
        {messages.map((m) => (
          <div key={m.id} className="mb-1">
            <strong>{m.senderId}:</strong> {m.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-2 border-t flex h-15">
        <input
          className="flex-1 border rounded p-2 mr-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
