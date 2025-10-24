import GroupChatLeftPane from "@/components/GroupChat/GroupChatLeftPane";
console.log("GroupChatLeftPane import:", GroupChatLeftPane);
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
      left={<GroupChatLeftPane chatId={id} initialMembers={members} />}
      right={children} // [id]/page.tsx renders here
    />
  );
}
