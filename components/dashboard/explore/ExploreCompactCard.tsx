"use client";

import React from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { isVideoUrl } from "./explore-utils";

interface ExploreCompactCardProps {
  image: string;
  title: string;
  price: string;
  onClick?: () => void;
}

const ExploreCompactCard: React.FC<ExploreCompactCardProps> = ({
  image,
  title,
  price,
  onClick,
}) => {
  const isVideo = isVideoUrl(image);

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-shrink-0 w-[140px] text-left group cursor-pointer"
    >
      <div className="relative w-[140px] h-[140px] rounded-xl overflow-hidden bg-gray-100 mb-2">
        {isVideo ? (
          <>
            <video
              src={image}
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
            <div className="absolute bottom-1.5 left-1.5 bg-black/50 rounded-full p-1">
              <Play className="w-3 h-3 text-white fill-white" />
            </div>
          </>
        ) : (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            unoptimized
          />
        )}
      </div>
      <p className="text-sm font-semibold text-textBlack line-clamp-2 leading-snug mb-0.5">
        {title}
      </p>
      <p className="text-sm font-bold text-green">
        ${price}
      </p>
    </button>
  );
};

export default ExploreCompactCard;
