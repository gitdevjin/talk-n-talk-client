// todo here
// make this page as layout
// left pane will be a list of friends name in the room,
// right pane will be messages

import TwoPaneLayout from "@/components/Layouts/TwoPaneLayout";
import { getGroupChatMembers } from "@/lib/api";
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
        <div>
          <p className="text-3xl">Participants</p>
          <div>
            {members.map((m) => (
              <div key={m.id}>{m.user.username}</div>
            ))}
          </div>
        </div>
      }
      right={children} // [id]/page.tsx renders here
    />
  );
}
