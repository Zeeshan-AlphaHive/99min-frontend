"use client";

import React, { useCallback, useRef } from "react";
import PageHeader from "@/components/shared/PageHeader";
import SettingsSection from "./SettingsSection";
import LocationToggleCard from "./LocationToggleCard";
import LocationCard from "./LocationCard";
import RangeSlider from "./RangeSlider";
import QuickSelectButtons from "./QuickSelectButtons";
import { Navigation, MapPin } from "lucide-react";
import { useLocationSettings } from "@/hooks/UseLocationSetting";
import { useI18n } from "@/contexts/i18n-context";

interface LocationPageProps {
  onBack?: () => void;
}

const LocationPage: React.FC<LocationPageProps> = ({ onBack }) => {
  const { tr } = useI18n();
  const { settings, loading, error, handleUpdate } = useLocationSettings();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const quickSelectOptions = [5, 10, 25, 50];

  const handleRadiusChange = useCallback(
    (val: number) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        handleUpdate({ defaultRadius: val });
      }, 400);
    },
    [handleUpdate]
  );

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <PageHeader title="Location" onBack={onBack} maxWidth="7xl" />
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <PageHeader title="Location" onBack={onBack} maxWidth="7xl" />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{tr(error)}</div>
        )}

        <div>
          <LocationToggleCard
            icon={<Navigation className="w-5 h-5" />}
            title="Auto-detect Location"
            description="Use your current location"
            enabled={settings?.autoDetect ?? false}
            onChange={(val) => handleUpdate({ autoDetect: val })}
          />
        </div>

        <SettingsSection title="CURRENT LOCATION">
          <div className="px-4 py-4">
            <LocationCard
              icon={<MapPin className="w-5 h-5" />}
              location="New York, NY"
              coordinates="40.7128° N, 74.0060° W"
            />
          </div>
        </SettingsSection>

        <SettingsSection title="SEARCH RADIUS">
          <div className="px-4 bg-inputBg py-4">
            <RangeSlider
              min={1}
              max={50}
              value={settings?.defaultRadius ?? 10}
              onChange={handleRadiusChange}
              label="Distance"
              minLabel="1 mi"
              maxLabel="50 mi"
              unit="miles"
            />
          </div>
        </SettingsSection>

        <SettingsSection title="QUICK SELECT">
          <div className="px-4 py-4">
            <QuickSelectButtons
              options={quickSelectOptions}
              selected={settings?.defaultRadius ?? 10}
              onChange={(val) => handleUpdate({ defaultRadius: val })}
              unit="mi"
            />
          </div>
        </SettingsSection>
      </div>
    </div>
  );
};

export default LocationPage;