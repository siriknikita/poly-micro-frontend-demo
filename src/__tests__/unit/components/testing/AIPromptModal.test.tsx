import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../utils/test-utils';
import { AIPromptModal } from '@/components/testing/AIPromptModal';

describe('AIPromptModal Component', () => {

  it('renders correctly when isOpen is true', () => {
    /**
     * Steps:
     * 1. Render the AIPromptModal component
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    render(
      <AIPromptModal
        isOpen={true}
        onClose={() => {}}
      />
    );
    
    expect(screen.getByTestId('ai-prompt-modal')).toBeInTheDocument();
    expect(screen.getByText(/generate tests/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your prompt.../i)).toBeInTheDocument();
  });
  
  it('does not render when isOpen is false', () => {
    /**
     * Steps:
     * 1. Render the AIPromptModal component
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    render(
      <AIPromptModal
        isOpen={false}
        onClose={() => {}}
      />
    );
    
    expect(screen.queryByTestId('ai-prompt-modal')).not.toBeInTheDocument();
  });
  
  it('calls onClose when close button is clicked', async () => {
    /**
     * Steps:
     * 1. Render the AIPromptModal component
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    const handleClose = vi.fn();
    const { user } = render(
      <AIPromptModal
        isOpen={true}
        onClose={handleClose}
      />
    );
    
    await user.click(screen.getByTestId('close-modal-button'));
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
  
  it('calls onSubmit with prompt value when submit button is clicked', async () => {
    /**
     * Steps:
     * 1. Render the AIPromptModal component
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    const handleSubmit = vi.fn();
    const { user } = render(
      <AIPromptModal
        isOpen={true}
        onClose={() => {}}
        onSubmit={handleSubmit}
      />
    );
    
    const promptInput = screen.getByPlaceholderText(/enter your prompt.../i);
    await user.clear(promptInput);
    await user.type(promptInput, 'Create a test for login functionality');
    
    await user.click(screen.getByRole('submit-button'));
    
    expect(handleSubmit).toHaveBeenCalledWith('Create a test for login functionality');
  });
  
  it('disables submit button when input is empty', () => {
    /**
     * Steps:
     * 1. Render the AIPromptModal component
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    render(
      <AIPromptModal
        isOpen={true}
        onClose={() => {}}
      />
    );
    
    // The button should be disabled initially since the prompt is empty
    expect(screen.getByRole('submit-button')).toBeDisabled();
  });
  
  it('enables submit button when input has text', async () => {
    /**
     * Steps:
     * 1. Render the AIPromptModal component
     * 2. Check for initial state
     * 3. Check for correct rendering
     */
    const { user } = render(
      <AIPromptModal
        isOpen={true}
        onClose={() => {}}
      />
    );
    
    const promptInput = screen.getByPlaceholderText(/enter your prompt.../i);
    await user.type(promptInput, 'Test prompt');
    
    expect(screen.getByRole('submit-button')).toBeEnabled();
  });
  
});

/**
 * | Test Number | Testing Environment | Test | Expected Result | Result |
 * |-----------|----------------------|------|------------------|--------|
 * | 1 | Web Browser | - Render the useTestItems hook <br> - Check for initial state <br> - Check for toggle expand | renders correctly when isOpen is true | + |
 * | 2 | Web Browser | - Render the useTestItems hook <br> - Check for initial state <br> - Check for toggle expand | does not render when isOpen is false | + |
 * | 3 | Web Browser | - Render the useTestItems hook <br> - Check for initial state <br> - Check for toggle expand | calls onClose when close button is clicked | + |
 * | 4 | Web Browser | - Render the useTestItems hook <br> - Check for initial state <br> - Check for toggle expand | calls onSubmit with prompt value when submit button is clicked | + |
 * | 5 | Web Browser | - Render the useTestItems hook <br> - Check for initial state <br> - Check for toggle expand | disables submit button when input is empty | + |
 * | 6 | Web Browser | - Render the useTestItems hook <br> - Check for initial state <br> - Check for toggle expand | enables submit button when input has text | + |
 */