import React from 'react';
import { PipelineBlock } from '@/types/pipeline';
import { AVAILABLE_BLOCKS_MAP } from '@constants';

interface PipelineToolboxProps {
  position: 'left' | 'right' | 'float';
  // onPositionChange: (position: 'left' | 'right' | 'float') => void;
  isSimulating: boolean;
}

const blocks: PipelineBlock[] = [
  {
    id: 'timer',
    name: 'Timer',
    icon: 'Timer',
    description: 'Schedule pipeline execution',
    category: 'triggers',
    configSchema: {
      schedule: { type: 'cron', label: 'Schedule (cron)', default: '0 0 * * *' },
      timezone: { type: 'string', label: 'Timezone', default: 'UTC' }
    }
  },
  {
    id: 'command',
    name: 'Command Execution',
    icon: 'Terminal',
    description: 'Run shell commands',
    category: 'execution',
    configSchema: {
      command: { type: 'command', label: 'Command', default: '' },
      timeout: { type: 'number', label: 'Timeout (seconds)', default: 300 },
      retries: { type: 'number', label: 'Retries', default: 3 }
    }
  },
  {
    id: 'branch',
    name: 'Conditional Branch',
    icon: 'GitBranch',
    description: 'Add conditional logic',
    category: 'flow',
    configSchema: {
      condition: { type: 'expression', label: 'Condition', default: '' },
      successPath: { type: 'string', label: 'Success Path', default: '' },
      failurePath: { type: 'string', label: 'Failure Path', default: '' }
    }
  },
  {
    id: 'error',
    name: 'Error Handler',
    icon: 'XCircle',
    description: 'Handle pipeline errors',
    category: 'flow',
    configSchema: {
      errorCodes: { type: 'array', label: 'Error Codes', default: [] },
      action: { 
        type: 'select', 
        label: 'Action', 
        options: ['retry', 'skip', 'stop'],
        default: 'retry'
      }
    }
  },
  {
    id: 'ai',
    name: 'AI Assistant',
    icon: 'Bot',
    description: 'Get AI debugging help',
    category: 'automation',
    configSchema: {
      mode: { 
        type: 'select', 
        label: 'Mode', 
        options: ['suggest', 'auto-fix'],
        default: 'suggest'
      },
      maxTokens: { type: 'number', label: 'Max Tokens', default: 1000 }
    }
  },
  {
    id: 'loop',
    name: 'While Loop',
    icon: 'RotateCw',
    description: 'Repeat actions',
    category: 'flow',
    configSchema: {
      condition: { type: 'expression', label: 'Continue While', default: '' },
      maxIterations: { type: 'number', label: 'Max Iterations', default: 10 },
      timeout: { type: 'number', label: 'Timeout (seconds)', default: 3600 }
    }
  }
];

export const PipelineToolbox: React.FC<PipelineToolboxProps> = ({
  position,
  // onPositionChange,
  isSimulating
}) => {
  const handleDragStart = (e: React.DragEvent, block: PipelineBlock) => {
    e.dataTransfer.setData('application/json', JSON.stringify(block));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div 
      className={`w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col
        ${position === 'float' ? 'absolute left-4 top-4 rounded-lg shadow-lg' : ''}`}
    >
      <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Toolbox</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {blocks.map((block) => {
            const blockName = block.name;
            const BlockIcon = AVAILABLE_BLOCKS_MAP[blockName];
            return (
              <div
                key={block.id}
                draggable={!isSimulating}
                onDragStart={(e) => handleDragStart(e, block)}
                className={`p-3 rounded-lg border border-gray-200 dark:border-gray-700 
                  ${isSimulating 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'cursor-grab hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <BlockIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {blockName}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {block.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
