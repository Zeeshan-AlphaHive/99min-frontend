import React, { ReactNode } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode; 
  variant?: 'default' | 'alt';
  error?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  variant = 'default',
  error,
  className = '',
  id,
  ...props
}) => {
  const textareaId = id ||
  (typeof label === 'string'
    ? label.toLowerCase().replace(/\s+/g, '-')
    : undefined);

  const baseClasses = 'w-full rounded-xl py-3.5 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-orange focus:bg-white transition-all duration-200 resize-none';
  const variantClasses = {
    default: 'bg-inputBg text-textBlack placeholder-textGray',
    alt: 'bg-inputBgAlt text-textBlack placeholder-textGray',
  };

  const borderClass = error 
    ? 'border-2 border-red-500' 
    : variant === 'alt' 
      ? 'border-0' 
      : 'border border-gray-200';

  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={textareaId} 
          className="block text-textBlack text-sm font-bold mb-2 ml-1"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`${baseClasses} ${variantClasses[variant]} ${borderClass} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>
      )}
    </div>
  );
};

export default Textarea;

