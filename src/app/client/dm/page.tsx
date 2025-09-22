"use client";
import { useChat } from "@/hooks/use-chat";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DmPage() {
  const { user } = useUser();
  const { dms } = useChat();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login"); // redirect
    }
  }, [user, router]);

  if (!user) return <div>loading ...</div>; // avoid rendering content while redirecting

  const friendNames = dms.map((dm) => {
    return dm.members.find((m) => m.userId !== user.id)?.user.username;
  });

  return (
    <div className="bg-gray-300 w-full h-full border-1">
      <div className="flex flex-col justify-center items-center p-10 w-full h-full">
        <div>DM Page 'resizable'</div>
        <div className="flex flex-row gap-10 w-full h-full">
          <div>friend menu</div>
          <div className="border-1 w-50 p-5 h-full">
            {friendNames.map((fName: any) => {
              return <div key={fName}>{fName}</div>;
            })}
          </div>

          <div className="border-1 p-10 w-full h-full">right</div>
        </div>
      </div>
    </div>
  );
}
