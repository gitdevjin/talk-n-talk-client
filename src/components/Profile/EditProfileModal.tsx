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
        }
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal panel */}
        <motion.div
          className="fixed z-50 top-1/2 max-w-md left-1/2 w-full -translate-x-1/2 -translate-y-1/2 
                       rounded-2xl bg-[#1e1f22] text-white shadow-2xl border border-white/10"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-semibold">Edit Profile</h2>
            <p className="text-sm text-gray-400 mt-1">Update your profile information</p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Avatar Row */}
            <div className="flex items-center gap-4">
              <Image
                src={user.profile?.avatarUrl || "/icons/default-avatar.png"}
                alt="Avatar"
                width={64}
                height={64}
                className="rounded-full"
              />
              <button className="px-4 py-2 rounded-lg text-sm bg-gray-700 hover:bg-gray-600 transition">
                Change Avatar
              </button>
            </div>

            {/* Username */}
            <div className="flex flex-col space-y-1">
              <label className="text-sm text-gray-300">Username</label>
              <input
                disabled={true}
                className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring focus:ring-indigo-500/50 text-gray-500"
                defaultValue={user.username}
              />
            </div>

            {/* Display Name */}
            <div className="flex flex-col space-y-1">
              <label className="text-sm text-gray-300">Display Name</label>
              <input
                className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring focus:ring-indigo-500/50"
                onChange={(e) => setName(e.target.value)}
                defaultValue={user.profile?.name}
              />
            </div>

            {/* Bio */}
            <div className="flex flex-col space-y-1">
              <label className="text-sm text-gray-300">Bio</label>
              <textarea
                className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 h-24 resize-none focus:outline-none focus:ring focus:ring-indigo-500/50"
                defaultValue={user.profile?.bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm bg-gray-700 hover:bg-gray-600 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              className="px-4 py-2 rounded-lg text-sm bg-indigo-600 hover:bg-indigo-700 transition font-medium"
            >
              Update
            </button>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}
