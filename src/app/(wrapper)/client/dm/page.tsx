export default async function DmPage() {
  //left panel require a list of direct messages
  //to get a list of dm, it needs accesstoken,
  //using cookie get a list of dms and also implement friend button.

  const res = await fetch(`${process.env.NEXT_PUBLIC_TNT_SERVER_URL}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch DMs");
  }

  const listOfDms = await res.json();

  return (
    <div>
      <div>DM Page 'resizable'</div>
      {listOfDms.map((dm: any) => {
        //dm type should be defined
        return <div>{dm.id}</div>;
      })}
      <div>
        <div>left</div>
        <div>right</div>
      </div>
    </div>
  );
}
