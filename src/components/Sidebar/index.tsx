"use client";

import { useChat } from "@/hooks/use-chat";
import { useUser } from "@/hooks/use-user";
import { Chat, User } from "@/types/entity-type.ts/user";
import Link from "next/link";
import { useState } from "react";
import CreateGroupChatModal from "./CreateGroupChatModal";

export default function Sidebar() {
  const { user, logout } = useUser();
  const { groupChats } = useChat();
  const [showModal, setShowModal] = useState(false);

  if (!user) return null;

  return (
    <div className="flex flex-col items-center justify-between bg-[var(--color-darkgrey)] w-20 p-4 text-gray-100">
      <div className="flex flex-col items-center justify-start gap-2 px-1">
        {/* DM Icon */}
        <Link href="/client/dm/friend">
          <div className="w-12 h-12 bg-[var(--color-darkgrey-1)] rounded-xl flex items-center justify-center hover:bg-blue-600 cursor-pointer transition">
            <img src="/icons/mail.png" alt="DM" width={28} height={28} className="object-contain" />
          </div>
        </Link>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[var(--color-skyblue-1)] text-white rounded-lg w-12 py-2 hover:bg-blue-600 transition hover:cursor-pointer"
        >
          +
        </button>

        {/* Group Chats */}
        <div className="flex flex-col items-center gap-2">
          {groupChats.map((chat) => (
            <Link key={chat.id} href={`/client/groupchat/${chat.id}`}>
              <div
                className="w-12 h-12 bg-[var(--color-darkgrey-1)] rounded-full flex items-center justify-center text-sm font-medium text-gray-200 hover:bg-blue-600 cursor-pointer transition overflow-hidden"
                title={chat.roomname}
              >
                {chat.roomname.length > 3 ? chat.roomname.slice(0, 3) + "…" : chat.roomname}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <button className="p-2 text-red-500 hover:underline" onClick={logout}>
          Logout
        </button>
        <div className="font-semibold">{user.username}</div>
      </div>
      {/* Modal */}
      <CreateGroupChatModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
