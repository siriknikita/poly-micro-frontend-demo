import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../utils/test-utils';
import { Header } from '@/components/testing/Header';

describe('Header Component', () => {
  const mockProps = {
    selectedMicroservice: { name: 'Test Microservice' },
    showChat: false,
    setShowChat: vi.fn(),
    handleRunAllTests: vi.fn()
  };

  it('renders correctly with microservice name', () => {
    /**
     * Steps:
     * 1. Render the Header component
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    render(<Header {...mockProps} />);
    
    expect(screen.getByText('Testing: Test Microservice')).toBeInTheDocument();
  });
  
  it('has a button to run all tests', () => {
    /**
     * Steps:
     * 1. Render the Header component
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    render(<Header {...mockProps} />);
    
    const runButton = screen.getByRole('button', { name: /run all tests/i });
    expect(runButton).toBeInTheDocument();
  });
  
  it('calls handleRunAllTests when run button is clicked', async () => {
    /**
     * Steps:
     * 1. Render the Header component
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    const { user } = render(<Header {...mockProps} />);
    
    const runButton = screen.getByRole('button', { name: /run all tests/i });
    await user.click(runButton);
    
    expect(mockProps.handleRunAllTests).toHaveBeenCalledTimes(1);
  });
  
  it('has a button to toggle chat visibility', () => {
    /**
     * Steps:
     * 1. Render the Header component
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    render(<Header {...mockProps} />);
    
    const chatButton = screen.getByRole('button', { name: /show test assistant/i });
    expect(chatButton).toBeInTheDocument();
  });
  
  it('calls setShowChat when chat button is clicked', async () => {
    /**
     * Steps:
     * 1. Render the Header component
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    const { user } = render(<Header {...mockProps} />);
    
    const chatButton = screen.getByRole('button', { name: /show test assistant/i });
    await user.click(chatButton);
    
    expect(mockProps.setShowChat).toHaveBeenCalledWith(true);
  });
  
  it('updates chat button appearance when chat is visible', () => {
    /**
     * Steps:
     * 1. Render the Header component
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    const visibleChatProps = {
      ...mockProps,
      showChat: true
    };
    
    render(<Header {...visibleChatProps} />);
    
    const chatButton = screen.getByRole('button', { name: /hide test assistant/i });
    expect(chatButton).toBeInTheDocument();
  });
  
  it('toggles chat visibility correctly', async () => {
    /**
     * Steps:
     * 1. Render the Header component
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    const { user, rerender } = render(<Header {...mockProps} />);
    
    // Initially hidden
    let chatButton = screen.getByRole('button', { name: /show test assistant/i });
    await user.click(chatButton);
    expect(mockProps.setShowChat).toHaveBeenCalledWith(true);
    
    // Simulate chat becoming visible
    const visibleChatProps = {
      ...mockProps,
      showChat: true
    };
    rerender(<Header {...visibleChatProps} />);
    
    // Now visible, should hide on click
    chatButton = screen.getByRole('button', { name: /hide test assistant/i });
    await user.click(chatButton);
    expect(mockProps.setShowChat).toHaveBeenCalledWith(false);
  });
});

/**
 * | Test Number | Testing Environment | Test | Expected Result | Result |
 * |-----------|----------------------|------|------------------|--------|
 * | 1 | Web Browser | - Render the Header component <br> - Check for initial state <br> - Check for correct rendering | renders correctly with microservice name | + |
 * | 2 | Web Browser | - Render the Header component <br> - Check for initial state <br> - Check for correct rendering | has a button to run all tests | + |
 * | 3 | Web Browser | - Render the Header component <br> - Check for initial state <br> - Check for correct rendering | calls handleRunAllTests when run button is clicked | + |
 * | 4 | Web Browser | - Render the Header component <br> - Check for initial state <br> - Check for correct rendering | has a button to toggle chat visibility | + |
 * | 5 | Web Browser | - Render the Header component <br> - Check for initial state <br> - Check for correct rendering | calls setShowChat when chat button is clicked | + |
 * | 6 | Web Browser | - Render the Header component <br> - Check for initial state <br> - Check for correct rendering | updates chat button appearance when chat is visible | + |
 * | 7 | Web Browser | - Render the Header component <br> - Check for initial state <br> - Check for correct rendering | toggles chat visibility correctly | + |
 */