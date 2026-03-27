"use client";

import React, { useRef, useEffect, useState } from "react";
import { Globe, ChevronUp } from "lucide-react";
import { useI18n } from "@/contexts/i18n-context";

/** BCP 47 codes, same order as the original language list. */
const LANGUAGE_CODES: readonly string[] = [
  "sq",
  "be",
  "bs",
  "bg",
  "ca",
  "hr",
  "cs",
  "da",
  "nl",
  "en",
  "et",
  "fo",
  "fi",
  "fr",
  "gl",
  "de",
  "el",
  "hu",
  "is",
  "ga",
  "it",
  "la",
  "lv",
  "lt",
  "lb",
  "mk",
  "mt",
  "no",
  "pl",
  "pt",
  "ro",
  "rm",
  "ru",
  "sr",
  "sk",
  "sl",
  "es",
  "sv",
  "uk",
  "cy",
];

interface LanguageDropdownProps {
  compact?: boolean;
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ compact = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { locale, setLocale, tr, languageLabel } = useI18n();

const selectedCode = LANGUAGE_CODES.includes(locale) ? locale : "de";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (code: string) => {
    setLocale(code);
    setIsOpen(false);
  };

  return (
    <div
      className={`relative ${compact ? "w-auto inline-block" : "w-full md:inline-block md:w-auto"}`}
      ref={dropdownRef}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={
          compact
            ? "p-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 bg-transparent"
            : "w-full flex items-center gap-2 bg-lightGrey border border-orange/30 rounded-lg px-3 py-2 hover:opacity-90 transition-opacity"
        }
      >
        <Globe className={`w-5 h-5 text-orange shrink-0 ${compact ? "" : ""}`} />
        {!compact && (
          <span className="text-textBlack font-bold text-sm flex-1 text-left">
            {languageLabel(selectedCode)}
          </span>
        )}
        <ChevronUp
          className={`w-4 h-4 text-textGray transition-transform shrink-0 ${isOpen ? "" : "rotate-180"}`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute ${compact ? "top-full right-0 mt-2 w-auto" : "max-md:-bottom-20 md:top-full left-0 w-full md:right-0 md:left-auto md:w-auto md:min-w-[220px] mt-2"} bg-white rounded-xl shadow-2xl p-4 z-50 border border-gray-100`}
        >
          <div className="text-textGray text-xs font-medium uppercase tracking-wide mb-3">
            {tr("SELECT LANGUAGE")}
          </div>

          <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
            {LANGUAGE_CODES.map((code) => {
              const isSelected = code === selectedCode;
              return (
                <button
                  key={code}
                  onClick={() => handleLanguageSelect(code)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between
                    ${
                      isSelected
                        ? "bg-iconBg text-orange"
                        : "text-textBlack hover:bg-gray-50"
                    }`}
                >
                  <span className="font-medium text-sm">{languageLabel(code)}</span>
                  {isSelected && <div className="w-2 h-2 bg-orange rounded-full shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
