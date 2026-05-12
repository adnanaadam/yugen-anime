"use client";

import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div>
      <h1 className="text-2xl font-bold">Profile</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Your public profile and stats.
      </p>

      <div className="mt-8 rounded-lg border p-6">
        <div className="flex items-center gap-4">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt=""
              className="h-16 w-16 rounded-full"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-200 text-2xl font-medium dark:bg-zinc-800">
              {session?.user?.name?.charAt(0) ?? "?"}
            </div>
          )}
          <div>
            <p className="text-lg font-semibold">
              {session?.user?.name ?? "User"}
            </p>
            <p className="text-sm text-zinc-500">
              {session?.user?.email ?? ""}
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              Level 1 &middot; 0 XP
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg border p-8 text-center">
        <p className="text-sm text-zinc-500">
          Profile settings and activity feed coming soon.
        </p>
      </div>
    </div>
  );
}