import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LogViewer } from '@/components/monitoring/LogViewer/LogViewer';
import { Log, Service } from '@/types';

// Mock dependencies
const mockUsePagination = jest.fn().mockImplementation(() => mockPaginationReturn);
jest.mock('@hooks/index', () => ({
  usePagination: mockUsePagination
}));

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
  AlertCircle: () => <span data-testid="alert-circle-icon">AlertCircle</span>,
}));

jest.mock('../../../../../../../src/components/monitoring/LogViewer/TablePagination', () => ({
  __esModule: true,
  TablePagination: ({ currentPage, totalPages }: { currentPage: number; totalPages: number }) => (
    <div data-testid="table-pagination">
      Table Pagination: Page {currentPage} of {totalPages}
    </div>
  )
}));

jest.mock('../../../../../../../src/components/monitoring/shared/ServiceSelector', () => ({
  ServiceSelector: ({ selectedService, services, onServiceSelect }: { selectedService: string; services: Service[]; onServiceSelect: (service: string) => void }) => (
    <select 
      data-testid="service-selector"
      value={selectedService}
      onChange={(e) => onServiceSelect(e.target.value)}
    >
      <option value="All">All Services</option>
      {services.map((service: Service) => (
        <option key={service.id} value={service.name}>{service.name}</option>
      ))}
    </select>
  )
}));

jest.mock('../../../../../../../src/components/monitoring/shared/StatusBadge', () => ({
  __esModule: true,
  default: ({ status, variant }: { status: string; variant: string }) => (
    <span data-testid={`status-badge-${status}`} className={variant}>
      {status}
    </span>
  )
}));

// Define mock pagination return value outside the describe block
const mockPaginationReturn = {
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 10,
  paginatedLogs: [] as Log[],
  setLastLogRowRef: jest.fn(),
  handlePageChange: jest.fn(),
  handleItemsPerPageChange: jest.fn()
};

