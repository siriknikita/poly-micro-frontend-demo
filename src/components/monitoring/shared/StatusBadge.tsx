import { BadgeVariant, variantClasses } from './statusUtils';

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
  className?: string;
}

function StatusBadge({ 
  status, 
  variant = 'info',
  className = ''
}: StatusBadgeProps): JSX.Element {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const variantClass = variantClasses[variant];
  
  return (
    <span className={`${baseClasses} ${variantClass} ${className}`} data-testid={`status-badge-${status}`}>
      {status}
    </span>
  );
}

export default StatusBadge;
