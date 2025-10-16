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
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white rounded-lg px-3 py-2 hover:bg-blue-600 transition"
      >
        +
      </button>
      {groupChats.map((chat) => (
        <Link key={chat.id} href={`/client/groupchat/${chat.id}`}>
          <div className="p-2 rounded hover:bg-blue-400 cursor-pointer">{chat.roomname}</div>
        </Link>
      ))}

      <button className="p-2 m-2 text-red-500 hover:underline" onClick={logout}>
        Logout
      </button>

      <div className="font-semibold">{user.username}</div>
      {/* Modal */}
      <CreateGroupChatModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
