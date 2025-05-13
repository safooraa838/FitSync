import React, { SelectHTMLAttributes } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helper?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  label,
  error,
  fullWidth = false,
  helper,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
  
  const baseSelectStyles = 'rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 appearance-none bg-no-repeat';
  const errorStyles = error 
    ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500 bg-danger-50' 
    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';
  
  const widthStyles = fullWidth ? 'w-full' : '';
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`${baseSelectStyles} ${errorStyles} ${widthStyles} pr-10 bg-[url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%23666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>')] bg-[position:right_0.75rem_center]`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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

export default Select;