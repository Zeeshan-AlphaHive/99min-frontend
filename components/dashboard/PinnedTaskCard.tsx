import React from 'react';
import { MapPin, Clock, Share2, Tag } from 'lucide-react';
import Image from 'next/image';
import watermark from '@/public/assets/images/watermark.svg';
import { useI18n } from '@/contexts/i18n-context';
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
  title = "Perfect Task Title: Clear and Specific",
  description = "Write a detailed description that includes what you need, when you need it, and any special requirements. Be clear and friendly!",
  price = "$25-50",
  tags = ['example', 'tutorial', 'guide'],
  location = "Your Location",
  timeLeft = "99m",
  onClick,
}) => {
  const { tr } = useI18n();
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
        {tr(title)}
      </h3>
      
      <p className="text-textGray text-sm mb-4 leading-relaxed">
        {tr(description)}
      </p>
      
      <div className="text-3xl font-black text-orange mb-4">
        {price}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag, index) => (
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
          {tr(location)}
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

