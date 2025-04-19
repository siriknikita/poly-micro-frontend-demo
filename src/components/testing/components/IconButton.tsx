import { memo, ButtonHTMLAttributes, ReactNode } from 'react';
import { BUTTON_VARIANTS } from '../constants';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label?: string;
  variant?: 'primary' | 'outline' | 'active';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Reusable icon button component
 */
export const IconButton = memo<IconButtonProps>(({
  icon,
  label,
  variant = 'outline',
  size = 'sm',
  className = '',
  ...props
}) => {
  // Get the variant class
  const variantClass = BUTTON_VARIANTS[variant.toUpperCase()] || BUTTON_VARIANTS.OUTLINE;
  
  // Get the size class
  const sizeClass = size === 'sm' 
    ? 'p-2' 
    : size === 'md' 
      ? 'px-4 py-2' 
      : 'px-6 py-3';

  // Determine if it's an icon-only button or icon with label
  const isIconOnly = !label;
  
  return (
    <button
      className={`rounded-lg ${sizeClass} ${variantClass} ${isIconOnly ? '' : 'flex items-center space-x-2'} ${className}`}
      {...props}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
});
