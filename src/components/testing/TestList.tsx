import { memo, useState } from 'react';
import { TestItem as TestItemType } from '@/types';
import { useTestItems } from './hooks';
import { TestItemComponent, IconButton } from './components';
import { ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';

interface TestListProps {
  tests: TestItemType[];
  onRunTest: (test: TestItemType) => void;
  onGenerateTest: (test: TestItemType) => void;
  functionResults: Record<string, string>;
}

export const TestList = memo<TestListProps>(({
  tests,
  onRunTest,
  onGenerateTest,
  functionResults
}) => {
  // State to track if all items are expanded
  const [areAllExpanded, setAreAllExpanded] = useState(false);
  
  // Use our custom hook for managing test items
  const { expandedItems, toggleExpand, expandAll, collapseAll, showResults, toggleResultsVisibility } = useTestItems();
  
  // Check if there are any results to display
  const hasResults = Object.keys(functionResults).length > 0;

  /**
   * Recursively render test items and their children
   */
  const renderTestItem = (item: TestItemType, depth = 0) => {
    const isExpanded = expandedItems[item.id];
    const hasChildren = item.children && item.children.length > 0;
    const result = functionResults[item.id];

    return (
      <div key={item.id}>
        <TestItemComponent
          item={item}
          depth={depth}
          isExpanded={isExpanded}
          onToggleExpand={toggleExpand}
          onRunTest={onRunTest}
          onGenerateTest={onGenerateTest}
          result={result}
          showResults={showResults}
        />
        
        {hasChildren && isExpanded && (
          <div className="border-l-2 border-gray-200 dark:border-gray-700 ml-4">
            {item.children?.map(child => renderTestItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Handle toggling all items
  const handleToggleAll = () => {
    if (areAllExpanded) {
      collapseAll(tests);
    } else {
      expandAll(tests);
    }
    setAreAllExpanded(!areAllExpanded);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
      <div className="flex justify-start mb-3 space-x-4">
        <div className="flex items-center">
          <IconButton
            onClick={handleToggleAll}
            icon={areAllExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            title={areAllExpanded ? 'Collapse all' : 'Expand all functions'}
            aria-label={areAllExpanded ? 'Collapse all tests' : 'Expand all tests'}
            variant="outline"
          />
          <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            {areAllExpanded ? 'Collapse all' : 'Expand all functions'}
          </span>
        </div>
        
        {hasResults && (
          <div className="flex items-center">
            <IconButton
              onClick={toggleResultsVisibility}
              icon={showResults ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              title={showResults ? 'Hide test results' : 'Show test results'}
              aria-label={showResults ? 'Hide test results' : 'Show test results'}
              variant="outline"
            />
            <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              {showResults ? 'Hide results' : 'Show results'}
            </span>
          </div>
        )}
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
        {tests.map(test => renderTestItem(test))}
      </div>
    </div>
  );
});
