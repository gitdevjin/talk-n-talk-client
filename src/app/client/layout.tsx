import { ReactNode } from "react";
import { SocketProvider } from "@/hooks/use-socket";
import { getDirectMessages, getGroupChats } from "@/lib/api";
import { Chat, DirectMessage, GroupChat } from "@/types/entity-type.ts/user";
import { ChatProvider } from "@/hooks/use-chat";
import ChatLayout from "../../components/Layouts/ChatLayout";

export default async function ClientLayout({ children }: { children: ReactNode }) {
  const groupChats: GroupChat[] = await getGroupChats();
  const dms: DirectMessage[] = await getDirectMessages();
  const chats: Chat[] = [...groupChats, ...dms];

  return (
    <div>
      <SocketProvider chats={chats}>
        <ChatProvider initialDms={dms} initialGroupChats={groupChats}>
          <ChatLayout>{children}</ChatLayout>
        </ChatProvider>
      </SocketProvider>
    </div>
  );
}
