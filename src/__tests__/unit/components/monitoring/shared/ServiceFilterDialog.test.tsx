// React is used implicitly in JSX
import { render, screen, fireEvent } from '@testing-library/react';
import { ServiceFilterDialog } from '@/components/monitoring/shared/ServiceFilterDialog';
import { Service } from '@/types';
import { FilterGroup } from '@/components/monitoring/hooks/useServiceFilters';

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Plus: () => <span data-testid="plus-icon">+</span>,
  X: () => <span data-testid="x-icon">X</span>
}));

describe('ServiceFilterDialog', () => {
  // Test data
  const mockServices: Service[] = [
    { id: '1', name: 'API Gateway', status: 'Online', health: 'Healthy' },
    { id: '2', name: 'Auth Service', status: 'Online', health: 'Degraded' },
    { id: '3', name: 'Database Service', status: 'Offline', health: 'Error' }
  ];

  // Mock handler functions
  const mockHandlers = {
    onClose: jest.fn(),
    onApplyFilter: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    /**
     * Steps:
     * 1. Render the ServiceFilterDialog component
     * 2. Check for initial state
     * 3. Check for not rendered dialog
     */
    render(
      <ServiceFilterDialog
        isOpen={false}
        services={mockServices}
        {...mockHandlers}
      />
    );

    expect(screen.queryByText('Add Filter')).not.toBeInTheDocument();
    expect(screen.queryByText('Filter Operator')).not.toBeInTheDocument();
  });

  it('should render with default values when opened for adding', () => {
    /**
     * Steps:
     * 1. Render the ServiceFilterDialog component
     * 2. Check for initial state
     * 3. Check for default values
     */
    render(
      <ServiceFilterDialog
        isOpen={true}
        services={mockServices}
        {...mockHandlers}
      />
    );

    // Check title
    expect(screen.getByText('Add Filter')).toBeInTheDocument();
    
    // Check operator dropdown
    const operatorSelect = screen.getByText('AND (All conditions must match)');
    expect(operatorSelect).toBeInTheDocument();
    
    // Check field and value selects
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Select a value')).toBeInTheDocument();
    
    // Check buttons
    expect(screen.getByText('Add condition')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
    expect(screen.getByText('Apply Filter')).toBeInTheDocument();
  });

  it('should render with initial values when opened for editing', () => {
    /**
     * Steps:
     * 1. Render the ServiceFilterDialog component
     * 2. Check for initial state
     * 3. Check for initial values
     */
    const initialFilter: FilterGroup = {
      operator: 'NOT',
      conditions: [
        { field: 'health', value: 'Error' }
      ]
    };

    render(
      <ServiceFilterDialog
        isOpen={true}
        services={mockServices}
        initialFilterGroup={initialFilter}
        {...mockHandlers}
      />
    );

    // Check title
    expect(screen.getByText('Edit Filter')).toBeInTheDocument();
    
    // Check that values are pre-selected
    expect(screen.getByText('NOT (None of the conditions should match)')).toBeInTheDocument();
    
    // Check that the field is pre-selected
    const fieldSelects = screen.getAllByRole('combobox');
    expect(fieldSelects[1]).toHaveValue('health');
  });

  it('should close when X button is clicked', () => {
    /**
     * Steps:
     * 1. Render the ServiceFilterDialog component
     * 2. Check for initial state
     * 3. Check for close button
     */
    render(
      <ServiceFilterDialog
        isOpen={true}
        services={mockServices}
        {...mockHandlers}
      />
    );

    // Click close button
    fireEvent.click(screen.getByLabelText('Close'));
    expect(mockHandlers.onClose).toHaveBeenCalledTimes(1);
  });

  it('should add a new condition when Add condition button is clicked', () => {
    /**
     * Steps:
     * 1. Render the ServiceFilterDialog component
     * 2. Check for initial state
     * 3. Check for add condition button
     */
    render(
      <ServiceFilterDialog
        isOpen={true}
        services={mockServices}
        {...mockHandlers}
      />
    );

    // Initially should have one condition
    expect(screen.getAllByText('Status')).toHaveLength(1);
    
    // Click add condition button
    fireEvent.click(screen.getByText('Add condition'));
    
    // Should now have two conditions
    expect(screen.getAllByText('Status')).toHaveLength(2);
  });

  it('should remove a condition when remove button is clicked', () => {
    /**
     * Steps:
     * 1. Render the ServiceFilterDialog component
     * 2. Check for initial state
     * 3. Check for remove button
     */
    render(
      <ServiceFilterDialog
        isOpen={true}
        services={mockServices}
        {...mockHandlers}
      />
    );

    // Add a second condition
    fireEvent.click(screen.getByText('Add condition'));
    expect(screen.getAllByText('Status')).toHaveLength(2);
    
    // Get all remove buttons by aria-label
    const removeButtons = screen.getAllByRole('button', { name: /remove condition/i });
    
    // Click the second remove button
    fireEvent.click(removeButtons[1]);
    
    // Should now have one condition again
    expect(screen.getAllByText('Status')).toHaveLength(1);
  });

  it('should not remove the last condition', () => {
    /**
     * Steps:
     * 1. Render the ServiceFilterDialog component
     * 2. Check for initial state
     * 3. Check for last condition
     */
    render(
      <ServiceFilterDialog
        isOpen={true}
        services={mockServices}
        {...mockHandlers}
      />
    );

    // Get the remove button by aria-label
    const removeButton = screen.getByRole('button', { name: /remove condition/i });
    
    // Try to remove the only condition
    fireEvent.click(removeButton);
    
    // Should still have one condition
    expect(screen.getAllByText('Status')).toHaveLength(1);
  });

  it('should update operator when changed', () => {
    /**
     * Steps:
     * 1. Render the ServiceFilterDialog component
     * 2. Check for initial state
     * 3. Check for operator update
     */
    render(
      <ServiceFilterDialog
        isOpen={true}
        services={mockServices}
        {...mockHandlers}
      />
    );

    // Get the operator select
    const operatorSelect = screen.getAllByRole('combobox')[0];
    
    // Change to OR
    fireEvent.change(operatorSelect, { target: { value: 'OR' } });
    expect(screen.getByText('OR (Any condition can match)')).toBeInTheDocument();
    
    // Change to NOT
    fireEvent.change(operatorSelect, { target: { value: 'NOT' } });
    expect(screen.getByText('NOT (None of the conditions should match)')).toBeInTheDocument();
  });

  it('should update field and value when changed', () => {
    /**
     * Steps:
     * 1. Render the ServiceFilterDialog component
     * 2. Check for initial state
     * 3. Check for field and value update
     */
    render(
      <ServiceFilterDialog
        isOpen={true}
        services={mockServices}
        {...mockHandlers}
      />
    );

    // Get the field and value selects
    const fieldSelect = screen.getAllByRole('combobox')[1];
    const valueSelect = screen.getAllByRole('combobox')[2];
    
    // Change field to health
    fireEvent.change(fieldSelect, { target: { value: 'health' } });
    
    // Change value to Healthy
    fireEvent.change(valueSelect, { target: { value: 'Healthy' } });
    
    // Apply the filter
    fireEvent.click(screen.getByText('Apply Filter'));
    
    // Check that onApplyFilter was called with the right filter
    expect(mockHandlers.onApplyFilter).toHaveBeenCalledWith({
      operator: 'AND',
      conditions: [
        { field: 'health', value: 'Healthy' }
      ]
    });
  });

  it('should reset form when Reset button is clicked', () => {
    /**
     * Steps:
     * 1. Render the ServiceFilterDialog component
     * 2. Check for initial state
     * 3. Check for reset button
     */
    render(
      <ServiceFilterDialog
        isOpen={true}
        services={mockServices}
        {...mockHandlers}
      />
    );

    // Change operator to NOT
    const operatorSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(operatorSelect, { target: { value: 'NOT' } });
    
    // Change field to health
    const fieldSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(fieldSelect, { target: { value: 'health' } });
    
    // Add another condition
    fireEvent.click(screen.getByText('Add condition'));
    
    // Click reset button
    fireEvent.click(screen.getByText('Reset'));
    
    // Should reset to default values
    expect(screen.getByText('AND (All conditions must match)')).toBeInTheDocument();
    expect(screen.getAllByText('Status')).toHaveLength(1);
  });

  it('should reset to initial values when editing and Reset is clicked', () => {
    /**
     * Steps:
     * 1. Render the ServiceFilterDialog component
     * 2. Check for initial state
     * 3. Check for reset button
     */
    const initialFilter: FilterGroup = {
      operator: 'NOT',
      conditions: [
        { field: 'health', value: 'Error' }
      ]
    };

    render(
      <ServiceFilterDialog
        isOpen={true}
        services={mockServices}
        initialFilterGroup={initialFilter}
        {...mockHandlers}
      />
    );

    // Change operator to AND
    const operatorSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(operatorSelect, { target: { value: 'AND' } });
    
    // Click reset button
    fireEvent.click(screen.getByText('Reset'));
    
    // Should reset to initial values
    expect(screen.getByText('NOT (None of the conditions should match)')).toBeInTheDocument();
  });

  it('should apply filter when Apply Filter button is clicked', () => {
    /**
     * Steps:
     * 1. Render the ServiceFilterDialog component
     * 2. Check for initial state
     * 3. Check for apply button
     */
    render(
      <ServiceFilterDialog
        isOpen={true}
        services={mockServices}
        {...mockHandlers}
      />
    );

    // Set up a filter
    const operatorSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(operatorSelect, { target: { value: 'OR' } });
    
    const fieldSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(fieldSelect, { target: { value: 'status' } });
    
    const valueSelect = screen.getAllByRole('combobox')[2];
    fireEvent.change(valueSelect, { target: { value: 'Online' } });
    
    // Apply the filter
    fireEvent.click(screen.getByText('Apply Filter'));
    
    // Check that onApplyFilter was called with the right filter
    expect(mockHandlers.onApplyFilter).toHaveBeenCalledWith({
      operator: 'OR',
      conditions: [
        { field: 'status', value: 'Online' }
      ]
    });
  });

  it('should not apply filter with empty values', () => {
    /**
     * Steps:
     * 1. Render the ServiceFilterDialog component
     * 2. Check for initial state
     * 3. Check for apply button
     */
    render(
      <ServiceFilterDialog
        isOpen={true}
        services={mockServices}
        {...mockHandlers}
      />
    );
    
    // Apply the filter without selecting any values
    fireEvent.click(screen.getByText('Apply Filter'));
    
    // onApplyFilter should not be called
    expect(mockHandlers.onApplyFilter).not.toHaveBeenCalled();
  });
});

