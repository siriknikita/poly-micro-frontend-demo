import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../../utils/test-utils';
import { mockTestOutput } from '../../../mocks/mockData';
import { TestOutputModal } from '@/components/testing/TestOutputModal';

describe('TestOutputModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock fetch function
    global.fetch = vi.fn();
    
    // Mock a successful response
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockTestOutput }),
    });
  });
  
  it('renders correctly when isOpen is true', () => {
    /**
     * Steps:
     * 1. Render the TestOutputModal
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    render(
      <TestOutputModal
        isOpen={true}
        onClose={() => {}}
        output={mockTestOutput}
        test={{
          id: 'test1',
          name: 'Test 1',
          type: 'test-case'
        }}
      />
    );
    
    expect(screen.getByTestId('test-output-modal')).toBeInTheDocument();
    expect(screen.getByText(/test results/i)).toBeInTheDocument();
  });
  
  it('does not render when isOpen is false', () => {
    /**
     * Steps:
     * 1. Render the TestOutputModal
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    render(
      <TestOutputModal
        isOpen={false}
        onClose={() => {}}
        output={mockTestOutput}
        test={{
          id: 'test1',
          name: 'Test 1',
          type: 'test-case'
        }}
      />
    );
    
    expect(screen.queryByTestId('test-output-modal')).not.toBeInTheDocument();
  });
  
  it('calls onClose when close button is clicked', async () => {
    /**
     * Steps:
     * 1. Render the TestOutputModal
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    const handleClose = vi.fn();
    const { user } = render(
      <TestOutputModal
        isOpen={true}
        onClose={handleClose}
        output={mockTestOutput}
        test={{
          id: 'test1',
          name: 'Test 1',
          type: 'test-case'
        }}
      />
    );
    
    await user.click(screen.getByTestId('close-modal-button'));
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
  
  it('handles keyboard events for accessibility', async () => {
    /**
     * Steps:
     * 1. Render the TestOutputModal
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    const handleClose = vi.fn();
    const { user } = render(
      <TestOutputModal
        isOpen={true}
        onClose={handleClose}
        output={mockTestOutput}
        test={{
          id: 'test1',
          name: 'Test 1',
          type: 'test-case'
        }}
      />
    );
    
    // Press Escape key
    await user.keyboard('{Escape}');
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

/**
 * | Test Number | Testing Environment | Test | Expected Result | Result |
 * |-----------|----------------------|------|------------------|--------|
 * | 1 | Web Browser | - Render the ResizeHandle component <br> - Check for initial state <br> - Check for correct rendering | renders correctly when isOpen is true | + |
 * | 2 | Web Browser | - Render the ResizeHandle component <br> - Check for initial state <br> - Check for correct rendering | does not render when isOpen is false | + |
 * | 3 | Web Browser | - Render the ResizeHandle component <br> - Check for initial state <br> - Check for correct rendering | calls onClose when close button is clicked | + |
 * | 4 | Web Browser | - Render the ResizeHandle component <br> - Check for initial state <br> - Check for correct rendering | handles keyboard events for accessibility | + |
 */