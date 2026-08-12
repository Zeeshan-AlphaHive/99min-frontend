"use client";

import React from "react";
import Image from "next/image";
import { Heart, Play } from "lucide-react";
import { isVideoUrl } from "./explore-utils";

interface ExploreRecommendedCardProps {
  image: string;
  title: string;
  price: string;
  interest: number;
  urgent?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
}

const ExploreRecommendedCard: React.FC<ExploreRecommendedCardProps> = ({
  image,
  title,
  price,
  interest,
  urgent,
  fullWidth = false,
  onClick,
}) => {
  const isVideo = isVideoUrl(image);
  const widthClass = fullWidth ? "w-full" : "flex-shrink-0 w-[220px]";
  const imageHeight = fullWidth ? "h-[140px]" : "h-[160px]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${widthClass} text-left group cursor-pointer`}
    >
      <div className={`relative w-full ${imageHeight} rounded-xl overflow-hidden bg-gray-100 mb-2`}>
        {isVideo ? (
          <>
            <video
              src={image}
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
            <div className="absolute bottom-2 left-2 bg-black/50 rounded-full px-2 py-0.5 flex items-center gap-1">
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

        {interest > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm">
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span className="text-xs font-bold text-textBlack">{interest}</span>
          </div>
        )}

        {urgent && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
            Urgent
          </div>
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

export default ExploreRecommendedCard;
