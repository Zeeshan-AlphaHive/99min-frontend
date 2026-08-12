import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'disabled' | 'link';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'font-bold rounded-xl transition-colors duration-200 cursor-pointer';
  
  const variantClasses = {
    primary: 'bg-orange hover:bg-orangeHover text-white',
    secondary: 'bg-lightGrey hover:opacity-90 text-textBlack',
    disabled: 'bg-gray-200 text-textGray opacity-50 cursor-not-allowed',
    link: 'text-orange hover:underline bg-transparent',
  };

  const sizeClasses = {
    sm: 'text-sm py-2.5 px-4',
    md: 'text-base py-3.5 px-4',
    lg: 'text-lg py-3.5 px-4',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const shadowClass = variant === 'primary' ? 'shadow-sm' : '';
  
  const finalVariant = disabled ? 'disabled' : variant;

  return (
    <button
      className={`${baseClasses} ${variantClasses[finalVariant]} ${sizeClasses[size]} ${widthClass} ${shadowClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

