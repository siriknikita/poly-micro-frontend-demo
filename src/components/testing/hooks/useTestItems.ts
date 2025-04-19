import { useState, useCallback, useEffect } from 'react';
import { TestItem } from '@/types';

// Local storage keys
const EXPANDED_ITEMS_STORAGE_KEY = 'poly-micro-manager-expanded-items';
const FUNCTION_RESULTS_STORAGE_KEY = 'poly-micro-manager-function-results';
const SHOW_RESULTS_STORAGE_KEY = 'poly-micro-manager-show-results';

/**
 * Hook for managing test items and their expanded state
 */
export const useTestItems = () => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [functionResults, setFunctionResults] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<boolean>(true);
  const [currentMicroserviceId, setCurrentMicroserviceId] = useState<string | null>(null);

  // Load expanded items, function results, and show results state from localStorage on initial load
  useEffect(() => {
    if (!currentMicroserviceId) return;
    
    try {
      // Load expanded items
      const storedExpandedData = localStorage.getItem(EXPANDED_ITEMS_STORAGE_KEY);
      if (storedExpandedData) {
        const parsedData = JSON.parse(storedExpandedData);
        if (parsedData[currentMicroserviceId]) {
          setExpandedItems(parsedData[currentMicroserviceId]);
        }
      }
      
      // Load function results
      const storedResultsData = localStorage.getItem(FUNCTION_RESULTS_STORAGE_KEY);
      if (storedResultsData) {
        const parsedData = JSON.parse(storedResultsData);
        if (parsedData[currentMicroserviceId]) {
          setFunctionResults(parsedData[currentMicroserviceId]);
        } else {
          // Clear results if none exist for this microservice
          setFunctionResults({});
        }
      }
      
      // Load show results state
      const storedShowResultsData = localStorage.getItem(SHOW_RESULTS_STORAGE_KEY);
      if (storedShowResultsData) {
        const parsedData = JSON.parse(storedShowResultsData);
        if (parsedData[currentMicroserviceId] !== undefined) {
          setShowResults(parsedData[currentMicroserviceId]);
        }
      }
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
    }
  }, [currentMicroserviceId]);

  // Toggle expanded state of a test item
  const toggleExpand = useCallback((id: string) => {
    setExpandedItems(prev => {
      const newState = {
        ...prev,
        [id]: !prev[id]
      };
      
      // Save to localStorage
      if (currentMicroserviceId) {
        try {
          const storedData = localStorage.getItem(EXPANDED_ITEMS_STORAGE_KEY) || '{}';
          const parsedData = JSON.parse(storedData);
          parsedData[currentMicroserviceId] = newState;
          localStorage.setItem(EXPANDED_ITEMS_STORAGE_KEY, JSON.stringify(parsedData));
        } catch (error) {
          console.error('Failed to save expanded items to localStorage:', error);
        }
      }
      
      return newState;
    });
  }, [currentMicroserviceId]);

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
    
    setExpandedItems(prev => {
      const updatedState = { ...prev, ...newExpandedState };
      
      // Save to localStorage
      if (currentMicroserviceId) {
        try {
          const storedData = localStorage.getItem(EXPANDED_ITEMS_STORAGE_KEY) || '{}';
          const parsedData = JSON.parse(storedData);
          parsedData[currentMicroserviceId] = updatedState;
          localStorage.setItem(EXPANDED_ITEMS_STORAGE_KEY, JSON.stringify(parsedData));
        } catch (error) {
          console.error('Failed to save expanded items to localStorage:', error);
        }
      }
      
      return updatedState;
    });
  }, [currentMicroserviceId]);

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
    
    setExpandedItems(prev => {
      const updatedState = { ...prev, ...newExpandedState };
      
      // Save to localStorage
      if (currentMicroserviceId) {
        try {
          const storedData = localStorage.getItem(EXPANDED_ITEMS_STORAGE_KEY) || '{}';
          const parsedData = JSON.parse(storedData);
          parsedData[currentMicroserviceId] = updatedState;
          localStorage.setItem(EXPANDED_ITEMS_STORAGE_KEY, JSON.stringify(parsedData));
        } catch (error) {
          console.error('Failed to save expanded items to localStorage:', error);
        }
      }
      
      return updatedState;
    });
  }, [currentMicroserviceId]);

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
    
    // Save results to localStorage
    if (microservice.id) {
      try {
        const storedData = localStorage.getItem(FUNCTION_RESULTS_STORAGE_KEY) || '{}';
        const parsedData = JSON.parse(storedData);
        parsedData[microservice.id] = results;
        localStorage.setItem(FUNCTION_RESULTS_STORAGE_KEY, JSON.stringify(parsedData));
      } catch (error) {
        console.error('Failed to save function results to localStorage:', error);
      }
    }
  }, []);

  // Toggle visibility of test results
  const toggleResultsVisibility = useCallback(() => {
    setShowResults(prev => {
      const newState = !prev;
      
      // Save to localStorage
      if (currentMicroserviceId) {
        try {
          const storedData = localStorage.getItem(SHOW_RESULTS_STORAGE_KEY) || '{}';
          const parsedData = JSON.parse(storedData);
          parsedData[currentMicroserviceId] = newState;
          localStorage.setItem(SHOW_RESULTS_STORAGE_KEY, JSON.stringify(parsedData));
        } catch (error) {
          console.error('Failed to save show results state to localStorage:', error);
        }
      }
      
      return newState;
    });
  }, [currentMicroserviceId]);

  // Set current microservice and load its expanded state, function results, and show results state from localStorage
  const setCurrentMicroservice = useCallback((microservice: TestItem | null) => {
    if (!microservice) {
      setCurrentMicroserviceId(null);
      setExpandedItems({});
      setFunctionResults({});
      return;
    }
    
    setCurrentMicroserviceId(microservice.id);
    
    try {
      // Load expanded state for this microservice
      const storedExpandedData = localStorage.getItem(EXPANDED_ITEMS_STORAGE_KEY);
      if (storedExpandedData) {
        const parsedData = JSON.parse(storedExpandedData);
        if (parsedData[microservice.id]) {
          setExpandedItems(parsedData[microservice.id]);
        } else {
          // Reset expanded state if no saved state exists for this microservice
          setExpandedItems({});
        }
      } else {
        setExpandedItems({});
      }
      
      // Load function results for this microservice
      const storedResultsData = localStorage.getItem(FUNCTION_RESULTS_STORAGE_KEY);
      if (storedResultsData) {
        const parsedData = JSON.parse(storedResultsData);
        if (parsedData[microservice.id]) {
          setFunctionResults(parsedData[microservice.id]);
        } else {
          // Reset function results if no saved results exist for this microservice
          setFunctionResults({});
        }
      } else {
        setFunctionResults({});
      }
      
      // Load show results state for this microservice
      const storedShowResultsData = localStorage.getItem(SHOW_RESULTS_STORAGE_KEY);
      if (storedShowResultsData) {
        const parsedData = JSON.parse(storedShowResultsData);
        if (parsedData[microservice.id] !== undefined) {
          setShowResults(parsedData[microservice.id]);
        }
      }
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
      setExpandedItems({});
      setFunctionResults({});
    }
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
    runAllTests,
    setCurrentMicroservice,
    currentMicroserviceId
  };
};
