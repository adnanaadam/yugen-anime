// src/app/(dashboard)/settings/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Camera, Loader2, Check, Pencil, X, AlertCircle, Globe, Lock, Moon, Sun } from "lucide-react";
import { addGlobalToast } from "@/components/Toast";
import { useTheme } from "@/lib/theme";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const { theme, setTheme } = useTheme();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState("");

  // Username state
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [username, setUsername] = useState(session?.user?.username || "");
  const [usernameError, setUsernameError] = useState("");
  const [availability, setAvailability] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [savingUsername, setSavingUsername] = useState(false);

  // Profile visibility
  const [isProfilePublic, setIsProfilePublic] = useState(true);
  const [updatingVisibility, setUpdatingVisibility] = useState(false);

  // Avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error state
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
      setPreview(null);
    } catch (error) {
      console.error("Upload error:", error);
      setAvatarError(error instanceof Error ? error.message : "Upload failed");
      setPreview(null);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleAvatarDelete = async () => {
    setAvatarError("");
    setUploading(true);
    try {
      const response = await fetch("/api/user/avatar", { method: "DELETE" });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Delete failed");
      }

      await update({ user: { ...session?.user, image: null } });
      setPreview(null);
    } catch (error) {
      console.error("Delete error:", error);
      setAvatarError(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setUploading(false);
    }
  };

  // Helper: check if the image URL is a Cloudinary URL and extract public ID
  const isCloudinaryUrl = (url: string) => url.includes("cloudinary");
  const getCloudinaryPublicId = (url: string) => {
    if (!isCloudinaryUrl(url)) return null;
    const parts = url.split("/");
    const fileWithExt = parts.pop()?.split(".")[0];
    const folder = parts.pop();
    return folder ? `${folder}/${fileWithExt}` : fileWithExt;
  };

  // Real-time username availability check with debounce
  const checkTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const checkUsernameAvailability = (value: string) => {
    if (checkTimerRef.current) {
      clearTimeout(checkTimerRef.current);
    }

    checkTimerRef.current = setTimeout(async () => {
      const trimmed = value.trim().toLowerCase();

      if (trimmed.length < 3 || !/^[a-zA-Z0-9_]+$/.test(trimmed)) {
        setAvailability("idle");
        return;
      }

      try {
        const res = await fetch(`/api/user/username/check?username=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = await res.json();
          setAvailability(data.available ? "available" : "taken");
        } else {
          setAvailability("idle");
        }
      } catch {
        setAvailability("idle");
      }
    }, 400);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    setUsernameError("");

    // Only check if different from current username
    const trimmed = value.trim().toLowerCase();
    const current = session?.user?.username?.toLowerCase();
    if (trimmed === current) {
      setAvailability("idle");
      return;
    }

    if (trimmed.length >= 3 && /^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setAvailability("checking");
    } else {
      setAvailability("idle");
    }

    checkUsernameAvailability(value);
  };

  // Username save
  const handleUsernameSave = async () => {
    const trimmed = username.trim().toLowerCase();

    if (trimmed.length < 3 || trimmed.length > 20) {
      setUsernameError("Username must be between 3 and 20 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setUsernameError("Only letters, numbers, and underscores");
      return;
    }

    setSavingUsername(true);
    setUsernameError("");

    try {
      const response = await fetch("/api/user/username", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmed }),
      });

      const data = await response.json();

      if (!response.ok) {
        setUsernameError(data.error || "Failed to update username");
        return;
      }

      await update({ user: { ...session?.user, username: data.username } });
      setUsername(data.username);
      setIsEditingUsername(false);
    } catch (error) {
      setUsernameError("Something went wrong");
    } finally {
      setSavingUsername(false);
    }
  };

  const handleCancelUsername = () => {
    setUsername(session?.user?.username || "");
    setUsernameError("");
    setIsEditingUsername(false);
  };

  // Fetch current visibility setting
  useEffect(() => {
    const fetchVisibility = async () => {
      try {
        const response = await fetch("/api/user/stats");
        if (response.ok) {
          const data = await response.json();
          if (data.user?.isProfilePublic !== undefined) {
            setIsProfilePublic(data.user.isProfilePublic);
          }
        }
      } catch (error) {
        console.error("Error fetching profile visibility:", error);
      }
    };
    fetchVisibility();
  }, []);

  const handleToggleVisibility = async () => {
    setUpdatingVisibility(true);
    try {
      const response = await fetch("/api/user/profile-visibility", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isProfilePublic: !isProfilePublic }),
      });

      const data = await response.json();

      if (!response.ok) {
        addGlobalToast({
          type: "error",
          message: data.error || "Failed to update profile visibility",
        });
        return;
      }

      setIsProfilePublic(!isProfilePublic);
      addGlobalToast({
        type: "success",
        message: data.message,
      });
    } catch {
      addGlobalToast({
        type: "error",
        message: "Something went wrong. Try again.",
      });
    } finally {
      setUpdatingVisibility(false);
    }
  };

  const imageSrc = session?.user?.image;
  const cloudinaryPublicId = imageSrc ? getCloudinaryPublicId(imageSrc) : null;
  const displayImage = preview || imageSrc;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Manage your profile and preferences
        </p>
      </div>

      {/* Appearance Section */}
      <div className="rounded-2xl border border-border bg-surface shadow-sm">
        <div className="p-5 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Appearance</h2>
        </div>
        <div className="p-5">
          <p className="text-xs text-muted mb-3">
            Choose how OtakuProfile looks. Applies across the entire app.
          </p>
          <div className="grid grid-cols-2 gap-3 max-w-sm">
            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                theme === "dark"
                  ? "border-[#f9c846] bg-[#f9c846]/10"
                  : "border-border hover:bg-surface-hover"
              }`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1c1d21]">
                <Moon size={16} className="text-[#f9c846]" />
              </span>
              <span className="relative">
                <span className="block text-sm font-medium text-foreground">Dark</span>
                <span className="block text-[11px] text-muted">Default</span>
                {theme === "dark" && (
                  <Check size={12} className="absolute -top-0.5 -right-4 text-[#f9c846]" />
                )}
              </span>
            </button>
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                theme === "light"
                  ? "border-[#f9c846] bg-[#f9c846]/10"
                  : "border-border hover:bg-surface-hover"
              }`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-[#fffdf8]">
                <Sun size={16} className="text-[#f96e46]" />
              </span>
              <span className="relative">
                <span className="block text-sm font-medium text-foreground">Light</span>
                <span className="block text-[11px] text-muted">Classic</span>
                {theme === "light" && (
                  <Check size={12} className="absolute -top-0.5 -right-4 text-[#f9c846]" />
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="rounded-2xl border border-border bg-surface shadow-sm">
        <div className="p-5 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Profile</h2>
        </div>

        <div className="p-5 space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="relative h-20 w-20 rounded-full overflow-hidden bg-surface-hover">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={session?.user?.name || "Avatar"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-2xl font-bold text-muted">
                      {session?.user?.name?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                  </div>
                )}

                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  {uploading ? (
                    <Loader2 size={20} className="text-white animate-spin" />
                  ) : (
                    <Camera size={20} className="text-white" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              {displayImage && (
                <button
                  onClick={handleAvatarDelete}
                  disabled={uploading}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#f96e46] text-white shadow-sm hover:bg-[#e55d3a] transition-colors disabled:opacity-50"
                >
                  <X size={10} />
                </button>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-foreground">
                Profile Picture
              </p>
              <p className="text-xs text-muted mt-0.5">
                Click to upload · Max 2MB
              </p>
              {avatarError && (
                <div className="flex items-center gap-1 mt-1.5">
                  <AlertCircle size={11} className="text-[#f96e46] shrink-0" />
                  <p className="text-[11px] text-[#f96e46]">{avatarError}</p>
                </div>
              )}
            </div>
          </div>

          {/* Username */}
          <div className="pt-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Username</p>
                <p className="text-xs text-muted mt-0.5">
                  Your unique identifier on OtakuProfile
                </p>
              </div>

              {!isEditingUsername ? (
                <button
                  onClick={() => setIsEditingUsername(true)}
                  className="flex items-center gap-1.5 text-xs font-medium text-[#f96e46] hover:text-[#e55d3a] transition-colors"
                >
                  <Pencil size={12} />
                  Edit
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancelUsername}
                    className="text-xs text-muted hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUsernameSave}
                    disabled={savingUsername}
                    className="flex items-center gap-1 rounded-lg bg-[#f9c846] px-3 py-1.5 text-xs font-medium text-foreground hover:bg-[#f5bd29] transition-colors disabled:opacity-50"
                  >
                    {savingUsername ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Check size={12} />
                    )}
                    Save
                  </button>
                </div>
              )}
            </div>

            {isEditingUsername ? (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="Enter username"
                    className="h-9 w-48 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-[#f9c846]/50 transition-colors"
                    maxLength={20}
                    autoFocus
                  />
                </div>
                {usernameError && (
                  <p className="mt-1 text-[11px] text-[#f96e46]">
                    {usernameError}
                  </p>
                )}
                <p className="mt-1 text-[10px] text-muted">
                  3-20 characters · Letters, numbers, underscores
                </p>
              </div>
            ) : (
              <p className="mt-1 text-sm text-foreground font-medium">
                {session?.user?.username || "Not set"}
              </p>
            )}
          </div>

          {/* Email (read-only) */}
          <div className="pt-1">
            <p className="text-sm font-medium text-foreground">Email</p>
            <p className="mt-1 text-sm text-foreground">
              {session?.user?.email || "Not available"}
            </p>
            <p className="text-[10px] text-muted mt-0.5">
              Managed by your auth provider
            </p>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="rounded-2xl border border-border bg-surface shadow-sm">
        <div className="p-5 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Preferences</h2>
        </div>

        <div className="divide-y divide-[#ececec]">
          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Public Profile
              </p>
              <p className="text-xs text-muted mt-0.5">
                Allow others to see your anime activity
              </p>
            </div>
            <button
              onClick={handleToggleVisibility}
              disabled={updatingVisibility}
              className={`flex items-center gap-2 cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                isProfilePublic
                  ? "bg-[#97cc04]/10 text-[#97cc04] hover:bg-[#97cc04]/20"
                  : "bg-surface-hover text-muted hover:bg-[#ececec]"
              }`}
            >
             
              {updatingVisibility ? (
                <Loader2 size={12} className="animate-spin" />
              ) : isProfilePublic ? (
                <Globe size={12} />
              ) : (
                <Lock size={12} />
              )}
              {isProfilePublic ? "Public" : "Private"}
            </button>
          </div>

          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Email Notifications
              </p>
              <p className="text-xs text-muted mt-0.5">
                Get updates about new episodes
              </p>
            </div>
            <span className="rounded-lg bg-surface-hover px-2.5 py-1 text-[11px] text-muted">
              Soon
            </span>
          </div>

          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">AniList Sync</p>
              <p className="text-xs text-muted mt-0.5">
                Import and sync with your AniList account
              </p>
            </div>
            <span className="rounded-lg bg-surface-hover px-2.5 py-1 text-[11px] text-muted">
              Soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}