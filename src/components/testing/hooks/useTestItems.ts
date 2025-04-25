import { useState, useCallback, useEffect, useRef } from 'react';
import { TestItem } from '@/types';

// Define interfaces for better type safety
interface StorageData {
  [microserviceId: string]: any;
}

interface TestItemsState {
  expandedItems: Record<string, boolean>;
  functionResults: Record<string, string>;
  showResults: boolean;
  currentMicroserviceId: string | null;
}

// Local storage key constants
const STORAGE_KEYS = {
  expandedItems: (projectId: string) => `poly-micro-manager-expanded-items:${projectId}`,
  functionResults: (projectId: string) => `poly-micro-manager-function-results:${projectId}`,
  showResults: (projectId: string) => `poly-micro-manager-show-results:${projectId}`
};

/**
 * Helper functions for localStorage operations
 */
const storage = {
  /**
   * Save data to localStorage with error handling
   */
  save: (key: string, microserviceId: string | null, data: any): void => {
    if (!microserviceId) return;
    
    try {
      // Get existing data or initialize empty object
      const existingData = localStorage.getItem(key) || '{}';
      const parsedData = JSON.parse(existingData) as StorageData;
      
      // Update data for specific microservice
      parsedData[microserviceId] = data;
      
      // Save back to localStorage
      localStorage.setItem(key, JSON.stringify(parsedData));
    } catch (error) {
      console.error(`Failed to save data to localStorage (${key}):`, error);
    }
  },
  
  /**
   * Load data from localStorage with error handling
   */
  load: <T>(key: string, microserviceId: string | null, defaultValue: T): T => {
    if (!microserviceId) return defaultValue;
    
    try {
      const storedData = localStorage.getItem(key);
      if (!storedData) return defaultValue;
      
      const parsedData = JSON.parse(storedData) as StorageData;
      return microserviceId in parsedData ? parsedData[microserviceId] : defaultValue;
    } catch (error) {
      console.error(`Failed to load data from localStorage (${key}):`, error);
      return defaultValue;
    }
  }
};

/**
 * Hook for managing test items and their expanded state
 */
