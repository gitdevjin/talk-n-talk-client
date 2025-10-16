"use client";

import Sidebar from "@/components/Sidebar";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function ChatLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useUser(); // use loading state from provider
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
    <div className="h-screen flex flex-col w-full">
      <div className="flex items-center h-8 justify-center bg-[var(--color-darkgrey)] text-white">
        Talk and Talk
      </div>
      <div className="flex flex-1 flex-row overflow-hidden">
        <Sidebar />
        {children} {/* DM, chatroom/id pages */}
      </div>
    </div>
  );
}
