import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'accent' | 'complementary' | 'warning' | 'danger';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  color = 'primary',
  className = '',
}) => {
  const colorStyles = {
    primary: 'bg-primary-50 text-primary-600',
    accent: 'bg-accent-50 text-accent-600',
    complementary: 'bg-complementary-50 text-complementary-600',
    warning: 'bg-warning-50 text-warning-600',
    danger: 'bg-danger-50 text-danger-600',
  };

  const changeColorStyles = change?.isPositive
    ? 'text-success-600 bg-success-50'
    : 'text-danger-600 bg-danger-50';

  return (
    <Card className={`p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <motion.h3 
            className="mt-1 text-2xl font-semibold"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {value}
          </motion.h3>
          
          {change && (
            <div className="mt-2 flex items-center">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${changeColorStyles}`}
              >
                {change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}%
              </span>
              <span className="ml-2 text-xs text-gray-500">from last week</span>
            </div>
          )}
        </div>
        
        <div className={`p-2 rounded-lg ${colorStyles[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;