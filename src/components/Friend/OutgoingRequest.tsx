"use client";

import { useEffect, useState } from "react";
import { fetchWithRefreshClient } from "@/lib/client-api";
import { User } from "@/types/entity-type.ts/user";

interface FriendRequest {
  id: string;
  receiver: User;
  status: string;
}

export default function OutgoingRequest() {
  const [requests, setRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const data = await fetchWithRefreshClient(
        `${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/users/friends/requests/outgoing`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      setRequests(data);
    };

    fetchRequests();
  }, []);

  const handleCancel = async (requestId: string) => {
    try {
      await fetchWithRefreshClient(
        `${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/users/friends/requests/${requestId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (error) {
      console.error("Failed to cancel request:", error);
    }
  };

  return (
    <div className="flex flex-col gap-1 p-2">
      <div className="font-bold text-gray-700 text-2xl px-3 py-2">Requests Sent</div>

      {requests.length === 0 ? (
        <div className="text-gray-400 text-sm px-3 py-4">No outgoing requests</div>
      ) : (
        requests.map((req) => (
          <div
            key={req.id}
            className="flex items-center justify-between gap-3 px-3 py-2 rounded-md hover:bg-[var(--color-darkgrey-1)] transition"
          >
            {/* Avatar */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                {req.receiver.username[0].toUpperCase()}
              </div>
              <span className="text-sm text-white">{req.receiver.username}</span>
            </div>

            {/* Cancel button */}
            {req.status === "declined" ? (
              <span className="text-xs text-red-400 font-medium">Declined</span>
            ) : (
              <button
                onClick={() => handleCancel(req.id)}
                className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-md"
              >
                Cancel
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
