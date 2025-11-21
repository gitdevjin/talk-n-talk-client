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
    <div className="flex w-20 flex-col items-center justify-between bg-[var(--color-darkgrey)] p-4 text-gray-100">
      <div className="flex flex-col items-center justify-start gap-2 px-1">
        {/* DM Icon */}
        <Link href="/client/dm/friend">
          <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl bg-[var(--color-darkgrey-1)] transition hover:bg-blue-600">
            <img
              src="/icons/mail.png"
              alt="DM"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
        </Link>

        {/* Create GroupChat Icon */}
        <button
          onClick={() => setShowModal(true)}
          className="w-12 rounded-lg bg-[var(--color-skyblue-1)] py-2 text-white transition hover:cursor-pointer hover:bg-blue-600"
        >
          +
        </button>

        {/* Group Chats */}
        <div className="flex flex-col items-center gap-2">
          {groupChats.map((chat) => (
            <Link key={chat.id} href={`/client/groupchat/${chat.id}`}>
              <div className="group relative">
                <div className="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[var(--color-darkgrey-1)] text-sm font-medium text-gray-200 transition hover:bg-blue-600">
                  {chat.roomname.length > 3
                    ? chat.roomname.slice(0, 3) + "…"
                    : chat.roomname}
                </div>

                {/* Tooltip */}
                <div className="pointer-events-none absolute bottom-[1rem] left-[3rem] z-10 rounded border-1 border-gray-500 bg-[var(--color-darkgrey)] px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition group-hover:opacity-100">
                  {chat.roomname}
                </div>
                <div className="absolute -top-1 -right-1">
                  {unreads[chat.id] > 0 && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
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
      <CreateGroupChatModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
