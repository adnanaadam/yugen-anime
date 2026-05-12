"use client";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Manage your account preferences.
      </p>

      <div className="mt-8 space-y-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Public Profile</p>
              <p className="text-sm text-zinc-500">
                Allow others to see your anime list
              </p>
            </div>
            <div className="h-6 w-11 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-zinc-500">
                Get updates about new episodes
              </p>
            </div>
            <div className="h-6 w-11 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">AniList Sync</p>
              <p className="text-sm text-zinc-500">
                Import and sync with your AniList account
              </p>
            </div>
            <span className="text-xs text-zinc-400">Coming soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}