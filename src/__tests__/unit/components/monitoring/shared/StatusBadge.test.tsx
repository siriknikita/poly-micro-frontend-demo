import { render, screen } from '@testing-library/react';
import StatusBadge from '@/components/monitoring/shared/StatusBadge';
import { CLASSES_BY_SEVERITY } from '@/helpers/constants';

describe('StatusBadge', () => {
  it('should render the status text', () => {
    render(<StatusBadge status="Online" />);
    expect(screen.getByText('Online')).toBeInTheDocument();
  });

  it('should use correct styling for known severity levels', () => {
    render(<StatusBadge status="INFO" />);
    const badge = screen.getByText('INFO');
    
    // Check that the INFO severity classes are applied
    const infoClasses = CLASSES_BY_SEVERITY.INFO.split(' ');
    infoClasses.forEach(className => {
      expect(badge).toHaveClass(className);
    });
  });

  it('should apply the correct severity classes', () => {
    render(<StatusBadge status="ERROR" />);
    const badge = screen.getByText('ERROR');
    
    // Check that the ERROR severity classes are applied
    const errorClasses = CLASSES_BY_SEVERITY.ERROR.split(' ');
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
    render(<StatusBadge status="Success" />);
    const badge = screen.getByText('Success');
    
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    const baseClassList = baseClasses.split(' ');
    
    baseClassList.forEach(className => {
      expect(badge).toHaveClass(className);
    });
  });

  it('should apply all severity types correctly', () => {
    const { rerender } = render(<StatusBadge status="DEBUG" />);
    let badge = screen.getByText('DEBUG');
    expect(badge).toHaveClass(...CLASSES_BY_SEVERITY.DEBUG.split(' '));
    
    rerender(<StatusBadge status="WARN" />);
    badge = screen.getByText('WARN');
    expect(badge).toHaveClass(...CLASSES_BY_SEVERITY.WARN.split(' '));
    
    rerender(<StatusBadge status="ERROR" />);
    badge = screen.getByText('ERROR');
    expect(badge).toHaveClass(...CLASSES_BY_SEVERITY.ERROR.split(' '));
    
    rerender(<StatusBadge status="INFO" />);
    badge = screen.getByText('INFO');
    expect(badge).toHaveClass(...CLASSES_BY_SEVERITY.INFO.split(' '));
  });
});
