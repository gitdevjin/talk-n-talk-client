"use client";

import { useUser } from "@/hooks/use-user";
import { GroupChat, User } from "@/types/entity-type.ts/user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Sidebar({ user, groupChats }: { user: User; groupChats: GroupChat[] }) {
  return (
    <div className="bg-blue-300 w-40">
      <div>side bar</div>
      {groupChats.map((chat) => (
        <div key={chat.id}>{chat.roomname}</div>
      ))}
      <div>{user.username}</div>
    </div>
  );
}
