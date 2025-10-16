// todo here
// make this page as layout
// left pane will be a list of friends name in the room,
// right pane will be messages

import TwoPaneLayout from "@/components/Layouts/TwoPaneLayout";
import { getGroupChatMembers } from "@/lib/api";
import Link from "next/link";
import { ReactNode } from "react";

interface GroupChatLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

export default async function GroupChatLayout({ children, params }: GroupChatLayoutProps) {
  const { id } = await params;
  const members = await getGroupChatMembers(id);

  return (
    <TwoPaneLayout
      left={
        <div className="bg-[var(--color-darkgrey-1)] h-full flex flex-col  text-gray-200">
          <p className="text-xl font-bold p-3 bg-[var(--color-darkgrey-1)] border-r border-b border-[var(--color-darkgrey)]">
            Participants
          </p>
          <Link
            href={`/client/dm/add`}
            className="flex items-center gap-2 px-3  rounded-md hover:bg-[var(--color-darkgrey)] transition"
          >
            <span className="text-2xl font-bold m-1 px-1 py-1 text-green-400">+</span>
            <span className="flex items-center text-sm">Invite Friend</span>
          </Link>
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
        </div>
      }
      right={children} // [id]/page.tsx renders here
    />
  );
}
