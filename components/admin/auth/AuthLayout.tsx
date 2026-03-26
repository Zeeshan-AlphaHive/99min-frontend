"use client";

import React from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  bgImage: string;
  bgAlt?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  bgImage,
  bgAlt = "",
}) => {
  return (
    <div className="flex min-h-screen w-full">
      {/* ── Left Panel — exactly 50% ── */}
      <div className="relative w-1/2 min-h-screen overflow-hidden">
        <Image
          src={bgImage}
          alt={bgAlt}
          fill
          sizes="50vw"
          className="object-cover object-center"
          priority
        />
        {/* Dot-grid overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.55) 1.2px, transparent 1.2px)",
            backgroundSize: "22px 22px",
          }}
        />
        {/* Bottom fade */}
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-transparent to-black/20" />
      </div>

      {/* ── Right Panel — exactly 50% ── */}
      <div className="w-1/2 min-h-screen flex items-center justify-center bg-white px-8 py-12 lg:px-16">
        <div className="w-full max-w-[400px] animate-fadeSlide">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeSlide {
          animation: fadeSlide 0.35s ease forwards;
        }
      `}</style>
    </div>
  );
};