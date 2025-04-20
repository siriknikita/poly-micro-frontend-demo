import { useState, useCallback, useEffect } from 'react';
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
export const useTestItems = (microservices: TestItem[] = [], projectId: string) => {
  // State for test items management
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [functionResults, setFunctionResults] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<boolean>(true);
  const [currentMicroserviceId, setCurrentMicroserviceId] = useState<string | null>(null);

  // Initialize state when project or microservices change
  useEffect(() => {
    // Reset state for new project
    setExpandedItems({});
    setFunctionResults({});
    setShowResults(true);
    
    // Set first microservice as current if available
    setCurrentMicroserviceId(microservices.length > 0 ? microservices[0].id : null);
  }, [projectId, microservices]);

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
      if (item.children) {
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
    // Find the current microservice in the microservices array
    const microservice = microservices.find(ms => ms.id === currentMicroserviceId);
    if (!microservice) return;
    
    const expandedState = processItemsForExpansion([microservice]);
    setExpandedItems(expandedState);
    
    // Save to localStorage
    storage.save(STORAGE_KEYS.expandedItems(projectId), currentMicroserviceId, expandedState);
  }, [currentMicroserviceId, microservices, projectId, processItemsForExpansion]);

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

    // Mock test run, would be replaced with actual API call
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
  }, [currentMicroserviceId, projectId]);

  /**
   * Run all tests for a microservice
   */
  const runAllTests = useCallback((microservice: TestItem) => {
    if (!microservice || !microservice.children) return;
    
    // Get all functions from the selected microservice
    const functions = microservice.children || [];
    
    // Create mock results for each function
    const results: Record<string, string> = {};
    functions.forEach(func => {
      runTest(func);
    });

    // Save results to localStorage
    if (microservice.id) {
      try {
        const storedData = localStorage.getItem(STORAGE_KEYS.functionResults(projectId)) || '{}';
        const parsedData = JSON.parse(storedData);
        parsedData[microservice.id] = results;
        localStorage.setItem(STORAGE_KEYS.functionResults(projectId), JSON.stringify(parsedData));
      } catch (error) {
        console.error('Failed to save function results to localStorage:', error);
      }
    }
  }, [currentMicroserviceId, projectId, runTest]);

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
    
    // Set the current microservice ID, which will trigger the useEffect to load state
    setCurrentMicroserviceId(microservice.id);
  }, []);

  return {
    // State
    expandedItems,
    functionResults,
    showResults,
    currentMicroserviceId,
    
    // Actions
    toggleExpand,
    expandAll,
    collapseAll,
    toggleResultsVisibility,
    runTest,
    runAllTests,
    setCurrentMicroservice
  };
};
