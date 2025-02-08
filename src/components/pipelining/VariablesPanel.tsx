import React, { useState } from 'react';
import { Variable, Plus, Trash2 } from 'lucide-react';

interface PipelineVariable {
  name: string;
  value: string;
  scope: 'local' | 'global';
}

export const VariablesPanel: React.FC = () => {
  const [variables, setVariables] = useState<PipelineVariable[]>([
    { name: 'ENVIRONMENT', value: 'production', scope: 'global' },
    { name: 'RETRY_COUNT', value: '3', scope: 'local' },
    { name: 'TIMEOUT', value: '300', scope: 'local' }
  ]);

  const [newVariable, setNewVariable] = useState<PipelineVariable>({
    name: '',
    value: '',
    scope: 'local'
  });

  const handleAdd = () => {
    if (newVariable.name && newVariable.value) {
      setVariables([...variables, newVariable]);
      setNewVariable({ name: '', value: '', scope: 'local' });
    }
  };

  const handleDelete = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-l dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b dark:border-gray-700 flex items-center space-x-2">
        <Variable className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Variables</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {variables.map((variable, index) => (
            <div
              key={index}
              className="p-3 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {variable.name}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  variable.scope === 'global'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                }`}>
                  {variable.scope}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {variable.value}
                </span>
                <button
                  onClick={() => handleDelete(index)}
                  className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <input
            type="text"
            placeholder="Variable name"
            value={newVariable.name}
            onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <input
            type="text"
            placeholder="Variable value"
            value={newVariable.value}
            onChange={(e) => setNewVariable({ ...newVariable, value: e.target.value })}
            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <select
            value={newVariable.scope}
            onChange={(e) => setNewVariable({ ...newVariable, scope: e.target.value as 'local' | 'global' })}
            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="local">Local</option>
            <option value="global">Global</option>
          </select>
          <button
            onClick={handleAdd}
            className="w-full flex items-center justify-center space-x-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <Plus className="h-4 w-4" />
            <span>Add Variable</span>
          </button>
        </div>
      </div>
    </div>
  );
};