describe('LogViewer', () => {
  // Test data
  const mockServices: Service[] = [
    { id: '1', name: 'service1', url: 'http://service1.com' },
    { id: '2', name: 'service2', url: 'http://service2.com' }
  ];
  
  const mockLogs: Log[] = [
    { id: '1', timestamp: '2025-04-25T10:00:00Z', service: 'service1', severity: 'ERROR', message: 'Error message 1' },
    { id: '2', timestamp: '2025-04-25T10:05:00Z', service: 'service1', severity: 'INFO', message: 'Info message 1' },
    { id: '3', timestamp: '2025-04-25T10:10:00Z', service: 'service2', severity: 'WARN', message: 'Warning message 1' },
    { id: '4', timestamp: '2025-04-25T10:15:00Z', service: 'service2', severity: 'INFO', message: 'Info message 2' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Update the mock pagination return value for the current test
    mockPaginationReturn.paginatedLogs = mockLogs;
  });

  it('should render the component with logs', () => {
    /**
     * Steps:
     * 1. Render the LogViewer component
     * 2. Check for initial state
     * 3. Check for logs
     */
    render(
      <LogViewer
        logs={mockLogs}
        selectedService="All"
        selectedSeverity="All"
        onServiceChange={jest.fn()}
        onSeverityChange={jest.fn()}
        services={mockServices}
      />
    );
    
    expect(screen.getByTestId('boxed-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('section-header')).toBeInTheDocument();
    expect(screen.getByTestId('service-selector')).toBeInTheDocument();
    expect(screen.getByText('4 entries')).toBeInTheDocument();
  });

  it('should display filtered logs count correctly', () => {
    /**
     * Steps:
     * 1. Render the LogViewer component
     * 2. Check for initial state
     * 3. Check for filtered logs count
     */
    // Set up the pagination hook to return fewer logs to simulate filtering
    mockPaginationReturn.paginatedLogs = [mockLogs[0]];

    render(
      <LogViewer
        logs={[mockLogs[0]]}
        selectedService="service1"
        selectedSeverity="ERROR"
        onServiceChange={jest.fn()}
        onSeverityChange={jest.fn()}
        services={mockServices}
      />
    );
    
    expect(screen.getByText('1 entry')).toBeInTheDocument();
  });

  it('should call onServiceChange when service filter changes', () => {
    /**
     * Steps:
     * 1. Render the LogViewer component
     * 2. Check for initial state
     * 3. Check for onServiceChange
     */
    const mockOnServiceChange = jest.fn();
    
    render(
      <LogViewer
        logs={mockLogs}
        selectedService="All"
        selectedSeverity="All"
        onServiceChange={mockOnServiceChange}
        onSeverityChange={jest.fn()}
        services={mockServices}
      />
    );
    
    const serviceSelector = screen.getByTestId('service-selector');
    fireEvent.change(serviceSelector, { target: { value: 'service1' } });
    
    expect(mockOnServiceChange).toHaveBeenCalledWith('service1');
  });

  it('should call onSeverityChange when severity filter changes', () => {
    /**
     * Steps:
     * 1. Render the LogViewer component
     * 2. Check for initial state
     * 3. Check for onSeverityChange
     */
    const mockOnSeverityChange = jest.fn();
    
    render(
      <LogViewer
        logs={mockLogs}
        selectedService="All"
        selectedSeverity="All"
        onServiceChange={jest.fn()}
        onSeverityChange={mockOnSeverityChange}
        services={mockServices}
      />
    );
    
    const severitySelector = screen.getByLabelText('Select severity level');
    fireEvent.change(severitySelector, { target: { value: 'ERROR' } });
    
    expect(mockOnSeverityChange).toHaveBeenCalledWith('ERROR');
  });

  it('should render with items per page selector', () => {
    /**
     * Steps:
     * 1. Render the LogViewer component
     * 2. Check for initial state
     * 3. Check for items per page selector
     */
    render(
      <LogViewer
        logs={mockLogs}
        selectedService="All"
        selectedSeverity="All"
        onServiceChange={jest.fn()}
        onSeverityChange={jest.fn()}
        services={mockServices}
      />
    );
    
    // Verify that the items per page selector is rendered
    const itemsPerPageSelector = screen.getByLabelText('Select items per page');
    expect(itemsPerPageSelector).toBeInTheDocument();
    
    // Verify that the selector has options
    expect(screen.getByText('10 per page')).toBeInTheDocument();
  });

  it('should display table headers', () => {
    /**
     * Steps:
     * 1. Render the LogViewer component
     * 2. Check for initial state
     * 3. Check for table headers
     */
    render(
      <LogViewer
        logs={mockLogs}
        selectedService="All"
        selectedSeverity="All"
        onServiceChange={jest.fn()}
        onSeverityChange={jest.fn()}
        services={mockServices}
      />
    );
    
    // Check that common table headers are present
    expect(screen.getByText('Timestamp')).toBeInTheDocument();
    expect(screen.getByText('Service')).toBeInTheDocument();
    expect(screen.getByText('Severity')).toBeInTheDocument();
    expect(screen.getByText('Message')).toBeInTheDocument();
  });

  it('should show pagination when there are logs', () => {
    /**
     * Steps:
     * 1. Render the LogViewer component
     * 2. Check for initial state
     * 3. Check for pagination
     */
    render(
      <LogViewer
        logs={mockLogs}
        selectedService="All"
        selectedSeverity="All"
        onServiceChange={jest.fn()}
        onSeverityChange={jest.fn()}
        services={mockServices}
      />
    );
    
    expect(screen.getByTestId('table-pagination')).toBeInTheDocument();
  });

  it('should show "No logs found" message when no logs match filters', () => {
    /**
     * Steps:
     * 1. Render the LogViewer component
     * 2. Check for initial state
     * 3. Check for "No logs found" message
     */
    // Set up the pagination hook to return no logs
    mockPaginationReturn.paginatedLogs = [];

    render(
      <LogViewer
        logs={[]}
        selectedService="service1"
        selectedSeverity="ERROR"
        onServiceChange={jest.fn()}
        onSeverityChange={jest.fn()}
        services={mockServices}
      />
    );
    
    expect(screen.getByText('No logs found matching the current filters')).toBeInTheDocument();
    expect(screen.queryByTestId('table-pagination')).not.toBeInTheDocument();
  });

  it('should display log details correctly', () => {
    /**
     * Steps:
     * 1. Render the LogViewer component
     * 2. Check for initial state
     * 3. Check for log details
     */
    render(
      <LogViewer
        logs={mockLogs}
        selectedService="All"
        selectedSeverity="All"
        onServiceChange={jest.fn()}
        onSeverityChange={jest.fn()}
        services={mockServices}
      />
    );
    
    // Check timestamp, service, and message content for logs
    expect(screen.getByText('Error message 1')).toBeInTheDocument();
    expect(screen.getByText('Info message 1')).toBeInTheDocument();
    expect(screen.getByText('Warning message 1')).toBeInTheDocument();
    expect(screen.getByText('Info message 2')).toBeInTheDocument();
    
    // Check service names in the table
    expect(screen.getAllByText('service1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('service2').length).toBeGreaterThan(0);
    
    // Check timestamps
    expect(screen.getByText('2025-04-25T10:00:00Z')).toBeInTheDocument();
    expect(screen.getByText('2025-04-25T10:15:00Z')).toBeInTheDocument();
    
    // Check severity badges
    expect(screen.getByTestId('status-badge-ERROR')).toBeInTheDocument();
    expect(screen.getByTestId('status-badge-WARN')).toBeInTheDocument();
    expect(screen.getAllByTestId('status-badge-INFO').length).toBe(2);
  });
});

/**
 * | Test Number | Testing Environment | Test | Expected Result | Result |
 * |-----------|----------------------|------|------------------|--------|
 * | 1 | Web Browser | - Render the LogViewer component <br> - Check for initial state <br> - Check for correct rendering | should render the component with logs | + |
 * | 2 | Web Browser | - Render the LogViewer component <br> - Check for initial state <br> - Check for correct rendering | should display filtered logs count correctly | + |
 * | 3 | Web Browser | - Render the LogViewer component <br> - Check for initial state <br> - Check for correct rendering | should call onServiceChange when service filter changes | + |
 * | 4 | Web Browser | - Render the LogViewer component <br> - Check for initial state <br> - Check for correct rendering | should call onSeverityChange when severity filter changes | + |
 * | 5 | Web Browser | - Render the LogViewer component <br> - Check for initial state <br> - Check for correct rendering | should render with items per page selector | + |
 * | 6 | Web Browser | - Render the LogViewer component <br> - Check for initial state <br> - Check for correct rendering | should display table headers | + |
 * | 7 | Web Browser | - Render the LogViewer component <br> - Check for initial state <br> - Check for correct rendering | should show pagination when there are logs | + |
 * | 8 | Web Browser | - Render the LogViewer component <br> - Check for initial state <br> - Check for correct rendering | should show "No logs found" message when no logs match filters | + |
 * | 9 | Web Browser | - Render the LogViewer component <br> - Check for initial state <br> - Check for correct rendering | should display log details correctly | + |
 */