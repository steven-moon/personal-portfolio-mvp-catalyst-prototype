import React from 'react';
import { cn } from '@/lib/utils';

interface NeumorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'pressed' | 'convex';
  children: React.ReactNode;
  className?: string;
}

const NeumorphicCard = ({
  variant = 'flat',
  children,
  className,
  ...props
}: NeumorphicCardProps) => {
  const baseStyles = "p-6 rounded-xl transition-medium bg-background";
  
  const variantStyles = {
    flat: "neu-flat dark:shadow-dark-neu-flat hover:scale-[1.01]",
    pressed: "neu-pressed dark:shadow-dark-neu-pressed",
    convex: "neu-convex dark:shadow-dark-neu-convex hover:scale-[1.01]"
  };

  return (
    <div 
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default NeumorphicCard;
