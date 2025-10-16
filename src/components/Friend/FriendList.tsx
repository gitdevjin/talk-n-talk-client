"use client";

import { fetchWithRefreshClient } from "@/lib/client-api";
import { User } from "@/types/entity-type.ts/user";
import { useEffect, useState } from "react";

export default function FriendList() {
  const [friends, setFriends] = useState<User[]>([]);

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
    };

    fetchFriends();
  }, []);

  return (
    <div className="flex flex-col gap-1 p-2">
      <div className="font-bold text-gray-700 text-2xl px-3 py-2">Friends</div>

      {friends.map((f) => (
        <div
          key={f.id}
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[var(--color-darkgrey-1)] cursor-pointer transition"
        >
          {/* Avatar circle */}
          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {f.username[0].toUpperCase()}
          </div>

          {/* Username */}
          <span className="text-sm text-white truncate">{f.username}</span>

          {/* Optional online dot */}
          {/* <span className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></span> */}
        </div>
      ))}
    </div>
  );
}
