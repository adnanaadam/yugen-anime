// src/components/profile/AvatarUpload.tsx
"use client";

import { useState } from "react";
import { CldImage } from "next-cloudinary";
import { Camera, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";

interface AvatarUploadProps {
  currentImage?: string | null;
  userName?: string | null;
}

export default function AvatarUpload({ currentImage, userName }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

      if (!response.ok) throw new Error("Upload failed");

      window.location.reload();
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleDelete = async () => {
    setUploading(true);
    try {
      await fetch("/api/user/avatar", { method: "DELETE" });
      setPreview(null);
      window.location.reload();
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setUploading(false);
    }
  };

  const isCloudinaryImage = currentImage?.includes("cloudinary");
  const publicId = isCloudinaryImage
    ? `yugen-avatars/${currentImage!.split("/").pop()?.split(".")[0]}`
    : undefined;

  return (
    <div className="relative group">
      <div className="relative h-24 w-24 rounded-full overflow-hidden bg-[#f7f7f7]">
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
        ) : isCloudinaryImage && publicId ? (
          <CldImage
            src={publicId}
            alt={userName || "Avatar"}
            fill
            className="object-cover"
            crop="fill"
            gravity="face"
          />
        ) : currentImage ? (
          <Image
            src={currentImage}
            alt={userName || "Avatar"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-3xl font-bold text-[#7b7f89]">
              {userName?.charAt(0)?.toUpperCase() || "?"}
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
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {currentImage && (
        <button
          onClick={handleDelete}
          className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#f96e46] text-white shadow-sm hover:bg-[#e55d3a] transition-colors"
        >
          <Trash2 size={12} />
        </button>
      )}
    </div>
  );
}