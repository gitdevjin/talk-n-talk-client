"use client";

import { useUser } from "@/hooks/use-user";
import { Chat, User } from "@/types/entity-type.ts/user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Sidebar({ user, groupChats }: { user: User; groupChats: Chat[] }) {
  return (
    <div className="bg-blue-300 w-40 p-4 space-y-2">
      <div className="font-bold mb-2">Side Bar</div>
      <Link href={`/client/dm/friend`}>
        <div>dm</div>
      </Link>
      {groupChats.map((chat) => (
        <Link key={chat.id} href={`/client/groupchat/${chat.id}`}>
          <div className="p-2 rounded hover:bg-blue-400 cursor-pointer">{chat.roomname}</div>
        </Link>
      ))}

      <div className="mt-4 font-semibold">{user.username}</div>
    </div>
  );
}
