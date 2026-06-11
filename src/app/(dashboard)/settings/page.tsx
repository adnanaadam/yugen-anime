// src/app/(dashboard)/settings/page.tsx
"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [publicProfile, setPublicProfile] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#545863]">Settings</h1>
        <p className="mt-1 text-sm text-[#7b7f89]">Manage your preferences</p>
      </div>

      <div className="space-y-3">
        {/* Public Profile */}
        <div className="rounded-xl border border-[#ececec] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#545863]">Public Profile</p>
              <p className="text-xs text-[#7b7f89] mt-0.5">
                Allow others to see your anime list
              </p>
            </div>
            <button
              onClick={() => setPublicProfile(!publicProfile)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                publicProfile ? "bg-[#f9c846]" : "bg-[#ececec]"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  publicProfile ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Email Notifications */}
        <div className="rounded-xl border border-[#ececec] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#545863]">Email Notifications</p>
              <p className="text-xs text-[#7b7f89] mt-0.5">
                Get updates about new episodes
              </p>
            </div>
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                emailNotifications ? "bg-[#f9c846]" : "bg-[#ececec]"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  emailNotifications ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Coming soon */}
        <div className="rounded-xl border border-[#ececec] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#545863]">AniList Sync</p>
              <p className="text-xs text-[#7b7f89] mt-0.5">
                Import and sync with your AniList account
              </p>
            </div>
            <span className="rounded-lg bg-[#f7f7f7] px-2.5 py-1 text-[11px] text-[#7b7f89]">
              Soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}