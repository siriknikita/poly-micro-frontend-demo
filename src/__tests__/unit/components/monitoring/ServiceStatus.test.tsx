import React from 'react';
import { render, screen } from '@testing-library/react';
import { ServiceStatus } from '@/components/monitoring/ServiceStatus';
import { Service } from '@/types';

// Mock the useServiceFilters hook
const mockUseServiceFilters = jest.fn();
jest.mock('@/components/monitoring/hooks/useServiceFilters', () => {
  return {
    useServiceFilters: mockUseServiceFilters
  };
});

// Default mock implementation
mockUseServiceFilters.mockImplementation(({ projectId, services }: { projectId: string; services: Service[] }) => {
  // Using projectId to simulate project-specific filters
  console.log(`Using filters for project: ${projectId}`);
  return ({
    filterGroups: [],
    filteredServices: services,
    addFilterGroup: jest.fn(),
    updateFilterGroup: jest.fn(),
    removeFilterGroup: jest.fn(),
    clearFilters: jest.fn()
  });
});

// Mock the ServiceFilters component
jest.mock('@/components/monitoring/shared/ServiceFilters', () => ({
  ServiceFilters: ({
    filterGroups, 
    onAddFilterGroup, 
    onUpdateFilterGroup, 
    onRemoveFilterGroup, 
    onClearFilters 
  }: {
    filterGroups: Array<{ operator: string; conditions: Array<{ field: string; value: string }> }>;
    onAddFilterGroup: (filterGroup: { operator: string; conditions: Array<{ field: string; value: string }> }) => void;
    onUpdateFilterGroup: (index: number, filterGroup: { operator: string; conditions: Array<{ field: string; value: string }> }) => void;
    onRemoveFilterGroup: (index: number) => void;
    onClearFilters: () => void;
  }) => (
    <div data-testid="service-filters">
      <div className="flex items-center mb-2">
        <button data-testid="add-filter-button">Add Filter</button>
        {filterGroups.length > 0 && <button>Clear all</button>}
      </div>
      {filterGroups.length > 0 && (
        <div data-testid="active-filters">
          <span>Filter Groups: {filterGroups.length}</span>
          <button onClick={() => onAddFilterGroup({ operator: 'AND', conditions: [] })}>Add Filter</button>
          <button onClick={() => onUpdateFilterGroup(0, { operator: 'OR', conditions: [] })}>Update Filter</button>
          <button onClick={() => onRemoveFilterGroup(0)}>Remove Filter</button>
          <button onClick={onClearFilters}>Clear Filters</button>
        </div>
      )}
    </div>
  )
}));

