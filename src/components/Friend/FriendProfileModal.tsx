"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "@/types/entity-type.ts/user";

interface FriendProfileModalProps {
  onClose: () => void;
  user: User;
  onClickMessage: (friendId: string) => void;
}

export default function FriendProfileModal({
  user,
  onClose,
  onClickMessage,
}: FriendProfileModalProps) {
  // close when pressing ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      <div>
        {/* Background overlay */}
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal box */}
        <motion.div
          className="fixed z-50 top-1/2 left-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden shadow-2xl bg-[#1e1f22] text-white"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          {/* Header banner */}
          <div className="relative h-24 bg-gradient-to-r from-indigo-500 to-purple-600">
            <Image
              src={user.profile?.avatarUrl || "/icons/default-avatar.png"}
              alt={`${user.username}'s avatar`}
              width={80}
              height={80}
              className="rounded-full border-4 border-[#1e1f22] absolute bottom-0 left-6 translate-y-1/2"
            />
          </div>

          {/* Body */}
          <div className="px-6 pt-10 pb-6 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{user.username}</h2>
                <span className="text-sm text-gray-400">{user.profile?.name}</span>
                <span className={`w-3 h-3 rounded-full`}></span>
              </div>
            </div>

            <p className="text-sm text-gray-300">
              {user.profile?.bio ? user.profile.bio : "no bio"}
            </p>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => onClickMessage(user.id)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 transition rounded-lg py-2 text-sm font-medium"
              >
                Message
              </button>
              <button
                className="flex-1 bg-gray-700 hover:bg-gray-600 transition rounded-lg py-2 text-sm font-medium"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
