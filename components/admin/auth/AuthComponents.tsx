"use client";

import React, { useState, useRef, useEffect } from "react";

// ─── Eye icons ────────────────────────────────────────────────────────────────
const EyeOpenIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosedIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// ─── AuthInput ────────────────────────────────────────────────────────────────
interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, hint, className = "", ...props }, ref) => {
    const [showPass, setShowPass] = useState(false);
    const isPassword = props.type === "password";
    const inputType = isPassword && showPass ? "text" : props.type;

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            {...props}
            type={inputType}
            className={`
              w-full px-3.5 py-[11px] text-sm text-gray-900 bg-white
              border border-gray-200 rounded-lg
              placeholder:text-gray-400
              focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100
              transition-all duration-200
              ${isPassword ? "pr-11" : ""}
              ${error ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}
              ${className}
            `}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </button>
          )}
        </div>
        {hint && !error && (
          <p className="mt-1 text-xs text-gray-400">{hint}</p>
        )}
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);
AuthInput.displayName = "AuthInput";

// ─── PrimaryButton ────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  loading,
  children,
  className = "",
  disabled,
  ...props
}) => (
  <button
    {...props}
    disabled={disabled || loading}
    className={`
      w-full py-3 px-5 rounded-lg text-sm font-semibold text-white
      bg-orange-500 hover:bg-orange-600 active:scale-[0.98]
      disabled:opacity-60 disabled:cursor-not-allowed
      transition-all duration-200 shadow-sm
      ${className}
    `}
  >
    {loading ? (
      <span className="flex items-center justify-center gap-2">
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        {children}
      </span>
    ) : (
      children
    )}
  </button>
);

// ─── OutlineButton ────────────────────────────────────────────────────────────
export const OutlineButton: React.FC<ButtonProps> = ({
  children,
  className = "",
  ...props
}) => (
  <button
    {...props}
    className={`
      w-full py-3 px-5 rounded-lg text-sm font-semibold text-gray-700
      bg-white border border-gray-200 hover:bg-gray-50 active:scale-[0.98]
      transition-all duration-200
      ${className}
    `}
  >
    {children}
  </button>
);

// ─── OtpInput ─────────────────────────────────────────────────────────────────
interface OtpInputProps {
  value: string[];
  onChange: (v: string[]) => void;
  length?: number;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  length = 4,
}) => {
  // Single ref holding an array — never violates Rules of Hooks
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusAt = (i: number) => inputRefs.current[i]?.focus();

  const handleChange = (i: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[i] = digit;
    onChange(next);
    if (digit && i < length - 1) focusAt(i + 1);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      focusAt(i - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    const next = Array(length).fill("");
    text.split("").forEach((d, idx) => { next[idx] = d; });
    onChange(next);
    focusAt(Math.min(text.length, length - 1));
  };

  return (
    <div className="flex gap-3 justify-center" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={`
            w-14 h-14 text-center text-xl font-bold rounded-xl
            border-2 text-gray-900 bg-white
            focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100
            transition-all duration-200
            ${value[i] ? "border-orange-400 bg-orange-50" : "border-gray-200"}
          `}
        />
      ))}
    </div>
  );
};

// ─── Countdown ────────────────────────────────────────────────────────────────
interface CountdownProps {
  seconds: number;
  onExpire?: () => void;
}

export const Countdown: React.FC<CountdownProps> = ({ seconds, onExpire }) => {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    if (left <= 0) {
      onExpire?.();
      return;
    }
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left, onExpire]);

  const m = String(Math.floor(left / 60)).padStart(2, "0");
  const s = String(left % 60).padStart(2, "0");

  return (
    <p className="text-center text-sm text-gray-400 mt-3 mb-5">
      Resent code in:{" "}
      <span className="text-orange-500 font-semibold">
        {m}:{s}
      </span>
    </p>
  );
};