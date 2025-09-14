import { DirectMessage, GroupChat } from "@/types/entity-type.ts/user";
import { cookies } from "next/headers";

export default async function DmPage() {
  const cookieList = await cookies();
  const accesstoken = cookieList.get("accessToken")?.value;

  const userRes = await fetch(`${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/users/me`, {
    method: "GET",
    headers: {
      cookie: `accessToken=${accesstoken}`,
    },
  });

  if (!userRes.ok) {
    throw new Error("User not authenticated");
  }

  const user = await userRes.json();

  const dmRes = await fetch(`${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/chats/dms`, {
    method: "GET",
    headers: {
      cookie: `accessToken=${accesstoken}`,
    },
  });

  if (!dmRes.ok) {
    throw new Error("Failed to fetch DMs");
  }

  const dms: DirectMessage[] = await dmRes.json();

  const friendNames = dms.map((dm) => {
    return dm.members.find((m) => m.userId !== user.id)?.user.username;
  });

  return (
    <div className="bg-gray-300 w-full h-full border-1">
      <div className="flex flex-col justify-center items-center p-10 w-full h-full">
        <div>DM Page 'resizable'</div>
        <div className="flex flex-row gap-10 w-full h-full">
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
