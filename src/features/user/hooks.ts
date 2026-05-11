"use client";

import { useState, useEffect } from "react";
import type { User, UserProfile } from "./types";
import { fetchCurrentUser, fetchUserProfile } from "./api";

export function useCurrentUser() {
  const [state, setState] = useState<{
    user: User | null;
    loading: boolean;
  }>({ user: null, loading: true });

  useEffect(() => {
    fetchCurrentUser()
      .then((user) => {
        setState({ user, loading: false });
      })
      .catch(() => {
        setState({ user: null, loading: false });
      });
  }, []);

  return state;
}

export function useUserProfile(username: string) {
  const [state, setState] = useState<{
    profile: UserProfile | null;
    loading: boolean;
    error: Error | null;
  }>({ profile: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;

    fetchUserProfile(username)
      .then((profile) => {
        if (!cancelled) {
          setState({ profile, loading: false, error: null });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState({ profile: null, loading: false, error: err });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  return state;
}