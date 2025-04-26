import React from 'react';
import { render, screen } from '@testing-library/react';
import { ServiceStatus } from '@/components/monitoring/ServiceStatus';
import { Service } from '@/types';
import { getStatusVariant } from '@/components/monitoring/shared/statusUtils';

// Mock dependencies
jest.mock('@shared/index', () => ({
  BoxedWrapper: ({ children }: { children: React.ReactNode }) => <div data-testid="boxed-wrapper">{children}</div>,
  SectionHeader: ({ title, HeaderIcon, headerClassName, iconClassName }: any) => (
    <div data-testid="section-header">
      {HeaderIcon && <HeaderIcon data-testid="header-icon" />}
      <span className={headerClassName}>{title}</span>
    </div>
  )
}));

jest.mock('lucide-react', () => ({
  Server: () => <span data-testid="server-icon">Server</span>,
}));

jest.mock('@/components/monitoring/shared/StatusBadge', () => ({
  __esModule: true,
  default: ({ status, variant }: any) => (
    <span data-testid={`status-badge-${status}`} className={variant}>
      {status}
    </span>
  )
}));

jest.mock('@/components/monitoring/shared/statusUtils', () => ({
  getStatusVariant: jest.fn((status) => {
    if (status.toLowerCase().includes('healthy') || status.toLowerCase().includes('online')) {
      return 'success';
    } else if (status.toLowerCase().includes('warn') || status.toLowerCase().includes('degraded')) {
      return 'warning';
    } else if (status.toLowerCase().includes('error') || status.toLowerCase().includes('offline')) {
      return 'error';
    }
    return 'info';
  })
}));

describe('ServiceStatus', () => {
  // Test data
  const mockServices: Service[] = [
    { 
      id: '1', 
      name: 'API Gateway', 
      url: 'http://api-gateway.com',
      port: 8080,
      version: '1.2.3',
      uptime: '2d 4h 12m',
      status: 'Online',
      health: 'Healthy'
    },
    { 
      id: '2', 
      name: 'Auth Service', 
      url: 'http://auth-service.com',
      port: 8081,
      version: '2.0.1',
      uptime: '1d 3h 45m',
      status: 'Online',
      health: 'Degraded'
    },
    { 
      id: '3', 
      name: 'Database Service', 
      url: 'http://db-service.com',
      port: 5432,
      version: '3.1.0',
      uptime: '5d 12h 30m',
      status: 'Offline',
      health: 'Error'
    }
  ];

  it('should render the component with section header', () => {
    render(<ServiceStatus services={mockServices} />);
    
    expect(screen.getByTestId('boxed-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('section-header')).toBeInTheDocument();
    expect(screen.getByText('Services Status')).toBeInTheDocument();
  });

  it('should render all services with their details', () => {
    render(<ServiceStatus services={mockServices} />);
    
    // Check service names
    expect(screen.getByText('API Gateway')).toBeInTheDocument();
    expect(screen.getByText('Auth Service')).toBeInTheDocument();
    expect(screen.getByText('Database Service')).toBeInTheDocument();
    
    // Check service details for all services
    mockServices.forEach(service => {
      expect(screen.getByText(`Port: ${service.port}`)).toBeInTheDocument();
      expect(screen.getByText(`Version: ${service.version}`)).toBeInTheDocument();
      expect(screen.getByText(`Uptime: ${service.uptime}`)).toBeInTheDocument();
      
      // Check that status badges are rendered
      const statusBadges = screen.getAllByTestId(`status-badge-${service.status}`);
      const healthBadges = screen.getAllByTestId(`status-badge-${service.health}`);
      expect(statusBadges.length).toBeGreaterThan(0);
      expect(healthBadges.length).toBeGreaterThan(0);
    });
  });

  it('should render empty state when no services are provided', () => {
    render(<ServiceStatus services={[]} />);
    
    // Header should still be present
    expect(screen.getByText('Services Status')).toBeInTheDocument();
    
    // But no service information should be shown
    expect(screen.queryByText('Port:')).not.toBeInTheDocument();
    expect(screen.queryByText('Version:')).not.toBeInTheDocument();
    expect(screen.queryByText('Uptime:')).not.toBeInTheDocument();
  });
});
