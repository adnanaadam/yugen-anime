"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <main className="flex flex-col flex-1 items-center justify-center">
      <div>
        {session ? (
          <>
            <p>Welcome {session.user?.name}</p>
            <button onClick={() => signOut()}>Logout</button>
          </>
        ) : (
          <button onClick={() => signIn("google")}>Login</button>
        )}
      </div>
    </main>
  );
}
