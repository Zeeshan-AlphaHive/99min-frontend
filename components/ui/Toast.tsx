"use client";

import React, { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "error" | "success" | "warning";
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "error",
  duration = 5000,
  onClose,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slide in
    const showTimer = setTimeout(() => setVisible(true), 10);

    // Auto-dismiss
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // wait for slide-out animation
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const styles = {
    error:   { bg: "bg-red-50",     border: "border-red-400",   icon: "❌", text: "text-red-800"   },
    success: { bg: "bg-green-50",   border: "border-green-400", icon: "✅", text: "text-green-800" },
    warning: { bg: "bg-yellow-50",  border: "border-yellow-400",icon: "⚠️", text: "text-yellow-800"},
  }[type];

  return (
    <div
      className={`
        fixed top-5 right-5 z-50 flex items-start gap-3 max-w-sm w-full
        px-4 py-3 rounded-xl border shadow-lg
        ${styles.bg} ${styles.border} ${styles.text}
        transition-all duration-300 ease-in-out
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}
      `}
    >
      <span className="text-lg mt-0.5">{styles.icon}</span>
      <p className="flex-1 text-sm font-medium leading-snug">{message}</p>
      <button
        onClick={handleClose}
        className="ml-auto text-lg leading-none opacity-50 hover:opacity-100 transition-opacity"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
};