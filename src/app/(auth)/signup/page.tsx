"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { lordJuusai } from "@/fonts/fonts";

// Import game-icons.net SVGs
import SwordIcon from "@/assets/icons/sword.svg";
import ScrollIcon from "@/assets/icons/scroll.svg";
import GoogleIcon from "@/assets/icons/google.svg";
import DiscordIcon from "@/assets/icons/discord.svg";

export default function SignUpPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (session) {
    return null;
  }

  const cardColors = ["#d8d5cc", "#e5b23c", "#ff5b47"];

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4">
      {/* Background Image */}
      <div className="absolute h-[400px] w-[250px] -bottom-24 right-0">
        <Image
          src="/images/denji.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: `${cardColors[1]}10` }}
        />
        <div
          className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full blur-3xl"
          style={{ backgroundColor: `${cardColors[2]}10` }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md z-10"
      >
        <div className="rounded-2xl bg-[#0A0A0A] border border-gray-800 p-8 shadow-xl backdrop-blur-sm bg-opacity-95">
          {/* Logo */}
          {/* <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#e5b23c] to-[#ff5b47]">
                <ScrollIcon className="h-6 w-6 text-black" />
              </div>
              <h1 className={`text-2xl font-bold tracking-wide ${lordJuusai.className} text-white`}>
                Yugen
              </h1>
            </div>
          </div> */}

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="mt-2 text-sm text-gray-400">
              Sign up to start your anime journey
            </p>
          </div>

          {/* Sign Up Buttons */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="flex items-center justify-center gap-3 w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-gray-800 hover:border-gray-600"
            >
              <GoogleIcon className="size-6" />
              Sign up with Google
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
              className="flex items-center justify-center gap-3 w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-gray-800 hover:border-gray-600"
            >
              <DiscordIcon className="size-6" />
              Sign up with Discord
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#0A0A0A] px-2 text-gray-500"></span>
            </div>
          </div>

          {/* Demo Info */}
          <div className="text-center">
            {/* Sign In Link */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-[#e5b23c] hover:text-[#ff5b47] transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-gray-600">
          By continuing, you agree to our{" "}
          <a
            href="/terms"
            className="text-gray-500 hover:text-gray-400 transition-colors"
          >
            Terms
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="text-gray-500 hover:text-gray-400 transition-colors"
          >
            Privacy Policy
          </a>
        </p>
      </motion.div>
    </div>
  );
}
