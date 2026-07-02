// src/app/@[username]/page.tsx
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AtUsernameRedirect() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  useEffect(() => {
    if (username) {
      router.replace(`/u/${username}`);
    }
  }, [username, router]);

  return null;
}