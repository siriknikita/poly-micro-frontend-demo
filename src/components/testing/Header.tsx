import React, { memo } from 'react';
import { isEqual } from 'lodash';
import { Play, MessageSquare } from 'lucide-react';

interface HeaderProps {
  selectedMicroservice: { name: string };
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  handleRunAllTests: () => void;
}

export const Header: React.FC<HeaderProps> = memo(({ 
  selectedMicroservice, 
  showChat, 
  setShowChat, 
  handleRunAllTests 
}) => (
  <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Testing: {selectedMicroservice.name}
      </h2>
      <div className="flex items-center space-x-2">
        <button
          onClick={handleRunAllTests}
          className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-indigo-600 text-white dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600"
        >
          <Play className="h-4 w-4" />
          <span>Run All Tests</span>
        </button>
        <button
          onClick={() => setShowChat(!showChat)}
          className={`p-2 rounded-lg ${showChat
            ? 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400'
          }`}
          title={showChat ? 'Hide Test Assistant' : 'Show Test Assistant'}
        >
          <MessageSquare className="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
), (prevProps, nextProps) => {
  return (
    isEqual(prevProps.selectedMicroservice, nextProps.selectedMicroservice)
    && isEqual(prevProps.showChat, nextProps.showChat)
  );
});
