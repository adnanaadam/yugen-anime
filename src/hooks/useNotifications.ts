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
}

export function useNotifications() {
  const [state, setState] = useState<NotificationsState>({
    notifications: [],
    unreadCount: 0,
    loading: true,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications?limit=10&includeRead=true");
      if (!res.ok) return;
      const data = await res.json();
      setState({
        notifications: data.notifications || [],
        unreadCount: data.unreadCount || 0,
        loading: false,
      });
    } catch {
      // Silently fail
    }
  }, []);

  // Initial fetch + poll every 30 seconds
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/notifications?limit=10&includeRead=true");
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (!cancelled) {
          setState({
            notifications: data.notifications || [],
            unreadCount: data.unreadCount || 0,
            loading: false,
          });
        }
      } catch {
        // Silently fail
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
        body: JSON.stringify({ id }),
      });
      setState((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, prev.unreadCount - 1),
      }));
    } catch {
      // Silently fail
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      setState((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    } catch {
      // Silently fail
    }
  }, []);

  return {
    ...state,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
}