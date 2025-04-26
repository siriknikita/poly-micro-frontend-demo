// Utility functions for status handling

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info';

export const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
};

export const getStatusVariant = (status: string): BadgeVariant => {
  const statusLower = status.toLowerCase();
  
  if (['running', 'healthy', 'active', 'online'].includes(statusLower)) {
    return 'success';
  } else if (['warning', 'degraded', 'unstable'].includes(statusLower)) {
    return 'warning';
  } else if (['error', 'critical', 'down', 'offline', 'failed'].includes(statusLower)) {
    return 'error';
  }
  
  return 'info';
};
