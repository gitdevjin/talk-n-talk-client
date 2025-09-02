"use client";
import { useUser } from "@/hooks/use-user";
import { User } from "@/types/entity-type.ts/user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Sidebar({ user }: { user: User }) {
  return <div>SideBar</div>;
}
