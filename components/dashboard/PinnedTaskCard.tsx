import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, Clock, Share2, Tag } from 'lucide-react';
import Image from 'next/image';
import watermark from '@/public/assets/images/watermark.svg';
import { useI18n } from '@/contexts/i18n-context';
import { fetchPublicSettings } from '@/utils/api/settings.api';
interface PinnedTaskCardProps {
  title?: string;
  description?: string;
  price?: string;
  tags?: string[];
  location?: string;
  timeLeft?: string;
  onClick?: () => void;
}

const PinnedTaskCard: React.FC<PinnedTaskCardProps> = ({
  title,
  description,
  price,
  tags,
  location,
  timeLeft = "99m",
  onClick,
}) => {
  const { tr } = useI18n();
  const [loading, setLoading] = useState(false);
  const [settingsTitle, setSettingsTitle] = useState<string>('');
  const [settingsLocation, setSettingsLocation] = useState<string>('');
  const [settingsDescription, setSettingsDescription] = useState<string>('');
  const [settingsBudget, setSettingsBudget] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetchPublicSettings();
        if (cancelled) return;
        setSettingsTitle(res.data.pinnedExampleTask?.title ?? '');
        setSettingsLocation(res.data.pinnedExampleTask?.location ?? '');
        setSettingsDescription(res.data.pinnedExampleTask?.description ?? '');
        setSettingsBudget(res.data.pinnedExampleTask?.budget ?? 0);
      } catch {
        // keep defaults below if settings fetch fails
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const computedTitle =
    title ?? settingsTitle ?? "Perfect Task Title: Clear and Specific";
  const computedDescription =
    description ?? settingsDescription ??
    "Write a detailed description that includes what you need, when you need it, and any special requirements. Be clear and friendly!";
  const computedLocation = location ?? settingsLocation ?? "Your Location";
  const computedPrice = useMemo(() => {
    if (price) return price;
    if (Number.isFinite(settingsBudget) && settingsBudget > 0) return `$${settingsBudget}`;
    return "$25-50";
  }, [price, settingsBudget]);
  const computedTags = useMemo(() => {
    if (tags && tags.length) return tags;
    return ['example', 'tutorial', 'guide'];
  }, [tags]);
  return (
    <div 
      onClick={onClick}
      className="bg-iconBg rounded-2xl p-6 border-2 border-orange relative overflow-hidden cursor-pointer"
    >
      {/* Watermark background */}
      <div className="absolute inset-0  top-10 left-0 pointer-events-none">
        <Image
          src={watermark.src}
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition: 'center' }}
        />
      </div>

      <div className="relative z-10">
      <div className="inline-block bg-orange text-white text-xs font-bold px-3 py-2 rounded-full mb-4">
      ✨  {tr("PINNED EXAMPLE")}
      </div>
      
      <h3 className="text-2xl font-black text-textBlack mb-2 ">
        {tr(computedTitle)}
      </h3>
      
      <p className="text-textGray text-sm mb-4 leading-relaxed">
        {tr(computedDescription)}
      </p>
      
      <div className="text-3xl font-black text-orange mb-4">
        {computedPrice}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {computedTags.map((tag, index) => (
          <div 
            key={index} 
            className="flex items-center gap-1 bg-iconBg text-orange px-3 py-2 rounded-full text-sm font-medium"
          >
            <Tag className="w-4 h-4" />
            {tag}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-textGray text-sm font-medium mb-6">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-5 h-5 text-gray-400" />
          {tr(computedLocation)}
        </div>
        <div className="flex items-center text-orange gap-1.5 bg-iconBg px-3 py-2 rounded-full ">
          <Clock className="w-5 h-5 text-orange" />
          {timeLeft}
        </div>
      </div>

      <button className="w-full bg-orange hover:bg-orangeHover text-white text-lg font-bold py-3.5 rounded-xl shadow-sm transition-colors duration-200 flex items-center justify-center gap-2">
        {/* <Share2 className="w-5 h-5" /> */}
       {tr("Contact us")}
      </button>
      </div>
    </div>
  );
};

export default PinnedTaskCard;

