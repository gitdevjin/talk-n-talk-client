"use client";

import { useUser } from "@/hooks/use-user";
import { Chat, User } from "@/types/entity-type.ts/user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Sidebar({ user, groupChats }: { user: User; groupChats: Chat[] }) {
  return (
    <div className="bg-blue-300 w-30 p-4">
      <div className="font-bold">Side Bar</div>
      <Link href={`/client/dm/friend`}>
        <img
          src="/icons/mail.png"
          alt="User Avatar"
          width={48}
          height={48}
          className="hover:bg-blue-400 cursor-pointer"
        />
      </Link>
      {groupChats.map((chat) => (
        <Link key={chat.id} href={`/client/groupchat/${chat.id}`}>
          <div className="p-2 rounded hover:bg-blue-400 cursor-pointer">{chat.roomname}</div>
        </Link>
      ))}

      <div className="font-semibold">{user.username}</div>
    </div>
  );
}
