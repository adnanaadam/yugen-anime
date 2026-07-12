// src/app/admin/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Tab = "overview" | "notifications" | "users" | "feedback";

interface Stats {
  totalUsers: number;
  totalLists: number;
  totalFavorites: number;
  totalBadges: number;
  totalFeedback: number;
  totalNotifications: number;
  recentUsers: unknown[];
  recentFeedback: unknown[];
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<unknown[]>([]);
  const [feedbackItems, setFeedbackItems] = useState<unknown[]>([]);
  const [feedbackTotal, setFeedbackTotal] = useState(0);
  const [feedbackFilter, setFeedbackFilter] = useState("");
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [notifLink, setNotifLink] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL || "";

  const loadOverview = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) return;
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users?limit=50");
      if (!res.ok) return;
      const data = await res.json();
      setUsers(data.users);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const loadFeedback = useCallback(async () => {
    try {
      const url = feedbackFilter
        ? `/api/admin/feedback?category=${encodeURIComponent(feedbackFilter)}&limit=50`
        : "/api/admin/feedback?limit=50";
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      setFeedbackItems(data.items);
      setFeedbackTotal(data.total);
    } catch (e) {
      console.error(e);
    }
  }, [feedbackFilter]);

  const sendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim()) return;
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: notifTitle,
          message: notifMessage || undefined,
          link: notifLink || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setSendResult(`Sent to ${data.created} users`);
      setNotifTitle("");
      setNotifMessage("");
      setNotifLink("");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to send";
      setSendResult(message);
    } finally {
      setSending(false);
    }
  };

  // Auth guard + route redirect
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    } else if (status === "authenticated" && session?.user?.email !== adminEmail) {
      router.push("/");
    }
  }, [status, session?.user?.email, adminEmail, router]);

  // Load data after auth is confirmed
  useEffect(() => {
    if (status !== "authenticated") return;
    if (session?.user?.email !== adminEmail) return;
    const timer = setTimeout(() => {
      loadOverview();
      loadUsers();
      loadFeedback();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.user?.email, adminEmail]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "notifications", label: "Notifications" },
    { key: "users", label: "Users" },
    { key: "feedback", label: "Feedback" },
  ];

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
        <div className="text-white">Loading admin...</div>
      </div>
    );
  }

  if (session?.user?.email !== adminEmail) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
        <div className="text-red-400">Forbidden</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Admin</h1>
          <Link href="/" className="text-sm text-[#f9c846] hover:underline">
            Back to site
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.key
                  ? "bg-[#f9c846] text-black"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard label="Users" value={stats.totalUsers} />
              <StatCard label="Lists" value={stats.totalLists} />
              <StatCard label="Favorites" value={stats.totalFavorites} />
              <StatCard label="Badges" value={stats.totalBadges} />
              <StatCard label="Feedback" value={stats.totalFeedback} />
              <StatCard label="Notifications" value={stats.totalNotifications} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <section className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h2 className="text-sm font-semibold text-gray-300 mb-3">Recent Users</h2>
                <div className="space-y-2">
                  {stats.recentUsers.map((u) => {
                    const user = u as { id: string; username?: string | null; email?: string | null; level?: number };
                    return (
                      <div key={user.id} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-white">{user.username || "Anonymous"}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <div className="text-xs text-gray-400">Lvl {user.level ?? 0}</div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h2 className="text-sm font-semibold text-gray-300 mb-3">Recent Feedback</h2>
                <div className="space-y-2">
                  {stats.recentFeedback.map((f) => {
                    const feedback = f as { id: string; category?: string; createdAt?: string; message?: string };
                    return (
                      <div key={feedback.id} className="text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-white capitalize">{feedback.category}</span>
                          <span className="text-xs text-gray-500">{new Date(feedback.createdAt || "").toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{feedback.message}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* Notifications */}
        {tab === "notifications" && (
          <section className="rounded-xl border border-white/10 bg-white/5 p-4 max-w-xl">
            <h2 className="text-sm font-semibold text-gray-300 mb-3">Send System Notification</h2>
            <form onSubmit={sendNotification} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Title</label>
                <input
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                  placeholder="Notification title"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Message</label>
                <textarea
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white h-24"
                  placeholder="Optional message"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Link (optional)</label>
                <input
                  value={notifLink}
                  onChange={(e) => setNotifLink(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                  placeholder="https://..."
                />
              </div>
              <button
                type="submit"
                disabled={sending || !notifTitle.trim()}
                className="w-full py-2 rounded-lg bg-[#f9c846] text-sm font-semibold hover:bg-[#f5bd29] disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send Notification"}
              </button>
              {sendResult && <p className="text-xs text-gray-400 mt-2">{sendResult}</p>}
            </form>
          </section>
        )}

        {/* Users */}
        {tab === "users" && (
          <section className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-sm font-semibold text-gray-300 mb-3">Users ({users.length})</h2>
            <div className="space-y-2">
              {users.map((u) => {
                const user = u as { id: string; username?: string | null; email?: string | null; level?: number; _count?: { animeList?: number; favorites?: number } };
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-black/20 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm text-white">{user.username || "Anonymous"}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <div className="text-xs text-gray-400">
                      Lvl {user.level ?? 0} · {user._count?.animeList ?? 0} lists · {user._count?.favorites ?? 0} favs
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Feedback */}
        {tab === "feedback" && (
          <section className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-300">Feedback ({feedbackTotal})</h2>
              <select
                value={feedbackFilter}
                onChange={(e) => {
                  setFeedbackFilter(e.target.value);
                  loadFeedback();
                }}
                className="rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-xs text-white"
              >
                <option value="">All</option>
                <option value="bug">Bugs</option>
                <option value="feature">Features</option>
                <option value="general">General</option>
                <option value="ui">UI/UX</option>
                <option value="performance">Performance</option>
              </select>
            </div>
            <div className="space-y-2">
              {feedbackItems.map((f) => {
                const item = f as { id: string; category?: string; createdAt?: string; message?: string };
                return (
                  <div key={item.id} className="rounded-lg border border-white/5 bg-black/20 px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-300 capitalize">{item.category}</span>
                      <span className="text-[10px] text-gray-500">{new Date(item.createdAt || "").toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-white mt-1">{item.message}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  );
}