
import React from 'react';
import { cn } from '@/lib/utils';

interface NeumorphicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const NeumorphicButton = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}: NeumorphicButtonProps) => {
  const baseStyles = "rounded-xl font-medium transition-medium active:shadow-neu-pressed";
  
  const variantStyles = {
    primary: "bg-neu-accent text-white hover:bg-neu-accent-hover",
    secondary: "bg-neu-bg text-neu-text shadow-neu-flat hover:shadow-neu-convex"
  };
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5",
    lg: "px-7 py-3.5 text-lg"
  };

  return (
    <button 
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default NeumorphicButton;
