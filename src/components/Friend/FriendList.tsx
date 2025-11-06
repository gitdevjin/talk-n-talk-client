"use client";

import { fetchWithRefreshClient } from "@/lib/client-api";
import { User } from "@/types/entity-type.ts/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FriendProfileModal from "./FriendProfileModal";
import { div } from "framer-motion/client";

export default function FriendList() {
  const router = useRouter();
  const [friends, setFriends] = useState<User[]>([]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      const data = await fetchWithRefreshClient(
        `${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/users/friends`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      setFriends(data);
      console.log(data);
    };

    fetchFriends();
  }, []);

  const createDm = async (friendId: string) => {
    try {
      const data = await fetchWithRefreshClient(
        `${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/chats/dms/${friendId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (data.status === "success") {
        router.push(`/client/dm/${data.dm.id}`); // include dmId in backend response
      }
    } catch (e) {
      console.error("Failed to create or open DM", e);
    }
  };

  const deleteFriend = async (friendId: string) => {
    if (window.confirm("Are yuo sure you want to delete ")) {
      const res = await fetchWithRefreshClient(
        `${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/users/friends/${friendId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      console.log(res);
    } else {
      console.log("Delete Friend Cancelled");
    }
  };

  return (
    <div className="flex flex-col gap-1 p-3">
      <div className="font-bold text-gray-300 text-xl px-2 py-1 mb-1">Friends</div>

      {friends.map((f) => (
        <div key={f.id}>
          {" "}
          {selectedUser && (
            <FriendProfileModal
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
              onClickMessage={createDm}
            />
          )}
          <div className="group flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[var(--color-darkgrey-1)] transition">
            {/* Left: Avatar + Username */}
            <div
              onClick={() => setSelectedUser(f)}
              className="flex items-center gap-3 overflow-hidden"
            >
              {/* Avatar circle */}
              <div className="w-9 h-9 bg-gray-600  rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                {f.username[0].toUpperCase()}
              </div>

              {/* Username */}
              <span className="text-sm text-gray-100 truncate">{f.username}</span>
            </div>

            {/* Right: Message button (appears on hover) */}
            <div className="flex flex-row gap-2">
              <button
                onClick={() => createDm(f.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:cursor-pointer
                   text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md"
              >
                Message
              </button>
              <button
                onClick={() => deleteFriend(f.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:cursor-pointer
                   text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-md"
              >
                Unfriend
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
