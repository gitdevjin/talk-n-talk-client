import { DirectMessage, GroupChat } from "@/types/entity-type.ts/user";
import { cookies } from "next/headers";

export default async function DmPage() {
  //left panel require a list of direct messages
  //to get a list of dm, it needs accesstoken,
  //using cookie get a list of dms and also implement friend button.

  const cookieList = await cookies();
  const accesstoken = cookieList.get("accessToken")?.value;

  const userRes = await fetch(`${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/users/me`, {
    method: "GET",
    headers: {
      cookie: `accessToken=${accesstoken}`,
    },
  });

  if (!userRes) {
    throw new Error("User not authenticated");
  }

  const user = await userRes.json();

  const res = await fetch(`${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/chats/dms`, {
    method: "GET",
    headers: {
      cookie: `accessToken=${accesstoken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch DMs");
  }

  const listOfDms: DirectMessage[] = await res.json();

  console.log(listOfDms);
  console.log(user.id);

  const friendNames = listOfDms.map((dm) => {
    return dm.members.find((m) => m.userId !== user.id)?.user.username;
  });

  console.log("---------------");
  console.log(friendNames);

  return (
    <div className="bg-gray-300 w-full h-full border-1">
      <div className="flex flex-col justify-center items-center p-10 w-full h-full">
        <div>DM Page 'resizable'</div>
        <div className="flex flex-row gap-10 w-full h-full">
          <div className="border-1 w-50 p-5 h-full">
            {friendNames.map((friend: any) => {
              return <div key={friend}>{friend}</div>;
            })}
          </div>
          <div className="border-1 p-10 w-full h-full">right</div>
        </div>
      </div>
    </div>
  );
}
