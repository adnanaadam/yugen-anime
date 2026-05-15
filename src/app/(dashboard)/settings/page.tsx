// src/app/(dashboard)/settings/page.tsx

"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// Import game-icons.net SVGs
import BellIcon from "@/assets/icons/bell.svg";
import EyeIcon from "@/assets/icons/eye.svg";
import SyncIcon from "@/assets/icons/sync.svg";

export default function SettingsPage() {
  const [publicProfile, setPublicProfile] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Settings</h1>
      <p className="mt-1 text-sm text-gray-400">
        Manage your account preferences
      </p>

      <div className="mt-8 space-y-4">
        {/* Public Profile */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl border border-gray-800 bg-[#0A0A0A] p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <EyeIcon className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium text-white">Public Profile</p>
                <p className="text-sm text-gray-500">
                  Allow others to see your anime list
                </p>
              </div>
            </div>
            <button
              onClick={() => setPublicProfile(!publicProfile)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                publicProfile ? "bg-[#e5b23c]" : "bg-gray-700"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  publicProfile ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </motion.div>

        {/* Email Notifications */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-gray-800 bg-[#0A0A0A] p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BellIcon className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium text-white">Email Notifications</p>
                <p className="text-sm text-gray-500">
                  Get updates about new episodes
                </p>
              </div>
            </div>
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                emailNotifications ? "bg-[#e5b23c]" : "bg-gray-700"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  emailNotifications ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </motion.div>

        {/* AniList Sync */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-gray-800 bg-[#0A0A0A] p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SyncIcon className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium text-white">AniList Sync</p>
                <p className="text-sm text-gray-500">
                  Import and sync with your AniList account
                </p>
              </div>
            </div>
            <span className="rounded-full bg-gray-800 px-2 py-1 text-xs text-gray-500">
              Coming Soon
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}