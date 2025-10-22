"use client";

import FriendList from "@/components/Friend/FriendList";
import IncomingRequest from "@/components/Friend/IncomingRequest";
import OutgoingRequest from "@/components/Friend/OutgoingRequest";
import { useState } from "react";

export default function FriendPage() {
  const [tab, setTab] = useState<"friends" | "incoming" | "outgoing">("friends");

  const tabs = [
    { key: "friends", label: "Friends" },
    { key: "incoming", label: "Requests Received" },
    { key: "outgoing", label: "Requests Sent" },
  ];

  return (
    <div className="w-full px-6 py-4">
      {/* Tab Header */}
      <div className="flex border-b border-gray-600 mb-6">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key as typeof tab)}
            className={`
              relative px-4 py-2 text-lg font-medium transition-colors hover:cursor-pointer
              ${tab === key ? "text-white" : "text-gray-700 hover:text-gray-500"}
            `}
          >
            {label}
            {tab === key && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tab === "friends" && <FriendList />}
        {tab === "incoming" && <IncomingRequest />}
        {tab === "outgoing" && <OutgoingRequest />}
      </div>
    </div>
  );
}
