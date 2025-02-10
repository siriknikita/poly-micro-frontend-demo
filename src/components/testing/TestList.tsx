import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Zap, Play } from 'lucide-react';
import { TestItem } from '@types';

interface TestListProps {
  tests: TestItem[];
  onRunTest: (test: TestItem) => void;
  onGenerateTest: (test: TestItem) => void;
  functionResults: Record<string, string>;
}

export const TestList: React.FC<TestListProps> = ({
  tests,
  onRunTest,
  onGenerateTest,
  functionResults
}) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderTestItem = (item: TestItem, depth = 0) => {
    const isExpanded = expandedItems[item.id];
    const hasChildren = item.children && item.children.length > 0;
    const paddingLeft = `${depth * 1.25 + 0.5}rem`;
    const result = functionResults[item.id];
    const showResult = item.type === 'function' && result;

    return (
      <div key={item.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
        <div 
          className={`flex flex-col ${
            depth === 0 ? 'bg-white dark:bg-gray-900' : 
            depth === 1 ? 'bg-gray-50 dark:bg-gray-800' : 
            'bg-gray-100 dark:bg-gray-700'
          }`}
        >
          <div className="flex items-center p-3" style={{ paddingLeft }}>
            {hasChildren ? (
              <button
                onClick={() => toggleExpand(item.id)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}
            
            <span className="flex-1 ml-2 text-gray-900 dark:text-gray-100">{item.name}</span>
            
            {item.type === 'function' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => onGenerateTest(item)}
                  className="p-2 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900 rounded"
                  title="Generate test"
                >
                  <Zap className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onRunTest(item)}
                  className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900 rounded"
                  title="Run test"
                >
                  <Play className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {showResult && (
            <div 
              className="ml-6 mr-4 mb-3 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300"
            >
              {result}
            </div>
          )}
        </div>
        
        {hasChildren && (
          <div className="border-l-2 border-gray-200 dark:border-gray-700 ml-4">
            {item.children.map(child => renderTestItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  {/* TODO: Remove the microservice title from being displayed as foldable section */}
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
      {tests.map(test => renderTestItem(test))}
    </div>
  );
};
