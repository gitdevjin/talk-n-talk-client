"use client";

import { useState } from "react";
import { useChat } from "@/hooks/use-chat";
import { fetchWithRefreshClient } from "@/lib/client-api";
import { useUser } from "@/hooks/use-user";
import { useSocket } from "@/hooks/use-socket";
import { GroupChat } from "@/types/entity-type.ts/user";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const { user } = useUser();
  const { setGroupChats } = useChat();
  const { joinRoom } = useSocket();
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCreateGroup = async () => {
    if (!roomName.trim()) return;
    setLoading(true);

    try {
      const newGroupChat: GroupChat = await fetchWithRefreshClient(
        `${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/chats/group`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomname: roomName, memberIds: [user?.id] }),
        }
      );

      setGroupChats((prev) => [...prev, newGroupChat]);
      setRoomName("");
      joinRoom(newGroupChat.id);
      onClose(); // close modal
    } catch (err) {
      console.error("❌ Error creating group:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-10 z-20">
      <div className="bg-[var(--color-darkgrey)] p-6 rounded-xl shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">Create Group Chat</h2>

        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter room name"
          className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring mb-4"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-3 py-2 rounded-lg bg-gray-500 hover:bg-gray-400">
            Cancel
          </button>

          <button
            onClick={handleCreateGroup}
            disabled={loading}
            className="px-3 py-2 rounded-lg hover:bg-blue-500 text-white bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
