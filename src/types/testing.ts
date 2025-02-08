export interface TestItem {
  id: string;
  name: string;
  type: 'microservice' | 'function' | 'test-case';
  children?: TestItem[];
}

export interface TestOutput {
  status: 'success' | 'failure';
  time: string;
  output: string;
  coverage: number;
  timestamp: string;
}

export interface TestMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}