import { useState, useCallback, useEffect } from 'react';
import { TestItem } from '@/types';

// Local storage keys
const getExpandedItemsKey = (projectId: string) => `poly-micro-manager-expanded-items:${projectId}`;
const getFunctionResultsKey = (projectId: string) => `poly-micro-manager-function-results:${projectId}`;
const getShowResultsKey = (projectId: string) => `poly-micro-manager-show-results:${projectId}`;

/**
 * Hook for managing test items and their expanded state
 */
export const useTestItems = (microservices: TestItem[] = [], projectId: string) => {
  // Reset all state when projectId changes
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [functionResults, setFunctionResults] = useState<Record<string, string>>({});
  // Persistent per-microservice show/hide results state
  const [showResults, setShowResults] = useState<boolean>(true);
  const [currentMicroserviceId, setCurrentMicroserviceId] = useState<string | null>(null);

  // Reset state and update currentMicroserviceId when projectId or microservices change
  useEffect(() => {
    // Clear state for new project
    setExpandedItems({});
    setFunctionResults({});
    setShowResults(true);
    
    // Set first microservice as current if available
    setCurrentMicroserviceId(microservices.length > 0 ? microservices[0].id : null);
  }, [projectId, microservices]);

  // Load expanded items, function results, and show/hide results state from localStorage on microservice switch
  useEffect(() => {
    if (!currentMicroserviceId) return;

    // Load show/hide results state for this microservice
    try {
      const stored = localStorage.getItem(getShowResultsKey(projectId));
      if (stored) {
        const parsed = JSON.parse(stored);
        setShowResults(typeof parsed[currentMicroserviceId] === 'boolean' ? parsed[currentMicroserviceId] : true);
      } else {
        setShowResults(true);
      }
    } catch {
      console.log('Failed to load show/hide results state from localStorage');
      setShowResults(true);
    }

    // Load expanded items
    try {
      const storedExpandedData = localStorage.getItem(getExpandedItemsKey(projectId));
      if (storedExpandedData) {
        const parsedData = JSON.parse(storedExpandedData);
        if (parsedData[currentMicroserviceId]) {
          setExpandedItems(parsedData[currentMicroserviceId]);
        }
      }
      
      // Load function results
      const storedResultsData = localStorage.getItem(getFunctionResultsKey(projectId));
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
      const storedShowResultsData = localStorage.getItem(getShowResultsKey(projectId));
      if (storedShowResultsData) {
        const parsedData = JSON.parse(storedShowResultsData);
        if (parsedData[currentMicroserviceId] !== undefined) {
          setShowResults(parsedData[currentMicroserviceId]);
        }
      }
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
    }
  }, [currentMicroserviceId, projectId]);

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
          const storedData = localStorage.getItem(getExpandedItemsKey(projectId)) || '{}';
          const parsedData = JSON.parse(storedData);
          parsedData[currentMicroserviceId] = newState;
          localStorage.setItem(getExpandedItemsKey(projectId), JSON.stringify(parsedData));
        } catch (error) {
          console.error('Failed to save expanded items to localStorage:', error);
        }
      }
      
      return newState;
    });
  }, [currentMicroserviceId, projectId]);

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
          const storedData = localStorage.getItem(getExpandedItemsKey(projectId)) || '{}';
          const parsedData = JSON.parse(storedData);
          parsedData[currentMicroserviceId] = updatedState;
          localStorage.setItem(getExpandedItemsKey(projectId), JSON.stringify(parsedData));
        } catch (error) {
          console.error('Failed to save expanded items to localStorage:', error);
        }
      }
      
      return updatedState;
    });
  }, [currentMicroserviceId, projectId]);

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
          const storedData = localStorage.getItem(getExpandedItemsKey(projectId)) || '{}';
          const parsedData = JSON.parse(storedData);
          parsedData[currentMicroserviceId] = updatedState;
          localStorage.setItem(getExpandedItemsKey(projectId), JSON.stringify(parsedData));
        } catch (error) {
          console.error('Failed to save expanded items to localStorage:', error);
        }
      }
      
      return updatedState;
    });
  }, [currentMicroserviceId, projectId]);

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
        const storedData = localStorage.getItem(getFunctionResultsKey(projectId)) || '{}';
        const parsedData = JSON.parse(storedData);
        parsedData[microservice.id] = results;
        localStorage.setItem(getFunctionResultsKey(projectId), JSON.stringify(parsedData));
      } catch (error) {
        console.error('Failed to save function results to localStorage:', error);
      }
    }
  }, [projectId]);

  // Toggle show/hide results for current microservice and persist
  const toggleResultsVisibility = useCallback(() => {
    console.group('Toggle show/hide results visibility');
    console.log('Toggling show/hide results visibility');
    if (!currentMicroserviceId) {
      console.log('No current microservice ID found');
      return;
    }

    setShowResults(prev => {
      const next = !prev;
      console.log('Toggling show/hide results visibility to:', next);
      try {
        const stored = localStorage.getItem(getShowResultsKey(projectId));
        console.log('Stored show/hide results state:', stored);
        const parsed = stored ? JSON.parse(stored) : {};
        parsed[currentMicroserviceId] = next;
        console.log('Parsed show/hide results state:', parsed);
        localStorage.setItem(getShowResultsKey(projectId), JSON.stringify(parsed));
      } catch (error) {
        console.error('Failed to save show/hide results state to localStorage:', error);
      }
      return next;
    });
    console.groupEnd();
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
      const storedExpandedData = localStorage.getItem(getExpandedItemsKey(projectId));
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
      const storedResultsData = localStorage.getItem(getFunctionResultsKey(projectId));
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
      const storedShowResultsData = localStorage.getItem(getShowResultsKey(projectId));
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
