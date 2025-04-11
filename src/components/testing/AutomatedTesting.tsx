import React, { useState, useEffect } from 'react';
import { mockTestData } from '@data/mockTestData';
import { TestItem } from '@types';
import { Header } from './Header';
import { TestListContainer } from './TestListContainer';
import { ChatContainer } from './ChatContainer';

export const AutomatedTesting: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<TestItem | null>(null);
  const [chatWidth, setChatWidth] = useState(400);
  const [isDragging, setIsDragging] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [selectedMicroservice, setSelectedMicroservice] = useState(mockTestData[0]);
  const [functionResults, setFunctionResults] = useState<Record<string, string>>({});

  const handleRunTest = (test: TestItem) => {
    // Test results will be shown inline in TestList
  };

  const handleRunAllTests = () => {
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
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMicroserviceChange = (direction: 'up' | 'down') => {
    const currentIndex = mockTestData.findIndex(
      (ms) => ms.id === selectedMicroservice.id
    );
    const newIndex =
      direction === 'up'
        ? (currentIndex - 1 + mockTestData.length) % mockTestData.length
        : (currentIndex + 1) % mockTestData.length;
    setSelectedMicroservice(mockTestData[newIndex]);
    setFunctionResults({}); // Clear results when changing microservice
  };

  return (
    <div
      className={`h-[calc(100vh-4rem)] flex flex-col bg-gray-50 dark:bg-gray-900 ${isDragging ? 'select-none' : ''}`}
      onMouseMove={handleDrag}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      <Header
        selectedMicroservice={selectedMicroservice}
        showChat={showChat}
        setShowChat={setShowChat}
        handleRunAllTests={handleRunAllTests}
      />

      <div className="flex-1 flex overflow-hidden">
        <TestListContainer
          selectedMicroservice={selectedMicroservice}
          functionResults={functionResults}
          handleGenerateTest={handleGenerateTest}
          handleMicroserviceChange={handleMicroserviceChange}
        />

        {showChat && (
          <ChatContainer
            chatWidth={chatWidth}
            setIsDragging={setIsDragging}
            chatRef={chatRef}
            handleGenerateTest={handleGenerateTest}
          />
        )}
      </div>
    </div>
  );
};
