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
            credentials: "include",
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

    const handleSystemMessage = (msg: Message) => {
      console.log("📢 System message received:", msg);
      if (msg.roomId === id) setMessages((prev) => [...prev, msg]);
    };

    const handleMessage = (msg: Message) => {
      if (msg.roomId === id) setMessages((prev) => [...prev, msg]);
    };

    socket.on("chatroom:system", handleSystemMessage);
    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, [socket, id]);

  const sendMessage = () => {
    if (!socket) return;

    socket.emit("sendMessage", { roomId: id, content: newMessage });
    setNewMessage(""); // clear MessageInput
  };

  if (loading) return <div>Loading messages...</div>;

  return (
    <div className="flex flex-col h-full w-full pr-2">
      {/* Header */}
      <div className="p-4 border-b">
        <h2>GroupChat Messages: {id}</h2>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((m) => {
          const isSystem = !m.sender;
          return (
            <div key={m.id} className={`flex ${isSystem ? "justify-center" : "items-start gap-3"}`}>
              {isSystem ? (
                <div className="text-gray-400 text-sm italic px-2 py-1 bg-gray-700 rounded">
                  {m.content}
                </div>
              ) : (
                <>
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {m.sender!.username[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-blue-900 text-sm">
                        {m.sender!.username}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {new Date(m.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="hover:bg-[var(--color-darkgrey-3)] text-gray-900 text-lg p-2 rounded-lg break-words">
                      {m.content}
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Input bar */}
      <div className="p-2 border-t flex gap-2">
        <input
          className="flex-1 border rounded p-2"
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
