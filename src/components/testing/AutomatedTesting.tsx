import React, { useState, useEffect } from 'react';
import { TestList } from './TestList';
import { TestChat } from './TestChat';
import { mockTestData } from '../../data/mockTestData';
import { TestItem } from '../../types/testing';
import { GripVertical, MessageSquare, ChevronUp, ChevronDown, Play, Search } from 'lucide-react';
import { EmptyState } from './EmptyState';

export const AutomatedTesting: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<TestItem | null>(null);
  const [chatWidth, setChatWidth] = useState(400);
  const [isDragging, setIsDragging] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [selectedMicroservice, setSelectedMicroservice] = useState(mockTestData[0] || null);
  const [functionResults, setFunctionResults] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMicroservices = mockTestData.filter(ms => 
    ms.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRunTest = (test: TestItem) => {
    // Test results will be shown inline in TestList
  };

  const handleRunAllTests = () => {
    if (!selectedMicroservice) return;
    
    // Get all functions from the selected microservice
    const functions = selectedMicroservice.children || [];
    
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
  };

  const handleGenerateTest = (test: TestItem) => {
    setSelectedTest(test);
    const defaultPrompt = `Generate additional test cases for the ${test.name} function to improve coverage and edge cases.`;
    if (chatRef.current) {
      chatRef.current.setInput(defaultPrompt);
    }
  };

  const chatRef = React.useRef<{ setInput: (text: string) => void }>(null);

  const handleDrag = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newWidth = window.innerWidth - e.clientX;
    setChatWidth(Math.max(300, Math.min(800, newWidth)));
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newWidth = window.innerWidth - e.clientX;
        setChatWidth(Math.max(300, Math.min(800, newWidth)));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // Remove the no-select class when dragging stops
      document.body.classList.remove('resize-no-select');
    };

    if (isDragging) {
      // Add a class to the body to prevent text selection during resize
      document.body.classList.add('resize-no-select');
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      // Clean up the class when component unmounts or effect re-runs
      document.body.classList.remove('resize-no-select');
    };
  }, [isDragging]);

  const handleMicroserviceChange = (direction: 'up' | 'down') => {
    if (!selectedMicroservice || filteredMicroservices.length === 0) return;

    const currentIndex = filteredMicroservices.findIndex(
      (ms) => ms.id === selectedMicroservice.id
    );
    const newIndex =
      direction === 'up'
        ? (currentIndex - 1 + filteredMicroservices.length) % filteredMicroservices.length
        : (currentIndex + 1) % filteredMicroservices.length;
    setSelectedMicroservice(filteredMicroservices[newIndex]);
    setFunctionResults({}); // Clear results when changing microservice
  };

  // If there's no selected microservice and we have filtered results, select the first one
  useEffect(() => {
    if (!selectedMicroservice && filteredMicroservices.length > 0) {
      setSelectedMicroservice(filteredMicroservices[0]);
    }
  }, [selectedMicroservice, filteredMicroservices]);

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
      onMouseMove={handleDrag}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Testing: {selectedMicroservice.name}
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search microservices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

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
              className={`p-2 rounded-lg ${
                showChat
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

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          <div className="p-4 overflow-auto h-full">
            {selectedMicroservice.children && selectedMicroservice.children.length > 0 ? (
              <TestList
                tests={[selectedMicroservice]}
                onRunTest={handleRunTest}
                onGenerateTest={handleGenerateTest}
                functionResults={functionResults}
              />
            ) : (
              <EmptyState />
            )}
          </div>

          {filteredMicroservices.length > 1 && (
            <div className="absolute bottom-6 right-6 flex flex-col space-y-2">
              <button
                onClick={() => handleMicroserviceChange('up')}
                className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                title={`Previous: ${filteredMicroservices[(filteredMicroservices.findIndex((ms) => ms.id === selectedMicroservice.id) - 1 + filteredMicroservices.length) % filteredMicroservices.length]?.name}`}
              >
                <ChevronUp className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleMicroserviceChange('down')}
                className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                title={`Next: ${filteredMicroservices[(filteredMicroservices.findIndex((ms) => ms.id === selectedMicroservice.id) + 1) % filteredMicroservices.length]?.name}`}
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {showChat && (
          <>
            <div
              className="flex items-center cursor-col-resize hover:bg-gray-200 dark:hover:bg-gray-700"
              onMouseDown={(e) => {
                setIsDragging(true);
                // Prevent default to avoid text selection on initial click
                e.preventDefault();
              }}
            >
              <GripVertical className="h-6 w-6 text-gray-400" />
            </div>

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