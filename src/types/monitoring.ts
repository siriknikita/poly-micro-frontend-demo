export interface CPUData {
  time: string;
  load: number;
  memory: number;
  threads: number;
}

export type MockedCPUData = Record<string, Record<string, CPUData[]>>;

export interface Service {
  id?: string;
  name: string;
  port?: number;
  url?: string;
  status?: 'Running' | 'Stopped' | 'Error' | 'Online' | 'Offline';
  health?: 'Healthy' | 'Warning' | 'Critical' | 'Degraded' | 'Error';
  uptime?: string;
  version?: string;
  lastDeployment?: string;
}

export type MockedServices = Record<string, Service[]>;

export type Severity = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface Log {
  id: string;
  service: string;
  severity: Severity;
  message: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface Project {
  id: string;
  name: string;
  path: string;
}

export type Tab = {
  id: string;
  name: string;
  icon: React.ComponentType<React.ComponentProps<'svg'>>; // Allow SVG props including className
  component: React.ComponentType<unknown>; // Allow components with unknown props
};
