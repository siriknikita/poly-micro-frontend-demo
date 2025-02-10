import React, { useState } from 'react';
import { X } from 'lucide-react';
import { BlockInstance } from '@types';
import { BoxedWrapper } from '@shared';

interface BlockConfigModalProps {
  block: BlockInstance;
  onSave: (instanceId: string, config: Record<string, any>) => void;
  onClose: () => void;
}

export const BlockConfigModal: React.FC<BlockConfigModalProps> = ({
  block,
  onSave,
  onClose
}) => {
  const [config, setConfig] = useState<Record<string, any>>(block.config || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(block.instanceId, config);
  };

  const renderField = (key: string, schema: any) => {
    const value = config[key] ?? schema.default;

    switch (schema.type) {
      case 'string':
      case 'cron':
      case 'expression':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => setConfig({ ...config, [key]: Number(e.target.value) })}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {schema.options.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'command':
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={value}
              onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
              placeholder="Enter command or select from suggestions"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <select
              onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select a suggested command</option>
              <option value="npm run build">npm run build</option>
              <option value="npm run test">npm run test</option>
              <option value="docker build .">docker build .</option>
              <option value="./deploy.sh">./deploy.sh</option>
            </select>
          </div>
        );

      case 'array':
        const arrayValue = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {arrayValue.map((item, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newArray = [...arrayValue];
                    newArray[index] = e.target.value;
                    setConfig({ ...config, [key]: newArray });
                  }}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <button
                  onClick={() => {
                    const newArray = arrayValue.filter((_, i) => i !== index);
                    setConfig({ ...config, [key]: newArray });
                  }}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              onClick={() => setConfig({ 
                ...config, 
                [key]: [...arrayValue, ''] 
              })}
              className="w-full p-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
            >
              Add Item
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <BoxedWrapper className="shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Configure {block.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {Object.entries(block.configSchema).map(([key, schema]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {schema.label}
              </label>
              {renderField(key, schema)}
            </div>
          ))}

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </BoxedWrapper>
    </div>
  );
};
