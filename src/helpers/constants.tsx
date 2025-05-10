import { Timer, Terminal, GitBranch, XCircle, Bot, RotateCw } from "lucide-react";

export const AVAILABLE_BLOCKS_MAP = {
  'Timer': Timer,
  'Command Execution': Terminal,
  'Conditional Branch': GitBranch,
  'Error Handler': XCircle,
  'AI Assistant': Bot,
  'While Loop': RotateCw,
};

// Constants for logs table

export const LOGS_TABLE_HEADERS = [
  { key: 'timestamp', label: 'Timestamp' },
  { key: 'service', label: 'Service' },
  { key: 'severity', label: 'Severity' },
  { key: 'message', label: 'Message' },
]

export const CLASSES_BY_SEVERITY = {
  ERROR: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  WARN: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  DEBUG: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  INFO: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
}

export const TEXT_COLORS_BY_SEVERITY = {
  ERROR: 'text-red-600 dark:text-red-400',
  WARN: 'text-yellow-600 dark:text-yellow-400',
  DEBUG: 'text-gray-600 dark:text-gray-400',
  INFO: 'text-green-600 dark:text-green-400',
  All: 'text-gray-700 dark:text-gray-200'
}

export const SEVERITY_LEVELS = ['DEBUG', 'INFO', 'WARN', 'ERROR'];

export const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export const DEFAULT_ITEMS_PER_PAGE = 10;
