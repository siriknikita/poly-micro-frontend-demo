import { CLASSES_BY_SEVERITY } from '@/helpers/constants';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

function StatusBadge({ 
  status, 
  className = ''
}: StatusBadgeProps): JSX.Element {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const styleClass = CLASSES_BY_SEVERITY[status as keyof typeof CLASSES_BY_SEVERITY] || '';
  
  return (
    <span className={`${baseClasses} ${styleClass} ${className}`} data-testid={`status-badge-${status}`}>
      {status}
    </span>
  );
}

export default StatusBadge;
