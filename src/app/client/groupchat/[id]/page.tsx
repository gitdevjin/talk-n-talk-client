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
        <h2>
          GroupChat Messages: {id} {}
        </h2>
      </div>

      {/* Messages box */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((m) => {
          // Check if it's a system message
          const isSystem = !m.senderId;

          return (
            <div
              key={m.id}
              className={`flex ${isSystem ? "justify-center" : "items-start gap-3 m-2"}`}
            >
              {!isSystem && (
                <>
                  {/* Avatar */}
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {m.senderId[0].toUpperCase()}
                  </div>

                  {/* Message content */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-50 text-md">{m.senderId}</span>
                      <span className="text-gray-200 text-xs">
                        {new Date(m.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="hover:bg-[var(--color-darkgrey-3)] text-gray-900 text-lg p-2 rounded-lg max-w-md min-w-[40px] break-words">
                      {m.content}
                    </div>
                  </div>
                </>
              )}

              {/* System message */}
              {isSystem && (
                <div className="text-gray-400 text-sm italic px-2 py-1 bg-gray-700 rounded">
                  {m.content}
                </div>
              )}
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
