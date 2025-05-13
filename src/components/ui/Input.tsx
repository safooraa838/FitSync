import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  helper?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  icon,
  helper,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  const baseInputStyles = 'rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1';
  const errorStyles = error 
    ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500 bg-danger-50' 
    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';
  
  const widthStyles = fullWidth ? 'w-full' : '';
  const iconStyles = icon ? 'pl-10' : '';
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`${baseInputStyles} ${errorStyles} ${widthStyles} ${iconStyles}`}
          {...props}
        />
      </div>
      {helper && !error && (
        <p className="mt-1 text-xs text-gray-500">{helper}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-danger-600">{error}</p>
      )}
    </div>
  );
};

export default Input;