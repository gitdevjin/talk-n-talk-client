import { DirectMessage, GroupChat } from "@/types/entity-type.ts/user";
import { cookies } from "next/headers";

export async function getGroupChats(): Promise<GroupChat[]> {
  const cookieList = await cookies();
  const accessToken = cookieList.get("accessToken")?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/chats/group`, {
    method: "GET",
    headers: {
      cookie: `accessToken=${accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch GroupChats");
  }

  return res.json();
}

export async function getDirectMessages(): Promise<DirectMessage[]> {
  const cookieList = await cookies();
  const accessToken = cookieList.get("accessToken")?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/chats/dms`, {
    method: "GET",
    headers: {
      cookie: `accessToken=${accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch DirectMessages");
  }

  return res.json();
}
