// src/app/(auth)/onboarding/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Camera, Check, AlertCircle } from "lucide-react";
import { Navii } from "@usenavii/react";
import { lordJuusai } from "@/fonts/fonts";

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState("");
  const [step, setStep] = useState<"username" | "avatar">("username");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if already onboarded
  useEffect(() => {
    if (session && !session.user.needsOnboarding) {
      router.push("/profile");
    }
  }, [session, router]);

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = username.trim().toLowerCase();

    if (trimmed.length < 3 || trimmed.length > 20) {
      setUsernameError("Username must be between 3 and 20 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setUsernameError("Only letters, numbers, and underscores");
      return;
    }

    setSaving(true);
    setUsernameError("");

    try {
      const response = await fetch("/api/user/username", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmed }),
      });

      const data = await response.json();

      if (!response.ok) {
        setUsernameError(data.error || "Failed to set username");
        return;
      }

      // Update session with new username
      await update({ user: { ...session?.user, username: data.username } });
      setStep("avatar");
    } catch {
      setUsernameError("Something went wrong. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError("");

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Upload failed");
      }

      const data = await response.json();
      await update({ user: { ...session?.user, image: data.url } });
    } catch (error) {
      console.error("Upload error:", error);
      setAvatarError(error instanceof Error ? error.message : "Upload failed");
      setPreview(null);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleComplete = async () => {
    // Force session refresh to clear needsOnboarding
    await update();
    router.push("/profile");
  };

  const handleSkipAvatar = () => {
    handleComplete();
  };

  // Still needs onboarding — render loading while redirecting
  if (session && !session.user.needsOnboarding) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fffdf8] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl text-[#545863] ${lordJuusai.className}`}>
            Yugen
          </h1>
          <p className="mt-2 text-sm text-[#7b7f89]">
            Set up your profile to get started
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className={`h-2 w-8 rounded-full transition-colors ${
              step === "username" ? "bg-[#f9c846]" : "bg-[#f9c846]/30"
            }`}
          />
          <div
            className={`h-2 w-8 rounded-full transition-colors ${
              step === "avatar" ? "bg-[#f9c846]" : "bg-[#f9c846]/30"
            }`}
          />
        </div>

        {/* Step 1: Username */}
        {step === "username" && (
          <div className="rounded-2xl border border-[#ececec] bg-white p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f9c846]/10">
                <span className="text-2xl">✏️</span>
              </div>
              <h2 className="text-xl font-bold text-[#545863]">
                Choose a Username
              </h2>
              <p className="mt-1 text-sm text-[#7b7f89]">
                This will be your unique identity on Yugen
              </p>
            </div>

            <form onSubmit={handleUsernameSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setUsernameError("");
                  }}
                  placeholder="Enter your username"
                  className="h-12 w-full rounded-xl border border-[#ececec] bg-[#fffdf8] px-4 text-sm text-[#545863] outline-none focus:border-[#f9c846]/50 transition-colors"
                  maxLength={20}
                  autoFocus
                />
                {usernameError && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <AlertCircle size={11} className="text-[#f96e46] shrink-0" />
                    <p className="text-[11px] text-[#f96e46]">{usernameError}</p>
                  </div>
                )}
                <p className="mt-1.5 text-[11px] text-[#7b7f89]">
                  3-20 characters · Letters, numbers, and underscores
                </p>
              </div>

              <button
                type="submit"
                disabled={saving || !username.trim()}
                className="flex h-12 w-full items-center cursor-pointer justify-center gap-2 rounded-xl bg-[#f9c846] text-sm font-semibold text-[#545863] hover:bg-[#f5bd29] transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Continue
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Avatar */}
        {step === "avatar" && (
          <div className="rounded-2xl border border-[#ececec] bg-white p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 flex items-center justify-center">
                {preview ? (
                  <div className="relative h-20 w-20 rounded-full overflow-hidden">
                    <Image
                      src={preview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <Navii
                    seed={session?.user?.email ?? ""}
                    size={80}
                    title={username || session?.user?.name || ""}
                    animated
                  />
                )}
              </div>
              <h2 className="text-xl font-bold text-[#545863]">
                Add a Profile Picture
              </h2>
              <p className="mt-1 text-sm text-[#7b7f89]">
                Optional — you can always change it later
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex h-12 w-full items-center cursor-pointer justify-center gap-2 rounded-xl border-2 border-dashed border-[#ececec] bg-[#fffdf8] text-sm font-medium text-[#545863] hover:border-[#f9c846]/50 hover:bg-[#f9c846]/5 transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Camera size={16} />
                    {preview ? "Change Photo" : "Upload Photo"}
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={uploading}
              />

              {avatarError && (
                <div className="flex items-center gap-1">
                  <AlertCircle size={11} className="text-[#f96e46] shrink-0" />
                  <p className="text-[11px] text-[#f96e46]">{avatarError}</p>
                </div>
              )}

              <div className="pt-2 space-y-2">
                <button
                  onClick={handleComplete}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#f9c846] text-sm font-semibold text-[#545863] hover:bg-[#f5bd29] transition-colors"
                >
                  <Check size={16} />
                  Complete Setup
                </button>

                <button
                  onClick={handleSkipAvatar}
                  className="flex h-10 w-full items-center justify-center text-sm text-[#7b7f89] hover:text-[#545863] transition-colors"
                >
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}