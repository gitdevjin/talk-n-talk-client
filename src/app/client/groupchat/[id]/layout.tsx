// todo here
// make this page as layout
// left pane will be a list of friends name in the room,
// right pane will be messages

import TwoPaneLayout from "@/components/Layouts/TwoPaneLayout";
import { getGroupChatMembers } from "@/lib/api";
import { ReactNode } from "react";

interface GroupChatLayoutProps {
  children: ReactNode;
  params: { id: string };
}

export default async function GroupChatLayout({ children, params }: GroupChatLayoutProps) {
  const members = await getGroupChatMembers(params.id);
  console.log(params.id);
  console.log(members);
  return (
    <TwoPaneLayout
      left={
        <div>
          {members.map((m) => (
            <div>{m.user.username}</div>
          ))}
        </div>
      }
      right={children} // [id]/page.tsx renders here
    />
  );
}
