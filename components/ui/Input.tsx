"use client";

import React, { useState, ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: ReactNode; 
  variant?: 'default' | 'alt';
  showPasswordToggle?: boolean;
  error?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input: React.FC<InputProps> = ({
  label,
  variant = 'default',
  type = 'text',
  showPasswordToggle = false,
  error,
  icon,
  iconPosition = 'left',
  className = '',
  id,
  placeholder,
  ...props
}) => {
  const { tr } = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : type;

  const inputId =
  id ||
  (typeof label === 'string'
    ? label.toLowerCase().replace(/\s+/g, '-')
    : undefined);

  const baseClasses = 'w-full rounded-xl py-3.5 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-orange focus:bg-white transition-all duration-200';
  const variantClasses = {
    default: 'bg-inputBg text-textBlack placeholder-textGray',
    alt: 'bg-inputBgAlt text-textBlack placeholder-textGray',
  };

  const borderClass = error 
    ? 'border-2 border-red-500' 
    : variant === 'alt' 
      ? 'border-0' 
      : 'border border-gray-200';

  // Handle padding for icons and password toggle
  let leftPadding = '';
  let rightPadding = '';
  
  if (icon && iconPosition === 'left') {
    leftPadding = 'pl-10';
  }
  
  if (icon && iconPosition === 'right' && !(showPasswordToggle && type === 'password')) {
    rightPadding = 'pr-10';
  } else if (showPasswordToggle && type === 'password') {
    rightPadding = 'pr-10';
  }
  
  const paddingClasses = `${leftPadding} ${rightPadding}`;

  return (
    <div className="mb-4">
      {label && (
  <label
    htmlFor={inputId}
    className="block text-textBlack text-sm font-bold mb-2 ml-1"
  >
    {typeof label === 'string' ? tr(label) : label}
  </label>
)}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textGray">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          type={inputType}
          className={`${baseClasses} ${variantClasses[variant]} ${borderClass} ${paddingClasses} ${className}`}
          placeholder={placeholder !== undefined ? tr(placeholder) : undefined}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-textGray">
            {icon}
          </div>
        )}
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 px-4 flex items-center cursor-pointer hover:opacity-70"
            aria-label={showPassword ? tr('Hide password') : tr('Show password')}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 text-gray" />
            ) : (
              <Eye className="w-5 h-5 text-gray" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1 ml-1">{tr(error)}</p>
      )}
    </div>
  );
};

export default Input;

