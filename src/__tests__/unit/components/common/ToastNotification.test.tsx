import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '../../../utils/test-utils';
import ToastNotification from '../../../../components/common/ToastNotification';

describe('ToastNotification Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders correctly with message', () => {
    render(
      <ToastNotification
        id="toast-1"
        message="Test notification"
        type="info"
        onClose={() => {}}
      />
    );
    
    expect(screen.getByText('Test notification')).toBeInTheDocument();
    expect(screen.getByTestId('toast-container')).toHaveClass('toast-info');
  });
  
  it('renders different types of notifications with appropriate styling', () => {
    const { rerender } = render(
      <ToastNotification
        id="toast-1"
        message="Success notification"
        type="success"
        onClose={() => {}}
      />
    );
    
    expect(screen.getByTestId('toast-container')).toHaveClass('toast-success');
    
    rerender(
      <ToastNotification
        id="toast-1"
        message="Error notification"
        type="error"
        onClose={() => {}}
      />
    );
    
    expect(screen.getByTestId('toast-container')).toHaveClass('toast-error');
    
    rerender(
      <ToastNotification
        id="toast-1"
        message="Warning notification"
        type="warning"
        onClose={() => {}}
      />
    );
    
    expect(screen.getByTestId('toast-container')).toHaveClass('toast-warning');
  });
  
  it('calls onClose when close button is clicked', async () => {
    const handleClose = vi.fn();
    const { user } = render(
      <ToastNotification
        id="toast-1"
        message="Test notification"
        type="info"
        onClose={handleClose}
      />
    );
    
    await user.click(screen.getByTestId('close-toast-button'));
    
    expect(handleClose).toHaveBeenCalledWith('toast-1');
  });
  
  it('auto-closes after duration if autoClose is true', () => {
    const handleClose = vi.fn();
    render(
      <ToastNotification
        id="toast-1"
        message="Test notification"
        type="info"
        onClose={handleClose}
        autoClose={true}
        duration={3000}
      />
    );
    
    // Fast-forward time to trigger auto-close
    vi.advanceTimersByTime(3000);
    
    expect(handleClose).toHaveBeenCalledWith('toast-1');
  });
  
  it('does not auto-close if autoClose is false', () => {
    const handleClose = vi.fn();
    render(
      <ToastNotification
        id="toast-1"
        message="Test notification"
        type="info"
        onClose={handleClose}
        autoClose={false}
        duration={3000}
      />
    );
    
    // Fast-forward time
    vi.advanceTimersByTime(3000);
    
    expect(handleClose).not.toHaveBeenCalled();
  });
  
  it('renders with an icon appropriate to the notification type', () => {
    const { rerender } = render(
      <ToastNotification
        id="toast-1"
        message="Success notification"
        type="success"
        onClose={() => {}}
      />
    );
    
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    
    rerender(
      <ToastNotification
        id="toast-1"
        message="Error notification"
        type="error"
        onClose={() => {}}
      />
    );
    
    expect(screen.getByTestId('error-icon')).toBeInTheDocument();
  });
  
  it('renders title when provided', () => {
    render(
      <ToastNotification
        id="toast-1"
        title="Notification Title"
        message="Test notification"
        type="info"
        onClose={() => {}}
      />
    );
    
    expect(screen.getByText('Notification Title')).toBeInTheDocument();
  });
  
  it('renders action button when provided', async () => {
    const handleAction = vi.fn();
    const { user } = render(
      <ToastNotification
        id="toast-1"
        message="Test notification"
        type="info"
        onClose={() => {}}
        actionLabel="Undo"
        onAction={handleAction}
      />
    );
    
    const actionButton = screen.getByRole('button', { name: 'Undo' });
    expect(actionButton).toBeInTheDocument();
    
    await user.click(actionButton);
    
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
  
  it('has accessible attributes', () => {
    render(
      <ToastNotification
        id="toast-1"
        message="Test notification"
        type="info"
        onClose={() => {}}
      />
    );
    
    const toastContainer = screen.getByTestId('toast-container');
    
    expect(toastContainer).toHaveAttribute('role', 'alert');
    expect(toastContainer).toHaveAttribute('aria-live', 'assertive');
  });
  
  it('pauses auto-close timer when hovered', async () => {
    const handleClose = vi.fn();
    const { user } = render(
      <ToastNotification
        id="toast-1"
        message="Test notification"
        type="info"
        onClose={handleClose}
        autoClose={true}
        duration={3000}
      />
    );
    
    // Hover over toast
    await user.hover(screen.getByTestId('toast-container'));
    
    // Fast-forward time
    vi.advanceTimersByTime(3000);
    
    // Should not close while hovered
    expect(handleClose).not.toHaveBeenCalled();
    
    // Mouse leave
    await user.unhover(screen.getByTestId('toast-container'));
    
    // Should close after duration
    vi.advanceTimersByTime(3000);
    expect(handleClose).toHaveBeenCalledWith('toast-1');
  });
});
