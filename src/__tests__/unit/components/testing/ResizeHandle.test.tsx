import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../utils/test-utils';
import { ResizeHandle } from '../../../../components/testing/components/ResizeHandle';

describe('ResizeHandle Component', () => {

  it('renders correctly', () => {
    /**
     * Steps:
     * 1. Render the ResizeHandle component
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    render(<ResizeHandle onResizeStart={() => {}} />);
    
    const handle = screen.getByRole('separator');
    expect(handle).toBeInTheDocument();
    expect(handle).toHaveAttribute('aria-orientation', 'vertical');
  });
  
  it('calls onMouseDown when mouse down event occurs', async () => {
    /**
     * Steps:
     * 1. Render the ResizeHandle component
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    const handleMouseDown = vi.fn();
    const { user } = render(<ResizeHandle onResizeStart={handleMouseDown} />);
    
    await user.pointer({ target: screen.getByRole('separator'), keys: '[MouseLeft>]' });
    
    expect(handleMouseDown).toHaveBeenCalled();
  });
  
  it('renders with custom className when provided', () => {
    /**
     * Steps:
     * 1. Render the ResizeHandle component
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    render(<ResizeHandle onResizeStart={() => {}} className="custom-class" />);
    
    expect(screen.getByRole('separator')).toHaveClass('custom-class');
  });
  
  it('has proper accessibility attributes', () => {
    /**
     * Steps:
     * 1. Render the ResizeHandle component
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    render(<ResizeHandle onResizeStart={() => {}} />);
    
    const handle = screen.getByRole('separator');
    expect(handle).toHaveAttribute('aria-label', 'Resize panel');
    expect(handle).toHaveAttribute('aria-orientation', 'vertical');
  });
});

/**
 * | Test Number | Testing Environment | Test | Expected Result | Result |
 * |-----------|----------------------|------|------------------|--------|
 * | 1 | Web Browser | - Render the ResizeHandle component <br> - Check for initial state <br> - Check for correct rendering | calls onMouseDown when mouse down event occurs | + |
 * | 2 | Web Browser | - Render the ResizeHandle component <br> - Check for initial state <br> - Check for correct rendering | renders with custom className when provided | + |
 * | 3 | Web Browser | - Render the ResizeHandle component <br> - Check for initial state <br> - Check for correct rendering | has proper accessibility attributes | + |
 * | 4 | Web Browser | - Render the ResizeHandle component <br> - Check for initial state <br> - Check for correct rendering | renders correctly | + |
 */