import { ChatMember, DirectMessage, GroupChat } from "@/types/entity-type.ts/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getGroupChats(): Promise<GroupChat[]> {
  return fetchWithRefresh(`${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/chats/group`);
}

export async function getDirectMessages(): Promise<DirectMessage[]> {
  return fetchWithRefresh(`${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/chats/dms`);
}

export async function getGroupChatMembers(roomId: string): Promise<ChatMember[]> {
  return fetchWithRefresh(
    `${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/chats/group/${roomId}/members`
  );
}

async function fetchWithRefresh(url: string, options: RequestInit = {}) {
  const cookieList = await cookies();
  let accessToken = cookieList.get("accessToken")?.value;

  // initial request
  let res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      cookie: `accessToken=${accessToken}`,
    },
    cache: "no-store",
  });

  // if accessToken expired
  if (res.status === 401) {
    // call refresh endpoint
    const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        cookie: `refreshToken=${cookieList.get("refreshToken")?.value}`,
      },
      cache: "no-store",
    });

    console.log("refrehsed!!");

    if (!refreshRes.ok) {
      // Redirect user to login page
      redirect("/auth/login");
    }

    const data = await refreshRes.json();
    accessToken = data.accessToken;

    // retry original request with new accessToken
    res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        cookie: `accessToken=${accessToken}`,
      },
      cache: "no-store",
    });
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.statusText}`);
  }

  return res.json();
}
