import { render, screen } from '@testing-library/react';
import StatusBadge from '@/components/monitoring/shared/StatusBadge';
import { variantClasses } from '@/components/monitoring/shared/statusUtils';

describe('StatusBadge', () => {
  it('should render the status text', () => {
    render(<StatusBadge status="Online" />);
    expect(screen.getByText('Online')).toBeInTheDocument();
  });

  it('should use info variant by default', () => {
    render(<StatusBadge status="Unknown" />);
    const badge = screen.getByText('Unknown');
    
    // Check that the info variant classes are applied
    const infoClasses = variantClasses.info.split(' ');
    infoClasses.forEach(className => {
      expect(badge).toHaveClass(className);
    });
  });

  it('should apply the specified variant classes', () => {
    render(<StatusBadge status="Critical" variant="error" />);
    const badge = screen.getByText('Critical');
    
    // Check that the error variant classes are applied
    const errorClasses = variantClasses.error.split(' ');
    errorClasses.forEach(className => {
      expect(badge).toHaveClass(className);
    });
  });

  it('should apply additional className if provided', () => {
    const customClass = 'custom-test-class';
    render(<StatusBadge status="Warning" className={customClass} />);
    const badge = screen.getByText('Warning');
    
    expect(badge).toHaveClass(customClass);
  });

  it('should apply base classes to all badges', () => {
    render(<StatusBadge status="Success" variant="success" />);
    const badge = screen.getByText('Success');
    
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    const baseClassList = baseClasses.split(' ');
    
    baseClassList.forEach(className => {
      expect(badge).toHaveClass(className);
    });
  });

  it('should apply all variant types correctly', () => {
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
