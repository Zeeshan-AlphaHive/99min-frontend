"use client";

import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { useI18n } from "@/contexts/i18n-context";
import { fetchPublicSettings } from "@/utils/api/settings.api";

const ExplorePromoBanner: React.FC = () => {
  const { tr } = useI18n();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchPublicSettings();
        if (cancelled) return;
        const task = res.data.pinnedExampleTask;
        setTitle(task?.title ?? "");
        setDescription(task?.description ?? "");
        setLocation(task?.location ?? "");
        setBudget(task?.budget ?? 0);
      } catch {
        // use defaults below
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayTitle = title || "Post a task in 99 minutes";
  const displayDescription =
    description ||
    "Need help fast? Post your task and get responses before it expires.";
  const displayLocation = location || "Anywhere";
  const displayBudget = budget > 0 ? `$${budget}` : "$25–50";

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primarydark via-gray-800 to-orange/80 text-white min-h-[180px]">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_80%_20%,white,transparent_50%)]" />
      <div className="relative z-10 p-5 flex flex-col justify-between h-full min-h-[180px]">
        <div>
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded-full mb-2">
            {tr("Featured")}
          </span>
          <h2 className="text-xl font-black leading-tight mb-1">{tr(displayTitle)}</h2>
          <p className="text-sm text-white/80 line-clamp-2">{tr(displayDescription)}</p>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5 text-sm text-white/90">
            <MapPin className="w-4 h-4" />
            <span>{tr(displayLocation)}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-black">{displayBudget}</span>
            <span className="bg-white text-primarydark text-xs font-bold px-4 py-2 rounded-lg cursor-default">
              {tr("Learn more")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePromoBanner;
