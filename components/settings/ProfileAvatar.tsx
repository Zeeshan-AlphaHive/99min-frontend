"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Camera, X} from "lucide-react";
import { useI18n } from "@/contexts/i18n-context";

interface ProfileAvatarProps {
  initial: string;
  imageUrl?: string;
  onImageChange?: (file: File) => void;
  uploading?: boolean;
  onImageDelete?: () => void; 
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  initial,
  imageUrl,
  onImageChange,
  onImageDelete,
  uploading,
}) => {
  const { tr } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageChange) onImageChange(file);
    e.target.value = ""; // reset so same file can be re-selected
  };

  return (
    <div className="flex justify-center mb-8">
      <div className="relative">
        <div className="w-24 h-24 bg-orange rounded-full flex items-center justify-center overflow-hidden relative">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={tr("Profile avatar")}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-4xl font-bold">
              {initial.toUpperCase()}
            </span>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Camera button — always visible */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 w-10 h-10 bg-orange rounded-full flex items-center justify-center border-4 border-white shadow-sm hover:bg-orangeHover transition-colors"
          aria-label={tr("Change profile picture")}
        >
          <Camera className="w-5 h-5 text-white" />
        </button>

        {/* Remove button — only when image exists */}
        {imageUrl && onImageDelete && (
          <button
            type="button"
            onClick={onImageDelete}
            className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-red-600 transition-colors"
            aria-label={tr("Remove profile picture")}
          >
            <X className="w-3 h-3 text-white" />
          </button>
        )}


        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ProfileAvatar;