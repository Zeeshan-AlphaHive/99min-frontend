"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import { Globe, ChevronUp, Loader2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

const languages = [
  { code: "sq", name: "Albanian" }, { code: "ast", name: "Asturian" }, { code: "be", name: "Belarusian" },
  { code: "bs", name: "Bosnian" }, { code: "bg", name: "Bulgarian" }, { code: "ca", name: "Catalan" },
  { code: "hr", name: "Croatian" }, { code: "cs", name: "Czech" }, { code: "da", name: "Danish" },
  { code: "nl", name: "Dutch" }, { code: "en", name: "English" }, { code: "et", name: "Estonian" },
  { code: "fo", name: "Faroese" }, { code: "fi", name: "Finnish" }, { code: "fr", name: "French" },
  { code: "gl", name: "Galician" }, { code: "de", name: "German" }, { code: "el", name: "Greek" },
  { code: "hu", name: "Hungarian" }, { code: "is", name: "Icelandic" }, { code: "ga", name: "Irish" },
  { code: "it", name: "Italian" }, { code: "la", name: "Latin" }, { code: "lv", name: "Latvian" },
  { code: "lt", name: "Lithuanian" }, { code: "lb", name: "Luxembourgish" }, { code: "mk", name: "Macedonian" },
  { code: "mt", name: "Maltese" }, { code: "no", name: "Norwegian" }, { code: "pl", name: "Polish" },
  { code: "pt", name: "Portuguese" }, { code: "ro", name: "Romanian" }, { code: "rm", name: "Romansh" },
  { code: "ru", name: "Russian" }, { code: "sr", name: "Serbian" }, { code: "sk", name: "Slovak" },
  { code: "sl", name: "Slovenian" }, { code: "es", name: "Spanish" }, { code: "sv", name: "Swedish" },
  { code: "uk", name: "Ukrainian" }, { code: "cy", name: "Welsh" },
];

interface LanguageDropdownProps { compact?: boolean; }

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ compact = false }) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false); };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleLanguageSelect = (code: string) => {
    setIsOpen(false);
    if (code === currentLocale) return;
    startTransition(() => {
      const segments = pathname.split("/").filter(Boolean);
      const hasLocale = languages.some((l) => l.code === segments[0]);
      const pathWithoutLocale = hasLocale ? "/" + segments.slice(1).join("/") : pathname;
      const newPath = code === "en" ? pathWithoutLocale || "/" : `/${code}${pathWithoutLocale}`;
      router.replace(newPath);
    });
  };

  const selectedLang = languages.find((l) => l.code === currentLocale) ?? languages.find((l) => l.code === "en")!;

  return (
    <div className={`relative ${compact ? "w-auto inline-block" : "w-full md:inline-block md:w-auto"}`} ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className={compact
        ? "p-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 bg-transparent"
        : "w-full flex items-center gap-2 bg-lightGrey border border-orange/30 rounded-lg px-3 py-2 hover:opacity-90 transition-opacity"}>
        {isPending ? <Loader2 className="w-5 h-5 text-orange animate-spin shrink-0" /> : <Globe className="w-5 h-5 text-orange shrink-0" />}
        {!compact && <span className="text-textBlack font-bold text-sm flex-1 text-left">{selectedLang.name}</span>}
        <ChevronUp className={`w-4 h-4 text-textGray transition-transform shrink-0 ${isOpen ? "" : "rotate-180"}`} />
      </button>
      {isOpen && (
        <div className={`absolute ${compact ? "top-full right-0 mt-2 w-auto" : "max-md:-bottom-20 md:top-full left-0 w-full md:right-0 md:left-auto md:w-auto md:min-w-[220px] mt-2"} bg-white rounded-xl shadow-2xl p-4 z-50 border border-gray-100`}>
          <div className="text-textGray text-xs font-medium uppercase tracking-wide mb-3">{t("common.selectLanguage")}</div>
          <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
            {languages.map((language) => {
              const isSelected = language.code === currentLocale;
              return (
                <button key={language.code} onClick={() => handleLanguageSelect(language.code)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between ${isSelected ? "bg-iconBg text-orange" : "text-textBlack hover:bg-gray-50"}`}>
                  <span className="font-medium text-sm">{language.name}</span>
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