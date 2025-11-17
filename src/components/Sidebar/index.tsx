"use client";

import { useChat } from "@/hooks/use-chat";
import { useUser } from "@/hooks/use-user";
import Link from "next/link";
import { useState } from "react";
import CreateGroupChatModal from "./CreateGroupChatModal";
import { useSocket } from "@/hooks/use-socket";

export default function Sidebar() {
  const { unreads } = useSocket();
  const { user } = useUser();
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

        {/* Create GroupChat Icon */}
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
              <div className="relative group">
                <div className="w-12 h-12 bg-[var(--color-darkgrey-1)] rounded-full flex items-center justify-center text-sm font-medium text-gray-200 hover:bg-blue-600 cursor-pointer transition overflow-hidden">
                  {chat.roomname.length > 3 ? chat.roomname.slice(0, 3) + "…" : chat.roomname}
                </div>

                {/* Tooltip */}
                <div className="absolute left-[3rem] bottom-[1rem] px-2 py-1 bg-[var(--color-darkgrey)] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-10 border-1 border-gray-500">
                  {chat.roomname}
                </div>
                <div className="absolute -top-1 -right-1">
                  {unreads[chat.id] > 0 && (
                    <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white text-xs">
                      {unreads[chat.id]}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Modal */}
      <CreateGroupChatModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
