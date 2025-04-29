import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../utils/test-utils';
import { IconButton } from '../../../../components/testing/components/IconButton';
import { X } from 'lucide-react';

describe('IconButton Component', () => {

  it('renders correctly with icon and text', () => {
    /**
     * Steps:
     * 1. Render the IconButton component
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    render(<IconButton icon={<X data-testid="x-icon" />} label="Close" />);
    
    expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });
  
  it('calls onClick handler when clicked', async () => {
    /**
     * Steps:
     * 1. Render the IconButton component
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    const mockOnClick = vi.fn();
    const { user } = render(<IconButton icon={<X />} onClick={mockOnClick} label="Close" />);
    
    await user.click(screen.getByRole('button'));
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
  
  it('applies custom class names', () => {
    /**
     * Steps:
     * 1. Render the IconButton component
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    render(
      <IconButton 
        icon={<X />}
        onClick={() => {}}
        label="Close" 
        className="test-class"
      />
    );
    
    expect(screen.getByRole('button')).toHaveClass('test-class');
  });
  
  it('renders as disabled when disabled prop is true', () => {
    /**
     * Steps:
     * 1. Render the IconButton component
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    render(<IconButton icon={<X />} onClick={() => {}} label="Close" disabled={true} />);
    
    expect(screen.getByRole('button')).toBeDisabled();
  });
  
  it('renders only icon when label is not provided', () => {
    /**
     * Steps:
     * 1. Render the IconButton component
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    render(<IconButton icon={<X data-testid="x-icon" />} onClick={() => {}} />);
    
    expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    expect(screen.queryByText('Close')).not.toBeInTheDocument();
  });

  it('renders with different variants', () => {
    /**
     * Steps:
     * 1. Render the IconButton component
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    const { rerender } = render(
      <IconButton icon={<X />} onClick={() => {}} variant="primary" />
    );
    
    // Should have primary variant class
    expect(screen.getByRole('button')).toHaveClass('bg-indigo-600');
    
    // Rerender with outline variant
    rerender(<IconButton icon={<X />} onClick={() => {}} variant="outline" />);
    expect(screen.getByRole('button')).toHaveClass('text-gray-500');
    
    // Rerender with active variant
    rerender(<IconButton icon={<X />} onClick={() => {}} variant="active" />);
    expect(screen.getByRole('button')).toHaveClass('bg-indigo-100');
  });
  
  it('renders with different sizes', () => {
    /**
     * Steps:
     * 1. Render the IconButton component
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    const { rerender } = render(
      <IconButton icon={<X />} onClick={() => {}} size="sm" />
    );
    
    // Small size
    expect(screen.getByRole('button')).toHaveClass('p-2');
    
    // Medium size
    rerender(<IconButton icon={<X />} onClick={() => {}} size="md" />);
    expect(screen.getByRole('button')).toHaveClass('px-4 py-2');
    
    // Large size
    rerender(<IconButton icon={<X />} onClick={() => {}} size="lg" />);
    expect(screen.getByRole('button')).toHaveClass('px-6 py-3');
  });
});

/**
 * | Test Number | Testing Environment | Test | Expected Result | Result |
 * |-----------|----------------------|------|------------------|--------|
 * | 1 | Web Browser | - Render the IconButton component <br> - Check for initial state <br> - Check for correct rendering | renders correctly with icon and text | + |
 * | 2 | Web Browser | - Render the IconButton component <br> - Check for initial state <br> - Check for correct rendering | calls onClick handler when clicked | + |
 * | 3 | Web Browser | - Render the IconButton component <br> - Check for initial state <br> - Check for correct rendering | applies custom class names | + |
 * | 4 | Web Browser | - Render the IconButton component <br> - Check for initial state <br> - Check for correct rendering | renders as disabled when disabled prop is true | + |
 * | 5 | Web Browser | - Render the IconButton component <br> - Check for initial state <br> - Check for correct rendering | renders only icon when label is not provided | + |
 * | 6 | Web Browser | - Render the IconButton component <br> - Check for initial state <br> - Check for correct rendering | renders with different variants | + |
 * | 7 | Web Browser | - Render the IconButton component <br> - Check for initial state <br> - Check for correct rendering | renders with different sizes | + |
 */