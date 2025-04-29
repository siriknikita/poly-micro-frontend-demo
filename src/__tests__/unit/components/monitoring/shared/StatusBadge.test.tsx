import { render, screen } from '@testing-library/react';
import StatusBadge from '@/components/monitoring/shared/StatusBadge';
import { variantClasses } from '@/components/monitoring/shared/statusUtils';

describe('StatusBadge', () => {

  it('should render the status text', () => {
    /**
     * Steps:
     * 1. Render the StatusBadge component
     * 2. Check for initial state
     * 3. Check for status text
     */
    render(<StatusBadge status="Online" />);
    expect(screen.getByText('Online')).toBeInTheDocument();
  });

  it('should use info variant by default', () => {
    /**
     * Steps:
     * 1. Render the StatusBadge component
     * 2. Check for initial state
     * 3. Check for info variant
     */
    render(<StatusBadge status="Unknown" />);
    const badge = screen.getByText('Unknown');
    
    // Check that the info variant classes are applied
    const infoClasses = variantClasses.info.split(' ');
    infoClasses.forEach(className => {
      expect(badge).toHaveClass(className);
    });
  });

  it('should apply the specified variant classes', () => {
    /**
     * Steps:
     * 1. Render the StatusBadge component
     * 2. Check for initial state
     * 3. Check for specified variant classes
     */
    render(<StatusBadge status="Critical" variant="error" />);
    const badge = screen.getByText('Critical');
    
    // Check that the error variant classes are applied
    const errorClasses = variantClasses.error.split(' ');
    errorClasses.forEach(className => {
      expect(badge).toHaveClass(className);
    });
  });

  it('should apply additional className if provided', () => {
    /**
     * Steps:
     * 1. Render the StatusBadge component
     * 2. Check for initial state
     * 3. Check for custom class
     */
    const customClass = 'custom-test-class';
    render(<StatusBadge status="Warning" className={customClass} />);
    const badge = screen.getByText('Warning');
    
    expect(badge).toHaveClass(customClass);
  });

  it('should apply base classes to all badges', () => {
    /**
     * Steps:
     * 1. Render the StatusBadge component
     * 2. Check for initial state
     * 3. Check for base classes
     */
    render(<StatusBadge status="Success" variant="success" />);
    const badge = screen.getByText('Success');
    
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    const baseClassList = baseClasses.split(' ');
    
    baseClassList.forEach(className => {
      expect(badge).toHaveClass(className);
    });
  });

  it('should apply all variant types correctly', () => {
    /**
     * Steps:
     * 1. Render the StatusBadge component
     * 2. Check for initial state
     * 3. Check for all variant types
     */
    const { rerender } = render(<StatusBadge status="Success" variant="success" />);
    let badge = screen.getByText('Success');
    expect(badge).toHaveClass(...variantClasses.success.split(' '));
    
    rerender(<StatusBadge status="Warning" variant="warning" />);
    badge = screen.getByText('Warning');
    expect(badge).toHaveClass(...variantClasses.warning.split(' '));
    
    rerender(<StatusBadge status="Error" variant="error" />);
    badge = screen.getByText('Error');
    expect(badge).toHaveClass(...variantClasses.error.split(' '));
    
    rerender(<StatusBadge status="Info" variant="info" />);
    badge = screen.getByText('Info');
    expect(badge).toHaveClass(...variantClasses.info.split(' '));
  });
});

/**
 * | Test Number | Testing Environment | Test | Expected Result | Result |
 * |-----------|----------------------|------|------------------|--------|
 * | 1 | Web Browser | - Render the StatusBadge component <br> - Check for initial state <br> - Check for status text | should render the status text | + |
 * | 2 | Web Browser | - Render the StatusBadge component <br> - Check for initial state <br> - Check for status text | should use info variant by default | + |
 * | 3 | Web Browser | - Render the StatusBadge component <br> - Check for initial state <br> - Check for status text | should apply the specified variant classes | + |
 * | 4 | Web Browser | - Render the StatusBadge component <br> - Check for initial state <br> - Check for status text | should apply additional className if provided | + |
 * | 5 | Web Browser | - Render the StatusBadge component <br> - Check for initial state <br> - Check for status text | should apply base classes to all badges | + |
 * | 6 | Web Browser | - Render the StatusBadge component <br> - Check for initial state <br> - Check for status text | should apply all variant types correctly | + |
 */ 