import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../../utils/test-utils';
import TestOutputModal from '../../../../components/testing/TestOutputModal';
import { mockTestOutput } from '../../../mocks/mockData';

describe('TestOutputModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock fetch function
    global.fetch = vi.fn();
    
    // Mock a successful response
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockTestOutput }),
    });
  });
  
  it('renders correctly when isOpen is true', () => {
    render(
      <TestOutputModal
        isOpen={true}
        onClose={() => {}}
        testId="test1"
      />
    );
    
    expect(screen.getByTestId('test-output-modal')).toBeInTheDocument();
    expect(screen.getByText(/test output/i)).toBeInTheDocument();
  });
  
  it('does not render when isOpen is false', () => {
    render(
      <TestOutputModal
        isOpen={false}
        onClose={() => {}}
        testId="test1"
      />
    );
    
    expect(screen.queryByTestId('test-output-modal')).not.toBeInTheDocument();
  });
  
  it('calls onClose when close button is clicked', async () => {
    const handleClose = vi.fn();
    const { user } = render(
      <TestOutputModal
        isOpen={true}
        onClose={handleClose}
        testId="test1"
      />
    );
    
    await user.click(screen.getByTestId('close-modal-button'));
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
  
  it('fetches test output data when opened', async () => {
    render(
      <TestOutputModal
        isOpen={true}
        onClose={() => {}}
        testId="test1"
      />
    );
    
    // Check if fetch was called with the correct URL
    expect(global.fetch).toHaveBeenCalledWith('/api/tests/test1/output');
    
    // Wait for loading to complete
    await vi.waitFor(() => expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument());
    
    // Check if the output content is displayed
    expect(screen.getByText('Test output content')).toBeInTheDocument();
  });
  
  it('shows loading state while fetching data', () => {
    // Make fetch hang so loading state remains
    (global.fetch as any).mockImplementationOnce(() => new Promise(() => {}));
    
    render(
      <TestOutputModal
        isOpen={true}
        onClose={() => {}}
        testId="test1"
      />
    );
    
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });
  
  it('shows error message when fetch fails', async () => {
    // Mock a failed response
    (global.fetch as any).mockRejectedValueOnce(new Error('Failed to fetch'));
    
    render(
      <TestOutputModal
        isOpen={true}
        onClose={() => {}}
        testId="test1"
      />
    );
    
    // Wait for loading to complete
    await vi.waitFor(() => expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument());
    
    // Check if error message is displayed
    expect(screen.getByText(/failed to load test output/i)).toBeInTheDocument();
  });
  
  it('refetches when testId changes', async () => {
    const { rerender } = render(
      <TestOutputModal
        isOpen={true}
        onClose={() => {}}
        testId="test1"
      />
    );
    
    // Wait for first fetch to complete
    await vi.waitFor(() => expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument());
    
    // Reset fetch mock
    (global.fetch as any).mockReset();
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        success: true, 
        data: { ...mockTestOutput, testId: 'test2', output: 'New output content' } 
      }),
    });
    
    // Rerender with different testId
    rerender(
      <TestOutputModal
        isOpen={true}
        onClose={() => {}}
        testId="test2"
      />
    );
    
    // Check if fetch was called with the new URL
    expect(global.fetch).toHaveBeenCalledWith('/api/tests/test2/output');
    
    // Wait for second fetch to complete
    await vi.waitFor(() => expect(screen.getByText('New output content')).toBeInTheDocument());
  });
  
  it('shows timestamp in formatted date', async () => {
    render(
      <TestOutputModal
        isOpen={true}
        onClose={() => {}}
        testId="test1"
      />
    );
    
    // Wait for loading to complete
    await vi.waitFor(() => expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument());
    
    // Check if timestamp is displayed in some format
    expect(screen.getByTestId('output-timestamp')).toBeInTheDocument();
  });
  
  it('handles keyboard events for accessibility', async () => {
    const handleClose = vi.fn();
    const { user } = render(
      <TestOutputModal
        isOpen={true}
        onClose={handleClose}
        testId="test1"
      />
    );
    
    // Press Escape key
    await user.keyboard('{Escape}');
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
