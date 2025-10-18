"use client";
import AddFriendModal from "@/components/Friend/AddFriendModal";
import TwoPaneLayout from "@/components/Layouts/TwoPaneLayout";
import { useChat } from "@/hooks/use-chat";
import { useUser } from "@/hooks/use-user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

// to-do`s in this page
// make this page as layout
// use twopanelayout component,
// left pane will be menu, initial page will be friends, but currently return empty array
// right pane will be children
// when you click a dm on the left pane you will see the messages from the right pane.

export default function DmLayout({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const { dms } = useChat();
  const [showModal, setShowModal] = useState(false);

  if (!user) return <div>loading ...</div>; // avoid rendering content while redirecting

  // Map friend names and DM links
  const dmList = dms.map((dm) => {
    const friend = dm.members.find((m) => m.userId !== user.id);
    return { id: dm.id, username: friend?.user.username || "Unknown" };
  });

  const left = (
    <div className="flex flex-col h-full w-full bg-[var(--color-darkgrey-1)] text-gray-200 border-r border-[var(--color-darkgrey)]">
      {/* --- Header/Menu Section --- */}
      <div className="flex flex-col gap-2 p-3 border-b border-[var(--color-darkgrey)]">
        <div className="font-bold text-lg text-white mb-2">Direct Messages</div>

        <Link
          href={`/client/dm/friend`}
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[var(--color-darkgrey)] transition"
        >
          <img className="m-1" src="/icons/friends.png" alt="Friends" width={22} height={22} />
          <span className="text-sm">Friends</span>
        </Link>

        <button
          className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-[var(--color-darkgrey)] transition hover:cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <span className="text-xl font-bold m-1 px-1 text-green-400">+</span>
          <span className="text-sm">Add Friend</span>
        </button>
      </div>

      {/* --- DM List Section --- */}
      <div className="flex-1 overflow-y-auto p-2">
        {dmList.length === 0 ? (
          <div className="text-sm text-gray-400 text-center mt-4">No DMs yet</div>
        ) : (
          dmList.map((dm) => (
            <Link key={dm.id} href={`/client/dm/${dm.id}`}>
              <div className="flex items-center px-3 py-2 rounded-md hover:bg-[var(--color-darkgrey)] cursor-pointer transition">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-sm font-semibold uppercase">
                  {dm.username[0]}
                </div>
                <span className="ml-3 truncate text-sm">{dm.username}</span>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Modal */}
      <AddFriendModal isOpen={showModal} onClose={() => setShowModal(false)}></AddFriendModal>
    </div>
  );

  return <TwoPaneLayout left={left} right={children}></TwoPaneLayout>;
}
