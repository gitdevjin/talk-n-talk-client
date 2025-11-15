import { fetchWithRefreshClient } from "@/lib/client-api"; // adjust path if needed

export async function createDm(friendId: string) {
  try {
    const data = await fetchWithRefreshClient(
      `${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/chats/dms/${friendId}`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    return data;
  } catch (e) {
    console.error("Failed to create or open DM", e);
    throw e; // re-throw so caller can handle it
  }
}
