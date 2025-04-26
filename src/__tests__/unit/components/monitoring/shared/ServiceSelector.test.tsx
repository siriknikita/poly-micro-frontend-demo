import { render, screen, fireEvent } from '@testing-library/react';
import { ServiceSelector } from '@/components/monitoring/shared/ServiceSelector';
import { Service } from '@/types';

describe('ServiceSelector', () => {
  const mockServices: Service[] = [
    { id: '1', name: 'Service 1', url: 'http://service1.com' },
    { id: '2', name: 'Service 2', url: 'http://service2.com' },
    { id: '3', name: 'Service 3', url: 'http://service3.com' }
  ];
  
  const mockOnServiceSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with default label', () => {
    render(
      <ServiceSelector
        selectedService={null}
        services={mockServices}
        onServiceSelect={mockOnServiceSelect}
      />
    );
    
    expect(screen.getByText('Select a service')).toBeInTheDocument();
  });

  it('should render with custom label', () => {
    const customLabel = 'Choose a microservice';
    render(
      <ServiceSelector
        selectedService={null}
        services={mockServices}
        onServiceSelect={mockOnServiceSelect}
        label={customLabel}
      />
    );
    
    expect(screen.getByText(customLabel)).toBeInTheDocument();
  });

  it('should render all provided services as options', () => {
    render(
      <ServiceSelector
        selectedService={null}
        services={mockServices}
        onServiceSelect={mockOnServiceSelect}
      />
    );
    
    mockServices.forEach(service => {
      expect(screen.getByText(service.name)).toBeInTheDocument();
    });
  });

  it('should show "All Services" option when showAllOption is true', () => {
    render(
      <ServiceSelector
        selectedService={null}
        services={mockServices}
        onServiceSelect={mockOnServiceSelect}
        showAllOption={true}
      />
    );
    
    expect(screen.getByText('All Services')).toBeInTheDocument();
  });

  it('should not show "All Services" option when showAllOption is false', () => {
    render(
      <ServiceSelector
        selectedService={null}
        services={mockServices}
        onServiceSelect={mockOnServiceSelect}
        showAllOption={false}
      />
    );
    
    expect(screen.queryByText('All Services')).not.toBeInTheDocument();
  });

  it('should select the provided selectedService', () => {
    render(
      <ServiceSelector
        selectedService="Service 2"
        services={mockServices}
        onServiceSelect={mockOnServiceSelect}
      />
    );
    
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveValue('Service 2');
  });

  it('should call onServiceSelect with the selected service name', () => {
    render(
      <ServiceSelector
        selectedService={null}
        services={mockServices}
        onServiceSelect={mockOnServiceSelect}
      />
    );
    
    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'Service 3' } });
    
    expect(mockOnServiceSelect).toHaveBeenCalledWith('Service 3');
  });

  it('should apply custom className if provided', () => {
    const customClass = 'custom-test-class';
    render(
      <ServiceSelector
        selectedService={null}
        services={mockServices}
        onServiceSelect={mockOnServiceSelect}
        className={customClass}
      />
    );
    
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveClass(customClass);
  });

  it('should handle empty services array', () => {
    render(
      <ServiceSelector
        selectedService={null}
        services={[]}
        onServiceSelect={mockOnServiceSelect}
      />
    );
    
    // Should just render the default option
    expect(screen.getByText('Select a service')).toBeInTheDocument();
    expect(screen.getAllByRole('option').length).toBe(1);
  });
});
