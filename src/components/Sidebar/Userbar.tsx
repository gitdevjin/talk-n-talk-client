"use client";

import { useState, useRef } from "react";
import { useUser } from "@/hooks/use-user";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import EditProfileModal from "../Profile/EditProfileModal";

export default function UserBar() {
  const { user, logout } = useUser();
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [displayEditProfile, setDisplayEditProfile] = useState(false);

  if (!user) return <div className="text-white">Loading...</div>;

  return (
    <>
      {/* UserBar */}
      <div
        ref={barRef}
        onClick={() => setOpen((prev) => !prev)} // toggle modal
        className="absolute right-3 bottom-3 left-[-70px] z-10 flex cursor-pointer items-center justify-between rounded-lg border border-[var(--color-darkgrey-2)] bg-[var(--color-darkgrey-2)]/95 px-2 py-1 shadow-md backdrop-blur-sm"
      >
        <div className="flex items-center gap-3 rounded-lg p-2 pr-4 transition hover:bg-[var(--color-darkgrey-2)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-600 text-sm font-semibold text-white">
            {user.username[0].toUpperCase()}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-gray-700">
              {user.username}
            </span>
            <span className="text-xs text-gray-200">#{user.profile.name}</span>
          </div>
        </div>
      </div>

      {/* Modal / Dropdown above the bar */}
      {displayEditProfile && (
        <EditProfileModal onClose={() => setDisplayEditProfile(false)} />
      )}

      {/* Popover / modal */}
      <AnimatePresence>
        {open && barRef.current && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/30"
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
                bottom:
                  window.innerHeight -
                  barRef.current.getBoundingClientRect().top +
                  10,
              }}
              className="z-50 w-84 overflow-hidden rounded-2xl bg-[#1e1f22] text-white shadow-2xl"
            >
              {/* Header banner */}
              <div className="relative h-24 bg-gradient-to-r from-indigo-400 to-purple-500">
                <Image
                  src={user.profile?.avatarUrl || "/icons/default-avatar.png"}
                  alt={`${user.username}'s avatar`}
                  width={80}
                  height={80}
                  className="absolute bottom-0 left-6 translate-y-1/2 rounded-full border-2 border-[#1e1f22]"
                />
              </div>

              {/* Body */}
              <div className="space-y-4 px-8 pt-10 pb-6">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-semibold">{user.username}</h2>
                  <div>
                    <span className="text-md text-gray-300">
                      {user.profile?.name}{" "}
                      <span className="text-gray-400">
                        #{user.id.slice(0, 6)}
                      </span>
                    </span>
                    <span className="ml-2 h-3 w-3 rounded-full bg-green-400" />
                  </div>
                </div>

                <p className="text-sm text-gray-300">
                  {user.profile?.bio || "No bio"}
                </p>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => {
                      setOpen(false);
                      setDisplayEditProfile(true);
                    }}
                    className="w-full rounded-lg bg-indigo-600 py-3 pl-4 text-left text-sm font-medium transition hover:cursor-pointer hover:bg-indigo-700"
                  >
                    Edit Profile
                  </button>
                  <button className="w-full rounded-lg bg-gray-700 py-3 pl-4 text-left text-sm font-medium transition hover:cursor-pointer hover:bg-gray-600">
                    Settings
                  </button>
                  <button
                    onClick={logout}
                    className="w-full rounded-lg py-2 text-right text-sm font-medium text-red-400 transition hover:cursor-pointer hover:text-red-500"
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
