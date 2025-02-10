import React, { memo } from 'react';
import { isEqual } from 'lodash';
import { TestList } from './TestList';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { TestItem } from '@types';
import { mockTestData } from '@data/mockTestData';

interface TestListContainerProps {
  selectedMicroservice: TestItem;
  functionResults: Record<string, string>;
  handleGenerateTest: (test: TestItem) => void;
  handleMicroserviceChange: (direction: 'up' | 'down') => void;
}

export const TestListContainer: React.FC<TestListContainerProps> = memo(({
  selectedMicroservice,
  functionResults,
  handleGenerateTest,
  handleMicroserviceChange,
}) => (
  <div className="flex-1 relative">
    <div className="p-4 overflow-auto h-full">
      <TestList
        tests={[selectedMicroservice]}
        onRunTest={() => {}} // Placeholder for individual test run handler
        onGenerateTest={handleGenerateTest}
        functionResults={functionResults}
      />
    </div>

    <div className="absolute bottom-6 right-6 flex flex-col space-y-2">
      <button
        onClick={() => handleMicroserviceChange('up')}
        className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
        title={`Previous: ${mockTestData[(mockTestData.findIndex(ms => ms.id === selectedMicroservice.id) - 1 + mockTestData.length) % mockTestData.length].name}`}
      >
        <ChevronUp className="h-5 w-5" />
      </button>
      <button
        onClick={() => handleMicroserviceChange('down')}
        className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
        title={`Next: ${mockTestData[(mockTestData.findIndex(ms => ms.id === selectedMicroservice.id) + 1) % mockTestData.length].name}`}
      >
        <ChevronDown className="h-5 w-5" />
      </button>
    </div>
  </div>
), (prevProps, nextProps) => {
  return (
    isEqual(prevProps.selectedMicroservice, nextProps.selectedMicroservice) &&
    isEqual(prevProps.functionResults, nextProps.functionResults)
  );
});
