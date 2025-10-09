"use client";

import { useUser } from "@/hooks/use-user";
import { Chat, User } from "@/types/entity-type.ts/user";
import Link from "next/link";

export default function Sidebar({ groupChats }: { groupChats: Chat[] }) {
  const { user, logout } = useUser();

  if (!user) return null;

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

      <button className="p-2 m-2 text-red-500 hover:underline" onClick={logout}>
        Logout
      </button>

      <div className="font-semibold">{user.username}</div>
    </div>
  );
}
