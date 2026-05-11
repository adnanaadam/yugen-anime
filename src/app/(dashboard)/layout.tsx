"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Library", href: "/library" },
  { label: "Profile", href: "/profile" },
  { label: "Settings", href: "/settings" },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 flex-col border-r">
        <div className="flex items-center gap-3 border-b p-4">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name ?? "Avatar"}
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium dark:bg-zinc-800">
              {session?.user?.name?.charAt(0) ?? "?"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {session?.user?.name ?? "User"}
            </p>
            <p className="truncate text-xs text-zinc-500">
              {session?.user?.email ?? ""}
            </p>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t p-4">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full rounded-md px-3 py-2 text-left text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}