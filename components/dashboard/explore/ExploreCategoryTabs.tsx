"use client";

import React from "react";
import { useI18n } from "@/contexts/i18n-context";
import HorizontalScrollArea from "@/components/shared/HorizontalScrollArea";

export const EXPLORE_CATEGORIES = [
  { id: "", label: "For you", icon: "✨" },
  { id: "errands", label: "Errands", icon: "🏃" },
  { id: "tech", label: "Tech", icon: "💻" },
  { id: "design", label: "Design", icon: "🎨" },
  { id: "moving", label: "Moving", icon: "📦" },
  { id: "pet-care", label: "Pet Care", icon: "🐕" },
  { id: "translation", label: "Translation", icon: "🌍" },
] as const;

interface ExploreCategoryTabsProps {
  selected: string;
  onChange: (categoryId: string) => void;
}

const ExploreCategoryTabs: React.FC<ExploreCategoryTabsProps> = ({
  selected,
  onChange,
}) => {
  const { tr } = useI18n();

  return (
    <HorizontalScrollArea className="-mx-4 px-4" gapClassName="gap-4" showArrows={false}>
      {EXPLORE_CATEGORIES.map((cat) => {
          const isActive = selected === cat.id;
          return (
            <button
              key={cat.id || "for-you"}
              type="button"
              onClick={() => onChange(cat.id)}
              className="flex flex-col items-center gap-1.5 min-w-[64px] cursor-pointer"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-colors ${
                  isActive
                    ? "bg-orange/10 ring-2 ring-orange"
                    : "bg-white border border-gray-200"
                }`}
              >
                {cat.icon}
              </div>
              <span
                className={`text-xs font-semibold whitespace-nowrap ${
                  isActive ? "text-orange" : "text-textGray"
                }`}
              >
                {tr(cat.label)}
              </span>
              {isActive && (
                <span className="w-8 h-0.5 bg-orange rounded-full -mt-0.5" />
              )}
            </button>
          );
        })}
    </HorizontalScrollArea>
  );
};

export default ExploreCategoryTabs;
