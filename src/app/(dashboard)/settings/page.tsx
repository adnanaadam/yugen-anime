// src/app/(dashboard)/settings/page.tsx
"use client";

export default function SettingsPage() {

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#545863]">Settings</h1>
        <p className="mt-1 text-sm text-[#7b7f89]">Manage your preferences</p>
      </div>

      <div className="space-y-3">
        {/* Public Profile */}
        <div className="rounded-xl border border-[#ececec] bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#545863]">Public Profile</p>
              <p className="text-xs text-[#7b7f89] mt-0.5">
                Allow others to see your anime list
              </p>
            </div>
            <span className="rounded-lg bg-[#f7f7f7] px-2.5 py-1 text-[11px] text-[#7b7f89]">
              Soon
            </span>
          </div>
        </div>

        {/* Email Notifications */}
        <div className="rounded-xl border border-[#ececec] bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#545863]">Email Notifications</p>
              <p className="text-xs text-[#7b7f89] mt-0.5">
                Get updates about new episodes
              </p>
            </div>
            <span className="rounded-lg bg-[#f7f7f7] px-2.5 py-1 text-[11px] text-[#7b7f89]">
              Soon
            </span>
          </div>
        </div>

        {/* Coming soon */}
        <div className="rounded-xl border border-[#ececec] bg-white p-4">
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