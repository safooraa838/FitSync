import React, { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  hoverEffect?: boolean;
  animation?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverEffect = true,
  animation = true,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-xl overflow-hidden';
  
  const variantStyles = {
    default: 'bg-white shadow-sm',
    elevated: 'bg-white shadow-md',
    outlined: 'bg-white border border-gray-200',
  };
  
  const hoverStyles = hoverEffect 
    ? 'transition-shadow duration-200 hover:shadow-md'
    : '';
  
  if (animation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
        className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;