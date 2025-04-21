import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../utils/test-utils';
import { TestItemComponent } from '@/components/testing/components/TestItem';

// Mock test item data
const mockTestItem = {
  id: 'test1',
  name: 'Test Item 1',
  description: 'Test description',
  status: 'passed',
  lastRun: '2023-01-01T12:00:00Z',
};

describe('TestItemComponent', () => {
  it('renders test item with correct name', () => {
    render(
      <TestItemComponent 
        testItem={mockTestItem} 
        isExpanded={false}
        onToggleExpand={() => {}}
        onRunTest={() => {}}
        onViewOutput={() => {}}
      />
    );
    
    expect(screen.getByText('Test Item 1')).toBeInTheDocument();
  });
  
  it('displays passed status with correct indicator', () => {
    render(
      <TestItemComponent 
        testItem={mockTestItem} 
        isExpanded={false}
        onToggleExpand={() => {}}
        onRunTest={() => {}}
        onViewOutput={() => {}}
      />
    );
    
    // This assumes your component has a specific test-id or class for status
    expect(screen.getByTestId('test-status-indicator')).toHaveClass('status-passed');
  });
  
  it('expands when clicked', async () => {
    const mockToggleExpand = vi.fn();
    const { user } = render(
      <TestItemComponent 
        testItem={mockTestItem} 
        isExpanded={false}
        onToggleExpand={mockToggleExpand}
        onRunTest={() => {}}
        onViewOutput={() => {}}
      />
    );
    
    await user.click(screen.getByText('Test Item 1'));
    
    expect(mockToggleExpand).toHaveBeenCalledWith('test1');
  });
  
  it('shows additional details when expanded', () => {
    render(
      <TestItemComponent 
        testItem={mockTestItem} 
        isExpanded={true}
        onToggleExpand={() => {}}
        onRunTest={() => {}}
        onViewOutput={() => {}}
      />
    );
    
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /run test/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view output/i })).toBeInTheDocument();
  });
  
  it('calls onRunTest when run button is clicked', async () => {
    const mockRunTest = vi.fn();
    const { user } = render(
      <TestItemComponent 
        testItem={mockTestItem} 
        isExpanded={true}
        onToggleExpand={() => {}}
        onRunTest={mockRunTest}
        onViewOutput={() => {}}
      />
    );
    
    await user.click(screen.getByRole('button', { name: /run test/i }));
    
    expect(mockRunTest).toHaveBeenCalledWith('test1');
  });
  
  it('calls onViewOutput when view output button is clicked', async () => {
    const mockViewOutput = vi.fn();
    const { user } = render(
      <TestItemComponent 
        testItem={mockTestItem} 
        isExpanded={true}
        onToggleExpand={() => {}}
        onRunTest={() => {}}
        onViewOutput={mockViewOutput}
      />
    );
    
    await user.click(screen.getByRole('button', { name: /view output/i }));
    
    expect(mockViewOutput).toHaveBeenCalledWith('test1');
  });
  
  it('displays formatted last run date', () => {
    render(
      <TestItemComponent 
        testItem={mockTestItem} 
        isExpanded={true}
        onToggleExpand={() => {}}
        onRunTest={() => {}}
        onViewOutput={() => {}}
      />
    );
    
    // The exact text depends on your date formatting
    expect(screen.getByText(/last run/i)).toBeInTheDocument();
  });
  
  it('handles failed status correctly', () => {
    const failedTestItem = { ...mockTestItem, status: 'failed' };
    
    render(
      <TestItemComponent 
        testItem={failedTestItem} 
        isExpanded={false}
        onToggleExpand={() => {}}
        onRunTest={() => {}}
        onViewOutput={() => {}}
      />
    );
    
    expect(screen.getByTestId('test-status-indicator')).toHaveClass('status-failed');
  });
});
