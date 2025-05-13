import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'accent' | 'complementary' | 'success' | 'warning' | 'danger';
  animated?: boolean;
  label?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  showLabel = true,
  size = 'md',
  color = 'primary',
  animated = true,
  label,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const baseStyles = 'w-full bg-gray-200 rounded-full overflow-hidden';
  
  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };
  
  const colorStyles = {
    primary: 'bg-primary-600',
    accent: 'bg-accent-500',
    complementary: 'bg-complementary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
  };
  
  const labelTextStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-sm font-medium',
  };
  
  return (
    <div className={className}>
      {(label || showLabel) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className={`${labelTextStyles[size]} text-gray-700`}>{label}</span>}
          {showLabel && (
            <span className={`${labelTextStyles[size]} text-gray-500`}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={`${baseStyles} ${sizeStyles[size]}`}>
        {animated ? (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full ${colorStyles[color]}`}
          />
        ) : (
          <div
            className={`h-full ${colorStyles[color]}`}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    </div>
  );
};

export default ProgressBar;