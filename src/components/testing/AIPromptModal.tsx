import React, { useState } from 'react';
import { X } from 'lucide-react';
import { TestItem } from '@types';

interface AIPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  test: TestItem;
}

export const AIPromptModal: React.FC<AIPromptModalProps> = ({
  isOpen,
  onClose,
  test
}) => {
  const [prompt, setPrompt] = useState(
    `Generate additional test cases for the ${test.name} function to improve coverage and edge cases.`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock API call to OpenAI
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Generate Tests: {test.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
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
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
