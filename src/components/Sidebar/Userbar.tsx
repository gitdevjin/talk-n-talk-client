"use client";

import { useUser } from "@/hooks/use-user";

export default function UserBar() {
  const { user, logout } = useUser();

  const onLogout = () => {};

  if (!user) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div
      className="absolute bottom-3 left-[-70px] right-3 z-10 flex items-center justify-between
        bg-[var(--color-darkgrey-3)]/95 backdrop-blur-sm border border-[var(--color-darkgrey-2)] rounded-lg
        px-2 py-1 shadow-md "
    >
      {/* Left side: avatar + username */}
      <div className="flex items-center gap-3 hover:bg-[var(--color-darkgrey-2)] hover:cursor-pointer rounded-lg p-2 pr-4 transition">
        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-semibold text-white text-sm">
          {user.username[0].toUpperCase()}
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-gray-700 text-sm">{user.username}</span>
          <span className="text-gray-400 text-xs">#{user.id.slice(0, 4)}</span>
        </div>
      </div>

      {/* Logout button */}
      <button
        onClick={logout}
        className="text-gray-400 hover:text-red-500 hover:cursor-pointer
          text-sm font-semibold transition
        "
      >
        ⎋
      </button>
    </div>
  );
}
