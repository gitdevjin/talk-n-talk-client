"use client";
import { useUser } from "@/hooks/use-user";
import { GroupChat, User } from "@/types/entity-type.ts/user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Sidebar({ groupChats }: { groupChats: GroupChat[] }) {
  console.log("it's sidebar here");
  console.log(groupChats);

  return (
    <div className="bg-blue-300 w-40">
      <div>side bar</div>
      {groupChats.map((chat) => (
        <div key={chat.id}>{chat.roomname}</div>
      ))}
    </div>
  );
}
