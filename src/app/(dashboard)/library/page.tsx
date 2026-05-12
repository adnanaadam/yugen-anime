"use client";

import { useState } from "react";

const tabs = ["Watching", "Completed", "Plan to Watch", "Paused", "Dropped"];

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div>
      <h1 className="text-2xl font-bold">My Library</h1>
      <p className="mt-1 text-sm text-zinc-500">
        All your tracked anime in one place.
      </p>

      <div className="mt-6 border-b">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-zinc-900 text-zinc-900 dark:border-zinc-50 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-lg border p-8 text-center">
        <p className="text-zinc-500 dark:text-zinc-400">
          No anime in this list yet.{" "}
          <a href="/explore" className="underline">
            Explore anime
          </a>{" "}
          to get started.
        </p>
      </div>
    </div>
  );
}