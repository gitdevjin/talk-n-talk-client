"use client";

import { useState, useRef } from "react";
import { useUser } from "@/hooks/use-user";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export default function UserBar() {
  const { user, logout } = useUser();
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  if (!user) return <div className="text-white">Loading...</div>;

  return (
    <>
      {/* UserBar */}
      <div
        ref={barRef}
        onClick={() => setOpen((prev) => !prev)} // toggle modal
        className="absolute bottom-3 left-[-70px] right-3 z-10 flex items-center justify-between
          bg-[var(--color-darkgrey-2)]/95 backdrop-blur-sm border border-[var(--color-darkgrey-2)] rounded-lg
          px-2 py-1 shadow-md cursor-pointer"
      >
        <div className="flex items-center gap-3 hover:bg-[var(--color-darkgrey-2)] rounded-lg p-2 pr-4 transition">
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-semibold text-white text-sm">
            {user.username[0].toUpperCase()}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-gray-700 text-sm">{user.username}</span>
            <span className="text-gray-200 text-xs">#{user.profile.name}</span>
          </div>
        </div>
      </div>

      {/* Modal / Dropdown above the bar */}
      {/* Popover / modal */}
      <AnimatePresence>
        {open && barRef.current && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Panel */}
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "absolute",
                left: -70,
                bottom: window.innerHeight - barRef.current.getBoundingClientRect().top + 10,
              }}
              className="z-50 w-72 rounded-2xl overflow-hidden shadow-2xl bg-[#1e1f22] text-white"
            >
              {/* Header banner */}
              <div className="relative h-24 bg-gradient-to-r from-indigo-400 to-purple-500">
                <Image
                  src={user.profile?.avatarUrl || "/icons/default-avatar.png"}
                  alt={`${user.username}'s avatar`}
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-[#1e1f22] absolute bottom-0 left-6 translate-y-1/2"
                />
              </div>

              {/* Body */}
              <div className="px-8 pt-10 pb-6 space-y-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-semibold">{user.username}</h2>
                  <div>
                    <span className="text-md text-gray-300">
                      {user.profile?.name}{" "}
                      <span className="text-gray-400">#{user.id.slice(0, 6)}</span>
                    </span>
                    <span className="ml-2 w-3 h-3 rounded-full bg-green-400" />
                  </div>
                </div>

                <p className="text-sm text-gray-300">{user.profile?.bio || "No bio"}</p>

                <div className="flex flex-col gap-2 pt-2">
                  <button className="w-full text-left pl-4 bg-indigo-600 hover:bg-indigo-700 transition rounded-lg py-2 text-sm font-medium">
                    Edit Profile
                  </button>
                  <button className="w-full text-left pl-4 bg-gray-700 hover:bg-gray-600 transition rounded-lg py-2 text-sm font-medium">
                    Settings
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-right text-red-400 hover:text-red-500 transition rounded-lg py-2 text-sm font-medium"
                  >
                    Logout ⎋
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
