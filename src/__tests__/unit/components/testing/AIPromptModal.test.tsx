import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../utils/test-utils';
import AIPromptModal from '../../../../components/testing/AIPromptModal';

describe('AIPromptModal Component', () => {
  it('renders correctly when isOpen is true', () => {
    render(
      <AIPromptModal
        isOpen={true}
        onClose={() => {}}
        onSubmit={() => {}}
      />
    );
    
    expect(screen.getByTestId('ai-prompt-modal')).toBeInTheDocument();
    expect(screen.getByText(/create a test using ai/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/describe the test you want to create/i)).toBeInTheDocument();
  });
  
  it('does not render when isOpen is false', () => {
    render(
      <AIPromptModal
        isOpen={false}
        onClose={() => {}}
        onSubmit={() => {}}
      />
    );
    
    expect(screen.queryByTestId('ai-prompt-modal')).not.toBeInTheDocument();
  });
  
  it('calls onClose when close button is clicked', async () => {
    const handleClose = vi.fn();
    const { user } = render(
      <AIPromptModal
        isOpen={true}
        onClose={handleClose}
        onSubmit={() => {}}
      />
    );
    
    await user.click(screen.getByTestId('close-modal-button'));
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
  
  it('calls onSubmit with prompt value when submit button is clicked', async () => {
    const handleSubmit = vi.fn();
    const { user } = render(
      <AIPromptModal
        isOpen={true}
        onClose={() => {}}
        onSubmit={handleSubmit}
      />
    );
    
    const promptInput = screen.getByPlaceholderText(/describe the test you want to create/i);
    await user.type(promptInput, 'Create a test for login functionality');
    
    await user.click(screen.getByRole('button', { name: /generate/i }));
    
    expect(handleSubmit).toHaveBeenCalledWith('Create a test for login functionality');
  });
  
  it('disables submit button when input is empty', () => {
    render(
      <AIPromptModal
        isOpen={true}
        onClose={() => {}}
        onSubmit={() => {}}
      />
    );
    
    expect(screen.getByRole('button', { name: /generate/i })).toBeDisabled();
  });
  
  it('enables submit button when input has text', async () => {
    const { user } = render(
      <AIPromptModal
        isOpen={true}
        onClose={() => {}}
        onSubmit={() => {}}
      />
    );
    
    const promptInput = screen.getByPlaceholderText(/describe the test you want to create/i);
    await user.type(promptInput, 'Test prompt');
    
    expect(screen.getByRole('button', { name: /generate/i })).not.toBeDisabled();
  });
  
  it('shows loading state when isLoading is true', () => {
    render(
      <AIPromptModal
        isOpen={true}
        onClose={() => {}}
        onSubmit={() => {}}
        isLoading={true}
      />
    );
    
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generating/i })).toBeDisabled();
  });
  
  it('shows AI response when provided', () => {
    render(
      <AIPromptModal
        isOpen={true}
        onClose={() => {}}
        onSubmit={() => {}}
        aiResponse="This is the AI generated test"
      />
    );
    
    expect(screen.getByText('This is the AI generated test')).toBeInTheDocument();
  });
  
  it('displays error message when error is provided', () => {
    render(
      <AIPromptModal
        isOpen={true}
        onClose={() => {}}
        onSubmit={() => {}}
        error="Failed to generate test"
      />
    );
    
    expect(screen.getByText('Failed to generate test')).toBeInTheDocument();
  });
  
  it('focuses on input when modal opens', () => {
    render(
      <AIPromptModal
        isOpen={true}
        onClose={() => {}}
        onSubmit={() => {}}
      />
    );
    
    expect(screen.getByPlaceholderText(/describe the test you want to create/i)).toHaveFocus();
  });
  
  it('handles keyboard events for accessibility', async () => {
    const handleClose = vi.fn();
    const { user } = render(
      <AIPromptModal
        isOpen={true}
        onClose={handleClose}
        onSubmit={() => {}}
      />
    );
    
    // Press Escape key
    await user.keyboard('{Escape}');
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
