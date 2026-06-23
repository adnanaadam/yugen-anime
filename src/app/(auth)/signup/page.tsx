"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
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

  return (
    <div className="relative w-full flex items-center justify-center px-4">
      {/* Background Image */}
      <div className="absolute h-[400px] w-[250px] -bottom-64 right-0">
        <Image
          src="/images/denji.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div
        className="relative w-full max-w-md z-10"
      >
        <div className="rounded-2xl bg-[#f96e46] p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="mt-2 text-sm text-white/90">
              Sign up to start your anime journey
            </p>
          </div>

          {/* Sign Up Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="flex items-center cursor-pointer justify-center gap-3 w-full rounded-xl bg-gray-700 px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-gray-800 hover:border-gray-600"
            >
              <GoogleIcon className="size-6" />
              Sign up with Google
            </button>

            <button
              onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
              className="flex items-center cursor-pointer justify-center gap-3 w-full rounded-xl bg-gray-700 px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-gray-800 hover:border-gray-600"
            >
              <DiscordIcon className="size-6" />
              Sign up with Discord
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-gray-700 px-2 text-gray-500"></span>
            </div>
          </div>

          {/* Demo Info */}
          <div className="text-center">
            {/* Sign In Link */}
            <p className="mt-6 text-center text-sm text-white">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-white/90 hover:text-white transition-colors underline"
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
            className="text-gray-500 underline hover:text-gray-400 transition-colors"
          >
            Terms
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="text-gray-500 underline hover:text-gray-400 transition-colors"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
