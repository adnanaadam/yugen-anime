"use client";

import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  const stats = [
    { label: "Watching", value: "—", color: "border-l-blue-500" },
    { label: "Completed", value: "—", color: "border-l-green-500" },
    { label: "Plan to Watch", value: "—", color: "border-l-amber-500" },
    { label: "Total Episodes", value: "—", color: "border-l-purple-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">
        Welcome back, {session?.user?.name?.split(" ")[0] ?? "Anime Fan"}
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Here is your anime overview.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-lg border border-l-4 ${stat.color} p-4`}
          >
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-zinc-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg border p-8 text-center">
        <p className="text-zinc-500 dark:text-zinc-400">
          Start tracking anime to see your stats here.
        </p>
      </div>
    </div>
  );
}