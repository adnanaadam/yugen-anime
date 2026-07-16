// src/hooks/useNotifications.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string | null;
  read: boolean;
  link: string | null;
  createdAt: string;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

export function useNotifications() {
  const [state, setState] = useState<NotificationsState>({
    notifications: [],
    unreadCount: 0,
    loading: true,
    error: null,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications?limit=10&includeRead=true", {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("[Notifications] fetch failed:", res.status, text);
        setState((prev) => ({ ...prev, loading: false, error: text || "Failed to load notifications" }));
        return;
      }
      const data = await res.json();
      setState({
        notifications: data.notifications || [],
        unreadCount: data.unreadCount || 0,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("[Notifications] fetch error:", error);
      setState((prev) => ({ ...prev, loading: false, error: "Network error" }));
    }
  }, []);

  // Initial fetch + poll every 30 seconds
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/notifications?limit=10&includeRead=true", {
          credentials: "include",
          cache: "no-store",
        });
        if (!res.ok || cancelled) {
          if (!cancelled) {
            setState((prev) => ({ ...prev, loading: false, error: "Unauthorized or server error" }));
          }
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          setState({
            notifications: data.notifications || [],
            unreadCount: data.unreadCount || 0,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!cancelled) {
          console.error("[Notifications] initial fetch error:", error);
          setState((prev) => ({ ...prev, loading: false, error: "Network error" }));
        }
      }
    };

    load();
    intervalRef.current = setInterval(load, 30000);
    return () => {
      cancelled = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id }),
      });
      setState((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, prev.unreadCount - 1),
      }));
    } catch (error) {
      console.error("[Notifications] markAsRead error:", error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ all: true }),
      });
      setState((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error("[Notifications] markAllAsRead error:", error);
    }
  }, []);

  return {
    ...state,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
}