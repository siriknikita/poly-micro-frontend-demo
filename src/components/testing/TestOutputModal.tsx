import React from 'react';
import { X } from 'lucide-react';
import { TestItem, TestOutput } from '@types';
import { BoxedWrapper } from '@shared';

interface TestOutputModalProps {
  isOpen: boolean;
  onClose: () => void;
  output: TestOutput;
  test: TestItem | null;
}

export const TestOutputModal: React.FC<TestOutputModalProps> = ({
  isOpen,
  onClose,
  output,
  test
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <BoxedWrapper className="shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Test Results: {test?.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
              <span className={`px-2 py-1 rounded-full text-sm ${
                output.status === 'success'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }`}>
                {output.status}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Time</span>
              <span className="text-sm text-gray-900 dark:text-gray-100">{output.time}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Coverage</span>
              <span className="text-sm text-gray-900 dark:text-gray-100">{output.coverage}%</span>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
            <pre className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap font-mono">
              {output.output}
            </pre>
          </div>
        </div>
      </BoxedWrapper>
    </div>
  );
};