/**
 * | Test Number | Testing Environment | Test | Expected Result | Result |
 * |-----------|----------------------|------|------------------|--------|
 * | 1 | Web Browser | - Render the ServiceFilterDialog component <br> - Check for initial state <br> - Check for correct rendering | should not render when isOpen is false | + |
 * | 2 | Web Browser | - Render the ServiceFilterDialog component <br> - Check for initial state <br> - Check for correct rendering | should render with default values when opened for adding | + |
 * | 3 | Web Browser | - Render the ServiceFilterDialog component <br> - Check for initial state <br> - Check for correct rendering | should render with initial values when opened for editing | + |
 * | 4 | Web Browser | - Render the ServiceFilterDialog component <br> - Check for initial state <br> - Check for correct rendering | should close when X button is clicked | + |
 * | 5 | Web Browser | - Render the ServiceFilterDialog component <br> - Check for initial state <br> - Check for correct rendering | should add a new condition when Add condition button is clicked | + |
 * | 6 | Web Browser | - Render the ServiceFilterDialog component <br> - Check for initial state <br> - Check for correct rendering | should remove a condition when remove button is clicked | + |
 * | 7 | Web Browser | - Render the ServiceFilterDialog component <br> - Check for initial state <br> - Check for correct rendering | should not remove the last condition | + |
 * | 8 | Web Browser | - Render the ServiceFilterDialog component <br> - Check for initial state <br> - Check for correct rendering | should update operator when changed | + |
 * | 9 | Web Browser | - Render the ServiceFilterDialog component <br> - Check for initial state <br> - Check for correct rendering | should update field and value when changed | + |
 * | 10 | Web Browser | - Render the ServiceFilterDialog component <br> - Check for initial state <br> - Check for correct rendering | should reset form when Reset button is clicked | + |
 * | 11 | Web Browser | - Render the ServiceFilterDialog component <br> - Check for initial state <br> - Check for correct rendering | should reset to initial values when editing and Reset is clicked | + |
 * | 12 | Web Browser | - Render the ServiceFilterDialog component <br> - Check for initial state <br> - Check for correct rendering | should apply filter when Apply Filter button is clicked | + |
 * | 13 | Web Browser | - Render the ServiceFilterDialog component <br> - Check for initial state <br> - Check for correct rendering | should not apply filter with empty values | + |
 */