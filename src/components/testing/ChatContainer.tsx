import React, { memo } from 'react';
import { isEqual } from 'lodash';
import { GripVertical } from 'lucide-react';
import { TestChat } from './TestChat';
import { TestItem } from '@types';

interface ChatContainerProps {
  chatWidth: number;
  setIsDragging: (isDragging: boolean) => void;
  chatRef: React.RefObject<{ setInput: (text: string) => void }>;
  handleGenerateTest: (test: TestItem) => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = memo(({
  chatWidth,
  setIsDragging,
  chatRef,
  handleGenerateTest,
}) => (
    <>
      <div
        className="flex items-center cursor-col-resize hover:bg-gray-200 dark:hover:bg-gray-700"
        onMouseDown={() => setIsDragging(true)}
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
), (prevProps, nextProps) => {
  return (
    isEqual(prevProps.chatWidth, nextProps.chatWidth)
  );
});

