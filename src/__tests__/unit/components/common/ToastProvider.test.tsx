import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '../../../utils/test-utils';
import ToastProvider, { useToast } from '../../../../components/common/ToastProvider';

// Create a test component that will use the toast hook
const ToastTester = () => {
  const { showToast, hideToast, clearToasts } = useToast();
  
  return (
    <div>
      <button 
        onClick={() => showToast({ 
          message: 'Info Toast', 
          type: 'info' 
        })}
        data-testid="show-info"
      >
        Show Info
      </button>
      <button 
        onClick={() => showToast({ 
          message: 'Success Toast', 
          type: 'success',
          title: 'Success Title' 
        })}
        data-testid="show-success"
      >
        Show Success
      </button>
      <button 
        onClick={() => showToast({ 
          message: 'Error Toast', 
          type: 'error',
          autoClose: false
        })}
        data-testid="show-error"
      >
        Show Error
      </button>
      <button 
        onClick={() => clearToasts()}
        data-testid="clear-toasts"
      >
        Clear All
      </button>
      <button 
        onClick={() => hideToast('toast-id-1')}
        data-testid="hide-toast"
      >
        Hide Toast
      </button>
    </div>
  );
};

describe('ToastProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });
  
  it('renders without crashing', () => {
    render(
      <ToastProvider>
        <div>Test Content</div>
      </ToastProvider>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
  });
  
  it('shows a toast notification when showToast is called', async () => {
    const { user } = render(
      <ToastProvider>
        <ToastTester />
      </ToastProvider>
    );
    
    await user.click(screen.getByTestId('show-info'));
    
    expect(screen.getByText('Info Toast')).toBeInTheDocument();
  });
  
  it('shows multiple toast notifications', async () => {
    const { user } = render(
      <ToastProvider>
        <ToastTester />
      </ToastProvider>
    );
    
    await user.click(screen.getByTestId('show-info'));
    await user.click(screen.getByTestId('show-success'));
    
    expect(screen.getByText('Info Toast')).toBeInTheDocument();
    expect(screen.getByText('Success Toast')).toBeInTheDocument();
    expect(screen.getByText('Success Title')).toBeInTheDocument();
  });
  
  it('removes a toast after it auto-closes', async () => {
    const { user } = render(
      <ToastProvider>
        <ToastTester />
      </ToastProvider>
    );
    
    await user.click(screen.getByTestId('show-info'));
    
    expect(screen.getByText('Info Toast')).toBeInTheDocument();
    
    // Fast-forward past the default auto-close duration
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    
    expect(screen.queryByText('Info Toast')).not.toBeInTheDocument();
  });
  
  it('does not auto-close toasts with autoClose: false', async () => {
    const { user } = render(
      <ToastProvider>
        <ToastTester />
      </ToastProvider>
    );
    
    await user.click(screen.getByTestId('show-error'));
    
    expect(screen.getByText('Error Toast')).toBeInTheDocument();
    
    // Fast-forward past the default auto-close duration
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    
    // Error toast should still be visible
    expect(screen.getByText('Error Toast')).toBeInTheDocument();
  });
  
  it('clears all toasts when clearToasts is called', async () => {
    const { user } = render(
      <ToastProvider>
        <ToastTester />
      </ToastProvider>
    );
    
    // Show multiple toasts
    await user.click(screen.getByTestId('show-info'));
    await user.click(screen.getByTestId('show-success'));
    await user.click(screen.getByTestId('show-error'));
    
    // All toasts should be visible
    expect(screen.getByText('Info Toast')).toBeInTheDocument();
    expect(screen.getByText('Success Toast')).toBeInTheDocument();
    expect(screen.getByText('Error Toast')).toBeInTheDocument();
    
    // Clear all toasts
    await user.click(screen.getByTestId('clear-toasts'));
    
    // No toasts should be visible
    expect(screen.queryByText('Info Toast')).not.toBeInTheDocument();
    expect(screen.queryByText('Success Toast')).not.toBeInTheDocument();
    expect(screen.queryByText('Error Toast')).not.toBeInTheDocument();
  });
  
  it('provides a way to manually hide a specific toast', async () => {
    // Mock the toast ID generation to have a predictable ID
    vi.spyOn(global.Math, 'random').mockReturnValue(0.123);
    
    const { user } = render(
      <ToastProvider>
        <ToastTester />
      </ToastProvider>
    );
    
    // Show a toast
    await user.click(screen.getByTestId('show-info'));
    
    // Toast should be visible
    expect(screen.getByText('Info Toast')).toBeInTheDocument();
    
    // Hide the toast
    await user.click(screen.getByTestId('hide-toast'));
    
    // Toast should be hidden
    expect(screen.queryByText('Info Toast')).not.toBeInTheDocument();
    
    // Restore the original Math.random
    vi.restoreAllMocks();
  });
  
  it('positions toasts according to the position prop', () => {
    render(
      <ToastProvider position="bottom-right">
        <ToastTester />
      </ToastProvider>
    );
    
    expect(screen.getByTestId('toast-container')).toHaveClass('bottom-right');
  });
  
  it('limits the number of visible toasts', async () => {
    const { user } = render(
      <ToastProvider maxToasts={2}>
        <ToastTester />
      </ToastProvider>
    );
    
    // Show three toasts
    await user.click(screen.getByTestId('show-info'));
    await user.click(screen.getByTestId('show-success'));
    await user.click(screen.getByTestId('show-error'));
    
    // Only two should be visible (the latest ones)
    expect(screen.queryByText('Info Toast')).not.toBeInTheDocument();
    expect(screen.getByText('Success Toast')).toBeInTheDocument();
    expect(screen.getByText('Error Toast')).toBeInTheDocument();
  });
});
