"use client";

import Sidebar from "@/components/Sidebar";
import { useChat } from "@/hooks/use-chat";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function ChatLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useUser(); // use loading state from provider
  const { groupChats } = useChat();
  const router = useRouter();

  // 🔒 Redirect to login if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user, router]);

  // Show loading while user state is being fetched
  if (loading) return <div>Loading...</div>;

  // Render layout only when user is available
  if (!user) return null; // optional fallback; redirect happens above

  return (
    <div className="h-screen bg-amber-100">
      <div>client layout</div>
      <div className="flex flex-row h-full w-full">
        <div className="flex flex-row h-full w-full">
          <Sidebar user={user} groupChats={groupChats} />
          {children} {/* DM, chatroom/id pages */}
        </div>
      </div>
    </div>
  );
}
