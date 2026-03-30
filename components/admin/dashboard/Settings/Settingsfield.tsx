import React from 'react';

type SettingsFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
};

export default function SettingsField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
}: SettingsFieldProps) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="block text-sm text-textGray mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-textBlack bg-white focus:outline-none focus:ring-2 focus:ring-orange/30 transition"
      />
    </div>
  );
}