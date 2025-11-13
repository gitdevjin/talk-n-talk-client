// components/GroupChat/GroupChatLeftPane.tsx
"use client";

import InviteFriendModal from "@/components/GroupChat/InviteFriendModal";
import { fetchWithRefreshClient } from "@/lib/client-api";
import { useState } from "react";

interface GroupChatLeftPaneProps {
  chatId: string;
  initialMembers: any[]; // you can type this properly
}

export default function GroupChatLeftPane({ chatId, initialMembers }: GroupChatLeftPaneProps) {
  const [showModal, setShowModal] = useState(false);
  const [members, setMembers] = useState(initialMembers);

  const fetchMembers = async () => {
    try {
      const data = await fetchWithRefreshClient(
        `${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/chats/group/${chatId}/members`
      );
      setMembers(data);
    } catch (err) {
      console.error("Failed to fetch members:", err);
    }
  };

  return (
    <div className="bg-[var(--color-darkgrey-1)] h-full flex flex-col text-gray-200">
      <p className="text-xl font-bold p-3 bg-[var(--color-darkgrey-1)] border-r border-b border-[var(--color-darkgrey)]">
        Participants
      </p>

      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-3 rounded-md hover:bg-[var(--color-darkgrey)] transition"
      >
        <span className="text-2xl font-bold m-1 px-1 py-1 text-green-400">+</span>
        <span className="flex items-center text-sm">Invite Friend</span>
      </button>

      <div className="flex-1 overflow-auto">
        {members.map((m) => (
          <div
            key={m.id}
            className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--color-darkgrey)] hover:cursor-pointer rounded"
          >
            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white">
              {m.user.username[0].toUpperCase()}
            </div>
            <span className="truncate">{m.user.username}</span>
          </div>
        ))}
      </div>

      <InviteFriendModal
        chatId={chatId}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        refreshMembers={fetchMembers}
      />
    </div>
  );
}
