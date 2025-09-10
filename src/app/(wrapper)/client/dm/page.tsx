import { cookies } from "next/headers";

export default async function DmPage() {
  //left panel require a list of direct messages
  //to get a list of dm, it needs accesstoken,
  //using cookie get a list of dms and also implement friend button.

  const cookieList = await cookies();
  const accesstoken = cookieList.get("accessToken")?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/chats/dms`, {
    method: "GET",
    headers: {
      cookie: `accessToken=${accesstoken}`,
    },
  });

  console.log(res);

  if (!res.ok) {
    throw new Error("Failed to fetch DMs");
  }

  const listOfDms = await res.json();

  return (
    <div className="bg-gray-300 w-full h-96 border-1 p-10">
      <div className="p-10 m-10">DM Page 'resizable'</div>
      {/* {listOfDms.map((dm: any) => {
        //dm type should be defined
        return <div>{dm.id}</div>;
      })} */}
      <div className="flex flex-row gap-10 p-10">
        <div className="border-1 p-10 m-10">Left : {listOfDms.message} </div>
        <div className="border-1 p-10 m-10">right</div>
      </div>
    </div>
  );
}
