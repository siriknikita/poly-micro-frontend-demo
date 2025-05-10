import { BadgeVariant } from './statusUtils';
import { CLASSES_BY_SEVERITY } from '@/helpers/constants';

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
  // Use CLASSES_BY_SEVERITY directly if status is a key, otherwise fallback to variant mapping
  const styleClass = CLASSES_BY_SEVERITY[status as keyof typeof CLASSES_BY_SEVERITY] || '';
  
  console.group('StatusBadge');
  console.log('status', status);
  console.log('variant', variant);
  console.log('styleClass', styleClass);
  console.groupEnd();
  
  return (
    <span className={`${baseClasses} ${styleClass} ${className}`} data-testid={`status-badge-${status}`}>
      {status}
    </span>
  );
}

export default StatusBadge;
