"use client";

import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { motion } from "framer-motion";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-charcoal-950">
      <DashboardSidebar />
      <main className="ml-[220px] flex-1 p-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}