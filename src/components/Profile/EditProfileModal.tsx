"use client";

import { useUser } from "@/hooks/use-user";
import { fetchWithRefreshClient } from "@/lib/client-api";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

interface EditProfileModalProps {
  onClose: () => void;
}

export default function EditProfileModal({ onClose }: EditProfileModalProps) {
  const { user, refreshUser } = useUser();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  if (!user) return;

  const handleUpdate = async () => {
    try {
      const data = await fetchWithRefreshClient(
        `${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/profiles/edit`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, bio }),
        },
      );

      console.log("updatedProfile)", data);
      alert("Profile updated successfully!");
      onClose();
      refreshUser();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AnimatePresence>
      <>
        {/* Overlay */}
        <motion.div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal panel */}
        <motion.div
          className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#1e1f22] text-white shadow-2xl"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="border-b border-white/10 p-6">
            <h2 className="text-2xl font-semibold">Edit Profile</h2>
            <p className="mt-1 text-sm text-gray-400">
              Update your profile information
            </p>
          </div>

          {/* Body */}
          <div className="space-y-5 p-6">
            {/* Avatar Row */}
            <div className="flex items-center gap-4">
              <Image
                src={user.profile?.avatarUrl || "/icons/default-avatar.png"}
                alt="Avatar"
                width={64}
                height={64}
                className="rounded-full"
              />
              <button className="rounded-lg bg-gray-700 px-4 py-2 text-sm transition hover:bg-gray-600">
                Change Avatar
              </button>
            </div>

            {/* Username */}
            <div className="flex flex-col space-y-1">
              <label className="text-sm text-gray-300">Username</label>
              <input
                disabled={true}
                className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-500 focus:ring focus:ring-indigo-500/50 focus:outline-none"
                defaultValue={user.username}
              />
            </div>

            {/* Display Name */}
            <div className="flex flex-col space-y-1">
              <label className="text-sm text-gray-300">Display Name</label>
              <input
                className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 focus:ring focus:ring-indigo-500/50 focus:outline-none"
                onChange={(e) => setName(e.target.value)}
                defaultValue={user.profile?.name}
              />
            </div>

            {/* Bio */}
            <div className="flex flex-col space-y-1">
              <label className="text-sm text-gray-300">Bio</label>
              <textarea
                className="h-24 resize-none rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 focus:ring focus:ring-indigo-500/50 focus:outline-none"
                defaultValue={user.profile?.bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-white/10 p-4">
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-700 px-4 py-2 text-sm transition hover:bg-gray-600"
            >
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium transition hover:bg-indigo-700"
            >
              Update
            </button>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}
