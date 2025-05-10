// Utility functions for status handling
import { CLASSES_BY_SEVERITY } from '@/helpers/constants';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info';

export const variantClasses: Record<BadgeVariant, string> = {
  success: CLASSES_BY_SEVERITY.DEBUG, // Green for DEBUG
  warning: CLASSES_BY_SEVERITY.WARN,  // Yellow for WARN
  error: CLASSES_BY_SEVERITY.ERROR,   // Red for ERROR
  info: CLASSES_BY_SEVERITY.INFO      // Blue for INFO
};

export const getStatusVariant = (status: string): BadgeVariant => {
  // Direct mapping from severity to variant
  switch(status) {
    case 'DEBUG':
      return 'success'; // Maps to DEBUG (green)
    case 'WARN':
      return 'warning'; // Maps to WARN (yellow)
    case 'ERROR':
      return 'error';   // Maps to ERROR (red)
    case 'INFO':
      return 'info';    // Maps to INFO (green)
    default:
      // For service statuses and other cases
      const statusLower = status.toLowerCase();
      if (['running', 'healthy', 'active', 'online'].includes(statusLower)) {
        return 'success';
      } else if (['warning', 'degraded', 'unstable'].includes(statusLower)) {
        return 'warning';
      } else if (['error', 'critical', 'down', 'offline', 'failed'].includes(statusLower)) {
        return 'error';
      }
      return 'info';
  }
};
