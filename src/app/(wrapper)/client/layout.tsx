import { cookies } from "next/headers";
import { ReactNode } from "react";
import ClientShellLayout from "./(shell)/ClientShellLayout";

export default async function ClientLayout({ children }: { children: ReactNode }) {
  const cookieList = await cookies();
  const accesstoken = cookieList.get("accessToken")?.value;

  const chatRes = await fetch(`${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/chats`, {
    method: "GET",
    headers: {
      cookie: `accessToken=${accesstoken}`,
    },
  });

  if (!chatRes.ok) {
    throw new Error("Failed to fetch Chatrooms");
  }

  const chats = await chatRes.json();

  console.log(chats);

  return (
    <ClientShellLayout chats={chats}>
      <div>{children}</div>
    </ClientShellLayout>
  );
}
