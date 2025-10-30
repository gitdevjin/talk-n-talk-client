"use client";

import { useSocket } from "@/hooks/use-socket";
import { useUser } from "@/hooks/use-user";
import { fetchWithRefreshClient } from "@/lib/client-api";
import { Message } from "@/types/entity-type.ts/user";
import { useParams } from "next/navigation";
import { MouseEventHandler, useEffect, useState } from "react";

export default function DmPage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useUser();
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
    if (!socket) return;
    if (!newMessage.trim()) return;

    socket.emit("sendMessage", { roomId: id, content: newMessage });
    setNewMessage(""); // clear
  };

  if (loading) return <div>Loading messages...</div>;
  if (!currentUser) return <div>Loading user...</div>;

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="p-4 border-b w-full">
        <h2>Direct Messages: {id}</h2>
      </div>

      {/* Messages box */}
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((m) => {
          const isSystem = !m.senderId;
          const isMe = m.senderId === currentUser.id;

          if (isSystem) {
            return (
              <div
                key={m.id}
                className="text-gray-400 text-sm italic px-2 py-1 bg-gray-600 rounded self-center"
              >
                {m.content}
              </div>
            );
          }

          return (
            <div key={m.id} className={`flex ${isMe ? "justify-end" : "items-start gap-3"}`}>
              {/* Avatar (only for other users) */}
              {!isMe && m.sender && (
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {m.sender.username[0].toUpperCase()}
                </div>
              )}

              {/* Message */}
              <div className="flex flex-col max-w-md">
                <div className="flex items-center gap-2">
                  {!isMe && m.sender && (
                    <span className="font-semibold text-blue-900 text-sm">{m.sender.username}</span>
                  )}
                  <span className="text-gray-500 text-xs">
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div
                  className={`p-2 rounded-lg break-words ${
                    isMe ? "bg-blue-500 text-white self-end" : "bg-gray-700 text-gray-200"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            </div>
          );
        })}
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
