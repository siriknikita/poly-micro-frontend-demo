import { CPUData, Service, Log, Project } from '../types/monitoring';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    path: '/path/to/ecommerce',
  },
  {
    id: '2',
    name: 'Banking System',
    path: '/path/to/banking',
  },
  {
    id: '3',
    name: 'Healthcare Portal',
    path: '/path/to/healthcare',
  },
];

export const mockCpuData: Record<string, CPUData[]> = {
  'User Service': Array.from({ length: 24 }, (_, i) => ({
    time: new Date(Date.now() - (23 - i) * 300000).toLocaleTimeString(),
    load: 25 + Math.random() * 60,
    memory: 40 + Math.random() * 45,
    threads: Math.floor(10 + Math.random() * 20),
  })),
  'Payment Service': Array.from({ length: 24 }, (_, i) => ({
    time: new Date(Date.now() - (23 - i) * 300000).toLocaleTimeString(),
    load: 15 + Math.random() * 40,
    memory: 30 + Math.random() * 35,
    threads: Math.floor(5 + Math.random() * 15),
  })),
  'Notification Service': Array.from({ length: 24 }, (_, i) => ({
    time: new Date(Date.now() - (23 - i) * 300000).toLocaleTimeString(),
    load: 10 + Math.random() * 30,
    memory: 20 + Math.random() * 25,
    threads: Math.floor(3 + Math.random() * 10),
  })),
  'Authentication Service': Array.from({ length: 24 }, (_, i) => ({
    time: new Date(Date.now() - (23 - i) * 300000).toLocaleTimeString(),
    load: 20 + Math.random() * 50,
    memory: 35 + Math.random() * 40,
    threads: Math.floor(8 + Math.random() * 18),
  })),
};

export const mockServices: Service[] = [
  {
    name: 'User Service',
    port: 3001,
    status: 'Running',
    health: 'Healthy',
    uptime: '5d 12h 30m',
    version: '1.2.0',
    lastDeployment: '2024-02-25 14:30',
  },
  {
    name: 'Payment Service',
    port: 3002,
    status: 'Running',
    health: 'Warning',
    uptime: '3d 8h 15m',
    version: '1.1.5',
    lastDeployment: '2024-02-26 09:45',
  },
  {
    name: 'Notification Service',
    port: 3003,
    status: 'Error',
    health: 'Critical',
    uptime: '0d 4h 20m',
    version: '1.0.8',
    lastDeployment: '2024-02-28 10:15',
  },
  {
    name: 'Authentication Service',
    port: 3004,
    status: 'Running',
    health: 'Healthy',
    uptime: '7d 3h 45m',
    version: '2.0.1',
    lastDeployment: '2024-02-22 16:20',
  },
];

export const mockLogs: Log[] = [
  {
    id: '1',
    service: 'User Service',
    severity: 'INFO',
    message: 'User authentication successful',
    timestamp: '2024-02-28 12:00:00',
    details: { userId: '123', method: 'OAuth' },
  },
  {
    id: '2',
    service: 'Payment Service',
    severity: 'ERROR',
    message: 'Payment processing failed: Invalid card number',
    timestamp: '2024-02-28 12:01:00',
    details: { transactionId: 'tx_789', errorCode: 'INVALID_CARD' },
  },
  {
    id: '3',
    service: 'Notification Service',
    severity: 'WARN',
    message: 'Email delivery delayed: Rate limit exceeded',
    timestamp: '2024-02-28 12:02:00',
    details: { emailId: 'em_456', retryCount: 2 },
  },
  {
    id: '4',
    service: 'Authentication Service',
    severity: 'DEBUG',
    message: 'Token refresh completed',
    timestamp: '2024-02-28 12:03:00',
    details: { userId: '124', tokenType: 'refresh' },
  },
  {
    id: '5',
    service: 'Education Service',
    severity: 'INFO',
    message: 'New course added successfully',
    timestamp: '2024-02-28 12:04:00',
    details: { courseId: 'course_101', instructor: 'John Doe' },
  },
  {
    id: '6',
    service: 'User Service',
    severity: 'ERROR',
    message: 'User authentication failed: Invalid credentials',
    timestamp: '2024-02-28 12:05:00',
    details: { userId: '125', method: 'OAuth' },
  },
  {
    id: '7',
    service: 'Payment Service',
    severity: 'INFO',
    message: 'Payment processed successfully',
    timestamp: '2024-02-28 12:06:00',
    details: { transactionId: 'tx_790', amount: 100 },
  },
  {
    id: '8',
    service: 'Notification Service',
    severity: 'INFO',
    message: 'Notification sent successfully',
    timestamp: '2024-02-28 12:07:00',
    details: { notificationId: 'notif_123', recipient: 'user@example.com' },
  },
  {
    id: '9',
    service: 'Authentication Service',
    severity: 'ERROR',
    message: 'Token refresh failed: Expired token',
    timestamp: '2024-02-28 12:08:00',
    details: { userId: '126', tokenType: 'refresh' },
  },
  {
    id: '10',
    service: 'Education Service',
    severity: 'WARN',
    message: 'Course enrollment limit reached',
    timestamp: '2024-02-28 12:09:00',
    details: { courseId: 'course_102', limit: 50 },
  },
];
