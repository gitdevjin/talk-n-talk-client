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
    <div>
      <div>friend list</div>
      {friends.map((f) => (
        <div>
          <div key={f.id}>{f.username}</div>
        </div>
      ))}
    </div>
  );
}
