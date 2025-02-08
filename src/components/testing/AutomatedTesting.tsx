import React, { useState } from 'react';
import { TestList } from './TestList';
import { TestChat } from './TestChat';
import { mockTestData } from '../../data/mockTestData';
import { TestItem } from '../../types/testing';
import { GripVertical } from 'lucide-react';
import { BoxedWrapper } from '../shared/BoxedWrapper';

export const AutomatedTesting: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<TestItem | null>(null);
  const [chatWidth, setChatWidth] = useState(400);
  const [isDragging, setIsDragging] = useState(false);

  const handleRunTest = (test: TestItem) => {
    // Test results will be shown inline in TestList
  };

  const handleGenerateTest = (test: TestItem) => {
    setSelectedTest(test);
    // Set default prompt in chat
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

  return (
    <div
      className="flex h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900"
      onMouseMove={handleDrag}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      <div className="mt-4 flex-1 p-4 overflow-auto min-w-0">
        <BoxedWrapper>
          <TestList
            tests={mockTestData}
            onRunTest={handleRunTest}
            onGenerateTest={handleGenerateTest}
          />
        </BoxedWrapper>
      </div>
      <div
        className="flex items-center cursor-col-resize hover:bg-gray-200 dark:hover:bg-gray-700"
        onMouseDown={() => setIsDragging(true)}
      >
        <GripVertical className="h-6 w-6 text-gray-400" />
      </div>

      <div
        style={{ width: chatWidth }}
        className="sticky flex border-l border-gray-200 dark:border-gray-700"
      >
        <TestChat ref={chatRef} onGenerateTest={handleGenerateTest} />
      </div>
    </div>
  );
};
