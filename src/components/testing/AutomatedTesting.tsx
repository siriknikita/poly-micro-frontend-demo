import { useEffect, useState, useRef } from 'react';
import { TestList } from './TestList';
import { TestChat } from './TestChat';
import { TestItem } from '../../types/testing';
import { MessageSquare, Play } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { useResizablePanel, useTestItems, useMicroserviceNavigation } from './hooks';
import { IconButton, NavigationControls, SearchInput, ResizeHandle } from './components';
import { DEFAULT_PROMPTS } from './constants';

import { useToast } from '@/context/ToastContext';
import { useProject } from '@/context/ProjectContext';

// Using key instead of memo to force remount when project changes
export const AutomatedTesting = () => {
  // State for selected test and chat visibility
  const [, setSelectedTest] = useState<TestItem | null>(null);
  const [showChat, setShowChat] = useState(true);
  
  // Use our custom hooks
  const { width: chatWidth, isDragging, setIsDragging, startResize } = useResizablePanel();
  const { project } = useProject();
  const { showInfo, showSuccess } = useToast();

  // Use the current project's microservices
  const microservices = project?.microservices || [];
  
  const {
    functionResults,
    runTest,
    runAllTests,
    setCurrentMicroservice,
    allTestsComplete,
  } = useTestItems(microservices, project?.id || '');
  
  const {
    selectedMicroservice,
    setSelectedMicroservice,
    searchQuery,
    setSearchQuery,
    filteredMicroservices,
    navigateMicroservice,
    getPreviousMicroserviceName,
    getNextMicroserviceName
  } = useMicroserviceNavigation({
    microservices,
    initialMicroservice: microservices[0] || null
  });



  // Reference to the chat component for setting input
  const chatRef = useRef<{ setInput: (text: string) => void }>(null);
  
  // Handle generating a test
  const handleGenerateTest = (test: TestItem) => {
    setSelectedTest(test);
    const defaultPrompt = DEFAULT_PROMPTS.GENERATE_TEST(test.name);
    if (chatRef.current) {
      chatRef.current.setInput(defaultPrompt);
    }
    showInfo(`Preparing to generate test for ${test.name}`);
  };

  // If there's no selected microservice and we have filtered results, select the first one
  useEffect(() => {
    if (!selectedMicroservice && filteredMicroservices.length > 0) {
      setSelectedMicroservice(filteredMicroservices[0]);
    }
  }, [selectedMicroservice, filteredMicroservices, setSelectedMicroservice]);
  
  // Show a toast notification when all tests complete, but only when tests were actually run
  useEffect(() => {
    // Only show the notification if tests were actually run (totalTestsRunningRef.current > 0)
    // This prevents the notification from appearing when just switching between microservices
    if (allTestsComplete && selectedMicroservice) {
      // We can access this information because 'showSuccess' is from our component scope
      showSuccess(`All tests for ${selectedMicroservice.name} have completed`);
    }
  }, [allTestsComplete, selectedMicroservice, showSuccess]);

  // Update the current microservice in the test items hook when it changes
  useEffect(() => {
    setCurrentMicroservice(selectedMicroservice);
  }, [selectedMicroservice, setCurrentMicroservice]);

  if (!selectedMicroservice) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <EmptyState />
      </div>
    );
  }

  return (
    <div 
      className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50 dark:bg-gray-900"
      onMouseMove={(e) => isDragging && e.preventDefault()}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Testing: {selectedMicroservice.name}
            </h2>
            <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search microservices..."
          />
          </div>

          <div className="flex items-center space-x-2">
            <IconButton
              onClick={() => {
                if (selectedMicroservice) {
                  const result = runAllTests();
                  if (result) {
                    showInfo(`Running ${result.totalTests} tests for ${result.microserviceName}...`);
                  }
                }
              }}
              icon={<Play className="h-4 w-4" />}
              label="Run All Tests"
              variant="primary"
              size="md"
            />
            <IconButton
              onClick={() => setShowChat(!showChat)}
              icon={<MessageSquare className="h-5 w-5" />}
              variant={showChat ? "outline" : "active"}
              title={showChat ? 'Hide Test Assistant' : 'Show Test Assistant'}
              aria-label={showChat ? 'Hide Test Assistant' : 'Show Test Assistant'}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          <div className="p-4 overflow-auto h-full">
            {selectedMicroservice.children && selectedMicroservice.children.length > 0 ? (
              <TestList
                tests={selectedMicroservice.children}
                onRunTest={runTest}
                onGenerateTest={handleGenerateTest}
                functionResults={functionResults}
                microserviceId={selectedMicroservice.id}
              />
            ) : (
              <EmptyState />
            )}
          </div>

          <NavigationControls
            onNavigate={navigateMicroservice}
            previousItemName={getPreviousMicroserviceName()}
            nextItemName={getNextMicroserviceName()}
            showControls={filteredMicroservices.length > 1}
          />
        </div>

        {showChat && (
          <>
            <ResizeHandle onResizeStart={startResize} />

            <div
              style={{ width: chatWidth }}
              className="flex border-l border-gray-200 dark:border-gray-700"
            >
              <TestChat ref={chatRef} onGenerateTest={handleGenerateTest} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};