export const useTestItems = (microservices: TestItem[] = [], projectId: string, initialMicroserviceId?: string) => {
  // State for test items management
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [functionResults, setFunctionResults] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<boolean>(true);
  const [currentMicroserviceId, setCurrentMicroserviceId] = useState<string | null>(initialMicroserviceId || null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isOutputModalOpen, setIsOutputModalOpen] = useState<boolean>(false);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [runningTests, setRunningTests] = useState<Record<string, boolean>>({});
  const [allTestsComplete, setAllTestsComplete] = useState<boolean>(false);
  const totalTestsRunningRef = useRef<number>(0);
  const completedTestsRef = useRef<number>(0);

  // Initialize state when project or microservices change
  useEffect(() => {
    // Reset state for new project
    setExpandedItems({});
    setFunctionResults({});
    setShowResults(true);
    setAllTestsComplete(false);
    totalTestsRunningRef.current = 0;
    completedTestsRef.current = 0;
    
    // Set first microservice as current if available, or use initialMicroserviceId if provided
    if (initialMicroserviceId) {
      setCurrentMicroserviceId(initialMicroserviceId);
    } else {
      setCurrentMicroserviceId(microservices.length > 0 ? microservices[0].id : null);
    }
  }, [projectId, microservices, initialMicroserviceId]);

  // Load saved state when current microservice changes
  useEffect(() => {
    if (!currentMicroserviceId) return;
    
    // Load all state data for the current microservice
    const loadedExpandedItems = storage.load<Record<string, boolean>>(
      STORAGE_KEYS.expandedItems(projectId),
      currentMicroserviceId,
      {}
    );
    
    const loadedFunctionResults = storage.load<Record<string, string>>(
      STORAGE_KEYS.functionResults(projectId),
      currentMicroserviceId,
      {}
    );
    
    const loadedShowResults = storage.load<boolean>(
      STORAGE_KEYS.showResults(projectId),
      currentMicroserviceId,
      true
    );
    
    // Update state with loaded data
    setExpandedItems(loadedExpandedItems);
    setFunctionResults(loadedFunctionResults);
    setShowResults(loadedShowResults);
  }, [currentMicroserviceId, projectId]);

  /**
   * Toggle expanded state of a test item
   */
  const toggleExpand = useCallback((id: string) => {
    setExpandedItems(prev => {
      const newState = {
        ...prev,
        [id]: !prev[id]
      };
      
      // Save to localStorage
      storage.save(STORAGE_KEYS.expandedItems(projectId), currentMicroserviceId, newState);
      
      return newState;
    });
  }, [currentMicroserviceId, projectId]);

  /**
   * Helper function to recursively process items and set them as expanded
   */
  const processItemsForExpansion = useCallback((itemsToProcess: TestItem[]): Record<string, boolean> => {
    const newState: Record<string, boolean> = {};
    
    const processItem = (item: TestItem) => {
      newState[item.id] = true;
      if (item.children && item.children.length > 0) {
        item.children.forEach(processItem);
      }
    };
    
    itemsToProcess.forEach(processItem);
    return newState;
  }, []);

  /**
   * Expand all items in the current microservice
   */
  const expandAll = useCallback(() => {
    const expandedState: Record<string, boolean> = {};
    
    // Helper function to recursively expand all items
    const expandAllItems = (items: TestItem[]) => {
      items.forEach(item => {
        expandedState[item.id] = true;
        if (item.children && item.children.length > 0) {
          expandAllItems(item.children);
        }
      });
    };
    
    // Expand all items in the microservices array
    expandAllItems(microservices);
    
    setExpandedItems(expandedState);
    
    // Save to localStorage
    storage.save(STORAGE_KEYS.expandedItems(projectId), currentMicroserviceId, expandedState);
  }, [currentMicroserviceId, microservices, projectId]);

  /**
   * Collapse all items in the current microservice
   */
  const collapseAll = useCallback(() => {
    const emptyState = {};
    setExpandedItems(emptyState);
    
    // Save to localStorage
    storage.save(STORAGE_KEYS.expandedItems(projectId), currentMicroserviceId, emptyState);
  }, [currentMicroserviceId, projectId]);

  /**
   * Run a single test function and generate results
   */
  const runTest = useCallback((test: TestItem) => {
    if (!test || test.type !== 'function') return;
    
    // Set this test as running
    setRunningTests(prev => ({ ...prev, [test.id]: true }));
    setIsLoading(true);
    
    // Increment test count if this is part of a batch run
    if (totalTestsRunningRef.current > 0) {
      completedTestsRef.current += 1;
      
      // Check if all tests are complete
      if (completedTestsRef.current >= totalTestsRunningRef.current) {
        setAllTestsComplete(true);
      }
    }
    
    // Mock test run, would be replaced with actual API call
    // Simulate an async operation
    setTimeout(() => {
      try {
        const totalTests = test.children?.length || 0;
        const passedTests = Math.floor(Math.random() * (totalTests + 1)); // Random number of passing tests
        
        const result = `Function Results (${new Date().toLocaleTimeString()}):
Status: ${passedTests === totalTests ? 'Success' : 'Partial'}
Tests: ${passedTests}/${totalTests} passed
Coverage: ${Math.floor(85 + Math.random() * 15)}%

✓ ${passedTests} test(s) passed
${totalTests - passedTests > 0 ? `✕ ${totalTests - passedTests} test(s) failed` : ''}
`;
        
        setFunctionResults(prev => {
          const newResults = { ...prev, [test.id]: result };
          
          // Save to localStorage
          storage.save(STORAGE_KEYS.functionResults(projectId), currentMicroserviceId, newResults);
          
          return newResults;
        });
        
        // Test is complete - no longer running
        setRunningTests(prev => {
          const updated = { ...prev };
          delete updated[test.id];
          return updated;
        });
        
        setIsLoading(false);
        
        // Return success status and info for toast notifications
        return {
          success: true,
          test,
          status: passedTests === totalTests ? 'Success' : 'Partial',
          passedTests,
          totalTests
        };
      } catch (err) {
        console.error('Test execution error:', err);
        
        // Test failed - no longer running
        setRunningTests(prev => {
          const updated = { ...prev };
          delete updated[test.id];
          return updated;
        });
        
        setIsLoading(false);
        
        // Return error info for toast notifications
        return {
          success: false,
          test,
          error: err instanceof Error ? err.message : 'Unknown error'
        };
      }
    }, 1000); // Simulate a delay
  }, [currentMicroserviceId, projectId]);

  /**
   * Run all tests for the current microservice
   */
  const runAllTests = useCallback(() => {
    if (!currentMicroserviceId) return;
    
    // Find the current microservice
    const microservice = microservices.find(ms => ms.id === currentMicroserviceId);
    if (!microservice) return;
    
    // Get all function test items
    const getAllFunctions = (items: TestItem[]): TestItem[] => {
      let functions: TestItem[] = [];
      
      items.forEach(item => {
        if (item.type === 'function') {
          functions.push(item);
        }
        
        if (item.children) {
          functions = [...functions, ...getAllFunctions(item.children)];
        }
      });
      
      return functions;
    };
    
    const functions = getAllFunctions([microservice]);
    
    // Reset completion trackers
    setAllTestsComplete(false);
    totalTestsRunningRef.current = functions.length;
    completedTestsRef.current = 0;
    
    // Set all tests as running
    const runningTestsObj: Record<string, boolean> = {};
    functions.forEach(func => {
      runningTestsObj[func.id] = true;
    });
    setRunningTests(runningTestsObj);
    
    if (functions.length > 0) {
      setIsLoading(true);
      
      // Return information for toast notifications
      const result = {
        success: true,
        totalTests: functions.length,
        microserviceName: microservice.name
      };
      
      // Run each function test
      functions.forEach(func => {
        runTest(func);
      });
      
      return result;
    }
  }, [currentMicroserviceId, microservices, runTest]);

  /**
   * Toggle visibility of test results and persist the setting
   */
  const toggleResultsVisibility = useCallback(() => {
    if (!currentMicroserviceId) return;

    setShowResults(prev => {
      const next = !prev;
      
      // Save to localStorage
      storage.save(STORAGE_KEYS.showResults(projectId), currentMicroserviceId, next);
      
      return next;
    });
  }, [currentMicroserviceId, projectId]);

  /**
   * Set the current microservice and load its state
   */
  const setCurrentMicroservice = useCallback((microservice: TestItem | null) => {
    if (!microservice) {
      setCurrentMicroserviceId(null);
      setExpandedItems({});
      setFunctionResults({});
      return;
    }
    
    // Make sure we reset test completion tracking when switching microservices
    // This prevents showing completion toasts when just navigating
    setAllTestsComplete(false);
    totalTestsRunningRef.current = 0;
    completedTestsRef.current = 0;
    
    // Set the current microservice ID, which will trigger the useEffect to load state
    setCurrentMicroserviceId(microservice.id);
  }, []);

  const viewTestOutput = useCallback((testId: string) => {
    setIsOutputModalOpen(true);
    setSelectedTestId(testId);
  }, []);

  const closeOutputModal = useCallback(() => {
    setIsOutputModalOpen(false);
    setSelectedTestId(null);
  }, []);

  // Return the state and actions
  return {
    // State
    expandedItems,
    functionResults,
    showResults,
    currentMicroserviceId,
    isLoading,
    error,
    isOutputModalOpen,
    selectedTestId,
    runningTests,
    allTestsComplete,
    
    // Actions
    toggleExpand,
    expandAll,
    collapseAll,
    toggleResultsVisibility,
    runTest,
    viewTestOutput,
    closeOutputModal,
    setRunningTests,
    setCurrentMicroservice,
    runAllTests
  };
};
