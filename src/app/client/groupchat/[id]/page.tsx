"use client";

import { useSocket } from "@/hooks/use-socket";
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/chats/${id}/messages`, {
          method: "GET",
          credentials: "include", // include cookies automatically
        });

        if (!res.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await res.json();
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
      console.log(`${msg.content} got it`);
    };

    if (socket.connected) {
      socket.on("receiveMessage", handleMessage);
      console.log("receiveMessage handler added");
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
    console.log("clicked");
    console.log(socket);
    if (!socket) return;

    console.log("socket exist in groupchat page");
    socket.emit("sendMessage", { roomId: id, content: newMessage });
    setNewMessage(""); // clear
  };

  if (loading) return <div>Loading messages...</div>;

  return (
    <div>
      <h2>GroupChat Messages</h2>
      <div>Room ID: {id}</div>
      <div>
        {messages.map((m) => (
          <div key={m.id}>
            <strong>{m.senderId}:</strong> {m.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex">
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
