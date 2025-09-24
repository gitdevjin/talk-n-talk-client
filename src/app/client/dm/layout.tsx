"use client";
import TwoPaneLayout from "@/components/Layouts/TwoPaneLayout";
import { useChat } from "@/hooks/use-chat";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

// to-do`s in this page
// make this page as layout
// use twopanelayout component,
// left pane will be menu, initial page will be friends, but currently return empty array
// right pane will be children
// when you click a dm on the left pane you will see the messages from the right pane.

export default function DmLayout({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const { dms } = useChat();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/auth/login"); // redirect, probably it should change the logic to check cookie
    }
  }, [user, router]);

  if (!user) return <div>loading ...</div>; // avoid rendering content while redirecting

  const friendNames = dms.map((dm) => {
    return dm.members.find((m) => m.userId !== user.id)?.user.username;
  });

  const left = (
    <div className="w-full h-full">
      <div className="flex flex-col justify-center items-center p-10 w-full h-full">
        <div className="flex flex-row border-1 w-50 p-5 h-full">
          {friendNames.map((fName: any) => {
            return <div key={fName}>{fName}</div>;
          })}
        </div>
      </div>
    </div>
  );

  return <TwoPaneLayout left={left} right={children}></TwoPaneLayout>;
}
