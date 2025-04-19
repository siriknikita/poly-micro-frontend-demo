import { useState, useCallback } from 'react';
import { TestItem } from '@/types';

/**
 * Hook for managing test items and their expanded state
 */
export const useTestItems = () => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [functionResults, setFunctionResults] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<boolean>(true);

  // Toggle expanded state of a test item
  const toggleExpand = useCallback((id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);

  // Expand all test items
  const expandAll = useCallback((items: TestItem[]) => {
    const newExpandedState: Record<string, boolean> = {};
    
    // Helper function to recursively process items and their children
    const processItems = (itemsToProcess: TestItem[]) => {
      itemsToProcess.forEach(item => {
        newExpandedState[item.id] = true;
        if (item.children && item.children.length > 0) {
          processItems(item.children);
        }
      });
    };
    
    processItems(items);
    setExpandedItems(prev => ({ ...prev, ...newExpandedState }));
  }, []);

  // Collapse all test items
  const collapseAll = useCallback((items: TestItem[]) => {
    const newExpandedState: Record<string, boolean> = {};
    
    // Helper function to recursively process items and their children
    const processItems = (itemsToProcess: TestItem[]) => {
      itemsToProcess.forEach(item => {
        newExpandedState[item.id] = false;
        if (item.children && item.children.length > 0) {
          processItems(item.children);
        }
      });
    };
    
    processItems(items);
    setExpandedItems(prev => ({ ...prev, ...newExpandedState }));
  }, []);

  // Run a single test
  const runTest = useCallback((test: TestItem) => {
    // In a real application, this would make an API call to run the test
    // For now, we're just simulating a test run
    console.log(`Running test: ${test.name}`);
  }, []);

  // Run all tests for a microservice
  const runAllTests = useCallback((microservice: TestItem) => {
    if (!microservice || !microservice.children) return;
    
    // Get all functions from the selected microservice
    const functions = microservice.children || [];
    
    // Create mock results for each function
    const results: Record<string, string> = {};
    functions.forEach(func => {
      const totalTests = func.children?.length || 0;
      const passedTests = Math.floor(Math.random() * (totalTests + 1)); // Mock random results
      
      results[func.id] = `Function Results (${new Date().toLocaleTimeString()}):
Status: ${passedTests === totalTests ? 'Success' : 'Partial'}
Tests: ${passedTests}/${totalTests} passed
Coverage: ${Math.floor(85 + Math.random() * 15)}%

✓ ${passedTests} test(s) passed
${totalTests - passedTests > 0 ? `✕ ${totalTests - passedTests} test(s) failed` : ''}
`;
    });

    setFunctionResults(results);
  }, []);

  // Toggle visibility of test results
  const toggleResultsVisibility = useCallback(() => {
    setShowResults(prev => !prev);
  }, []);

  return {
    expandedItems,
    functionResults,
    showResults,
    toggleExpand,
    expandAll,
    collapseAll,
    toggleResultsVisibility,
    runTest,
    runAllTests
  };
};
