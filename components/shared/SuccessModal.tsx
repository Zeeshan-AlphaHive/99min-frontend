"use client";

import React, { useEffect, ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui";
import { useI18n } from "@/contexts/i18n-context";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string | ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
  buttonHref?: string;
  icon?: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  buttonText = "Continue",
  onButtonClick,
  buttonHref,
  icon,
  iconBgColor = "bg-[#DCFCE7]",
  iconColor = "text-[#00C853]",
}) => {
  const { tr } = useI18n();
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const defaultIcon = (
    <CheckCircle2 className="w-10 h-10" strokeWidth={3} />
  );

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    }
    onClose();
  };

  const buttonContent = (
    <Button
      variant="primary"
      size="md"
      fullWidth
      className="shadow-md"
      onClick={buttonHref ? undefined : handleButtonClick}
    >
      {tr(buttonText)}
    </Button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Overlay/Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-white rounded-4xl w-full max-w-md p-8 shadow-2xl transform transition-all flex flex-col items-center">
        {/* Success Icon Container */}
        <div className={`w-20 h-20 ${iconBgColor} rounded-full flex items-center justify-center mb-6`}>
          <div className={iconColor}>
            {icon || defaultIcon}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-extrabold text-textBlack text-center mb-3 ">
          {tr(title)}
        </h2>

        {/* Description Text */}
        <div className="text-center text-textGray text-sm leading-relaxed mb-8 px-2 font-medium opacity-80">
          {typeof description === 'string' ? <p>{tr(description)}</p> : description}
        </div>

        {/* Action Button */}
        {buttonHref ? (
          <a href={buttonHref} className="w-full" onClick={onClose}>
            {buttonContent}
          </a>
        ) : (
          <div className="w-full">
            {buttonContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessModal;

