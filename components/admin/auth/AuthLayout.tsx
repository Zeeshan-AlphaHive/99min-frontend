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
    <div className="flex min-h-screen w-full bg-white">
      {/* ── Left Panel ── */}
      <div className="relative hidden md:block w-[480px] shrink-0 overflow-hidden">
        {/* Background photo */}
        <img
          src={bgImage}
          alt={bgAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dot-grid overlay — matches reference */}
        <div
          className="absolute inset-0 z-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.6) 1.2px, transparent 1.2px)",
            backgroundSize: "22px 22px",
            backgroundPosition: "top right",
          }}
        />

        {/* Bottom gradient */}
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-transparent to-black/20" />
      </div>

      {/* ── Right Panel ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-[420px] animate-fadeSlide">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeSlide {
          animation: fadeSlide 0.35s ease forwards;
        }
      `}</style>
    </div>
  );
};