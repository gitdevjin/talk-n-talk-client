import { fetchWithRefreshClient } from "@/lib/client-api";
import { User } from "@/types/entity-type.ts/user";
import { useEffect, useState } from "react";

interface FriendRequest {
  id: string;
  requester: User;
  status: string;
}

export default function IncomingRequest() {
  const [requests, setRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const data = await fetchWithRefreshClient(
        `${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/users/friends/requests/incoming`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      setRequests(data);
    };

    fetchRequests();
  }, []);

  const handleAccept = async (requestId: string) => {
    await fetchWithRefreshClient(
      `${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/users/friends/requests/accept`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      }
    );

    setRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const handleDecline = async (requestId: string) => {
    await fetchWithRefreshClient(
      `${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/users/friends/decline`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      }
    );

    setRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  return (
    <div className="flex flex-col gap-1 p-2">
      <div className="font-bold text-gray-700 text-2xl px-3 py-2">Friend Requests</div>

      {requests.length === 0 ? (
        <div className="text-gray-400 text-sm px-3 py-4">No incoming requests</div>
      ) : (
        requests.map((req) => (
          <div
            key={req.id}
            className="flex items-center justify-between gap-3 px-3 py-2 rounded-md hover:bg-[var(--color-darkgrey-3)] transition"
          >
            {/* Avatar */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                {req.requester.username[0].toUpperCase()}
              </div>
              <span className="text-sm text-white">{req.requester.username}</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleAccept(req.id)}
                className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md"
              >
                Accept
              </button>
              <button
                onClick={() => handleDecline(req.id)}
                className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-md"
              >
                Decline
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
