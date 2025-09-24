"use client";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FriendPage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/auth/login"); // redirect
    }
  }, [user, router]);

  console.log(user);

  return <div>friend page</div>;
}
