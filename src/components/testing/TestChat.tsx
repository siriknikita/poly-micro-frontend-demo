import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Send } from 'lucide-react';
import { TestItem } from '../../types/testing';

interface TestChatProps {
  onGenerateTest: (test: TestItem) => void;
}

export const TestChat = forwardRef<
  { setInput: (text: string) => void },
  TestChatProps
>(({ onGenerateTest }, ref) => {
  const [messages, setMessages] = useState<
    Array<{ text: string; isUser: boolean }>
  >([
    {
      text: "Hi! I'm your testing assistant. How can I help you today?",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    setInput: (text: string) => {
      setInput(text);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    },
  }));

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, isUser: true }]);
    setInput('');

    // Mock response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "I'll help you improve your test coverage. What specific function would you like to focus on?",
          isUser: false,
        },
      ]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col w-full bg-white dark:bg-gray-800 select-none">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Test Assistant
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 select-text">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.isUser ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">
                {message.text}
              </pre>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 select-text">
        <div className="flex space-x-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none min-h-[40px] max-h-[200px] overflow-y-auto"
            style={{ height: '40px' }}
          />
          <button
            onClick={handleSend}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 self-end"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
});
