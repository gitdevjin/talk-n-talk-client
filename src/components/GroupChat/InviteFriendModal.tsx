"use client";

import { fetchWithRefreshClient } from "@/lib/client-api";
import { useEffect, useState } from "react";

interface InviteFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
}

interface Friend {
  id: string;
  username: string;
  status: "in_chat" | "invited" | "available";
}

export default function InviteFriendModal({ isOpen, onClose, chatId }: InviteFriendModalProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState<string | null>(null);

  // --- Fetch user's friends when modal opens ---
  useEffect(() => {
    if (!isOpen) return;
    const fetchFriends = async () => {
      try {
        const data = await fetchWithRefreshClient(
          `${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/chats/invite/${chatId}/members`
        );

        console.log(chatId);

        console.log(data);
        // Server can mark which friends are already in the chat or invited
        setFriends(data);
      } catch (err) {
        console.error("Failed to fetch friends:", err);
      }
    };

    fetchFriends();
  }, [isOpen, chatId]);

  if (!isOpen) return null;

  // --- Invite friend to group chat ---
  const handleInvite = async (friendId: string) => {
    setInviting(friendId);
    try {
      await fetchWithRefreshClient(
        `${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/chats/invite/${chatId}/members`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: friendId }),
        }
      );

      // update UI to show invited
      setFriends((prev) => prev.map((f) => (f.id === friendId ? { ...f, status: "invited" } : f)));
    } catch (err) {
      console.error("Failed to invite friend:", err);
    } finally {
      setInviting(null);
    }
  };

  // --- Filtered friends by search ---
  const filtered = friends.filter((f) => f.username.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
      <div className="bg-[var(--color-darkgrey)] p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-white">Invite Friends</h2>

        {/* Search bar */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your friends..."
          className="w-full border border-gray-600 bg-[var(--color-darkgrey-2)] text-white px-3 py-2 rounded-lg mb-4 focus:outline-none focus:ring"
        />

        {/* Friends list */}
        <div className="max-h-52 overflow-y-auto no-scrollbar">
          {filtered.length > 0 ? (
            filtered.map((friend) => (
              <div
                key={friend.id}
                className="flex justify-between items-center py-2 px-2 bg-[var(--color-darkgrey-2)] rounded-lg mb-2"
              >
                <span className="text-gray-200 text-md">{friend.username}</span>

                {friend.status === "available" ? (
                  <button
                    onClick={() => handleInvite(friend.id)}
                    disabled={!!inviting}
                    className="px-3 py-1 rounded-md text-sm bg-blue-600 hover:bg-blue-500 hover:cursor-pointer text-gray-200 disabled:opacity-50"
                  >
                    {inviting === friend.id ? "..." : "Invite"}
                  </button>
                ) : friend.status === "invited" ? (
                  <span className="text-gray-400 text-sm italic">Invited</span>
                ) : friend.status === "in_chat" ? (
                  <span className="text-green-600 text-sm italic">In Chat</span>
                ) : null}
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm text-center">No friends found</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white hover:cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
