import { memo, useState, useCallback, FormEvent } from 'react';
import { X, Wand2 } from 'lucide-react';
import { TestItem } from '@/types';
import { IconButton } from './components';
import { DEFAULT_PROMPTS } from './constants';
import { BoxedWrapper } from '@/components/shared';

interface AIPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  test: TestItem;
}

export const AIPromptModal = memo<AIPromptModalProps>(({
  isOpen,
  onClose,
  test
}) => {
  // Initialize prompt with default value
  const [prompt, setPrompt] = useState(
    DEFAULT_PROMPTS.GENERATE_TEST(test.name)
  );

  // Handle form submission
  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    // Mock API call to OpenAI
    setTimeout(() => {
      onClose();
    }, 1000);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <BoxedWrapper className="w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Generate Tests: {test.name}
          </h3>
          <IconButton
            onClick={onClose}
            icon={<X className="h-5 w-5" />}
            variant="outline"
            aria-label="Close modal"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          />
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter your prompt..."
            />
          </div>

          <div className="flex justify-end">
            <IconButton
              type="submit"
              icon={<Wand2 className="h-4 w-4" />}
              label="Generate"
              variant="primary"
              size="md"
              aria-label="Generate tests"
            />
          </div>
        </form>
      </BoxedWrapper>
    </div>
  );
});