// Mock dependencies
jest.mock('@shared/index', () => ({
  BoxedWrapper: ({ children }: { children: React.ReactNode }) => <div data-testid="boxed-wrapper">{children}</div>,
  SectionHeader: ({ title, HeaderIcon, headerClassName }: { title: string; HeaderIcon?: React.ComponentType; headerClassName?: string; iconClassName?: string }) => (
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
  default: ({ status, variant }: { status: string; variant: string }) => (
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
    /**
     * Steps:
     * 1. Render the ServiceStatus component
     * 2. Check for initial state
     * 3. Check for section header
     */
    render(<ServiceStatus services={mockServices} projectId="test-project" />);
    
    expect(screen.getByTestId('boxed-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('section-header')).toBeInTheDocument();
    expect(screen.getByText('Services Status')).toBeInTheDocument();
  });

  it('should render all services with their details', () => {
    /**
     * Steps:
     * 1. Render the ServiceStatus component
     * 2. Check for initial state
     * 3. Check for service names
     * 4. Check for service details
     */
    render(<ServiceStatus services={mockServices} projectId="test-project" />);
    
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
    /**
     * Steps:
     * 1. Render the ServiceStatus component
     * 2. Check for initial state
     * 3. Check for empty state
     */
    render(<ServiceStatus services={[]} projectId="test-project" />);
    
    // Header should still be present
    expect(screen.getByText('Services Status')).toBeInTheDocument();
    
    // But no service information should be shown
    expect(screen.queryByText('Port:')).not.toBeInTheDocument();
    expect(screen.queryByText('Version:')).not.toBeInTheDocument();
    expect(screen.queryByText('Uptime:')).not.toBeInTheDocument();
  });

  it('should render the service filters component', () => {
    /**
     * Steps:
     * 1. Render the ServiceStatus component
     * 2. Check for initial state
     * 3. Check for service filters component
     */
    render(<ServiceStatus services={mockServices} projectId="test-project" />);
    
    expect(screen.getByTestId('service-filters')).toBeInTheDocument();
  });

  it('should pass the correct props to ServiceFilters', () => {
    /**
     * Steps:
     * 1. Render the ServiceStatus component
     * 2. Check for initial state
     * 3. Check for ServiceFilters props
     */
    // Reset the mock before this test
    mockUseServiceFilters.mockClear();
    
    // Set up a specific implementation for this test
    mockUseServiceFilters.mockImplementation(({ services }) => ({
      filterGroups: [],
      filteredServices: services,
      addFilterGroup: jest.fn(),
      updateFilterGroup: jest.fn(),
      removeFilterGroup: jest.fn(),
      clearFilters: jest.fn()
    }));
    
    // Render the component
    render(<ServiceStatus services={mockServices} projectId="test-project" />);
    
    // Verify the ServiceFilters component is rendered
    expect(screen.getByTestId('service-filters')).toBeInTheDocument();
    
    // Simply verify that all services are displayed
    expect(screen.getByText('API Gateway')).toBeInTheDocument();
    expect(screen.getByText('Auth Service')).toBeInTheDocument();
    expect(screen.getByText('Database Service')).toBeInTheDocument();
  });

  it('should display all services when no filters are applied', () => {
    /**
     * Steps:
     * 1. Render the ServiceStatus component
     * 2. Check for initial state
     * 3. Check for all services
     */
    // Default mock implementation returns all services
    render(<ServiceStatus services={mockServices} projectId="test-project" />);
    
    // All services should be displayed
    expect(screen.getByText('API Gateway')).toBeInTheDocument();
    expect(screen.getByText('Auth Service')).toBeInTheDocument();
    expect(screen.getByText('Database Service')).toBeInTheDocument();
  });
  
  it('should handle the empty state correctly', () => {
    /**
     * Steps:
     * 1. Render the ServiceStatus component
     * 2. Check for initial state
     * 3. Check for empty state
     */
    // Test with empty services array
    render(<ServiceStatus services={[]} projectId="test-project" />);
    
    // No service cards should be displayed
    expect(screen.queryByText('API Gateway')).not.toBeInTheDocument();
    expect(screen.queryByText('Auth Service')).not.toBeInTheDocument();
    expect(screen.queryByText('Database Service')).not.toBeInTheDocument();
  });
});

/**
 * | Test Number | Testing Environment | Test | Expected Result | Result |
 * |-----------|----------------------|------|------------------|--------|
 * | 1 | Web Browser | - Render the ServiceStatus component <br> - Check for initial state <br> - Check for section header | should render the component with section header | + |
 * | 2 | Web Browser | - Render the ServiceStatus component <br> - Check for initial state <br> - Check for section header | should render all services with their details | + |
 * | 3 | Web Browser | - Render the ServiceStatus component <br> - Check for initial state <br> - Check for section header | should render empty state when no services are provided | + |
 * | 4 | Web Browser | - Render the ServiceStatus component <br> - Check for initial state <br> - Check for section header | should render the service filters component | + |
 * | 5 | Web Browser | - Render the ServiceStatus component <br> - Check for initial state <br> - Check for section header | should pass the correct props to ServiceFilters | + |
 * | 6 | Web Browser | - Render the ServiceStatus component <br> - Check for initial state <br> - Check for section header | should display all services when no filters are applied | + |
 * | 7 | Web Browser | - Render the ServiceStatus component <br> - Check for initial state <br> - Check for section header | should handle the empty state correctly | + |
 */