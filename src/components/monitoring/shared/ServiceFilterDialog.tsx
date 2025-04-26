import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Service } from '@/types';
import { FilterCondition, FilterGroup, FilterOperator, FilterField } from '../hooks/useServiceFilters';

interface ServiceFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (filterGroup: FilterGroup) => void;
  services: Service[];
  initialFilterGroup?: FilterGroup;
}

export const ServiceFilterDialog: React.FC<ServiceFilterDialogProps> = ({
  isOpen,
  onClose,
  onApplyFilter,
  services,
  initialFilterGroup
}) => {
  const [operator, setOperator] = useState<FilterOperator>(initialFilterGroup?.operator || 'AND');
  const [conditions, setConditions] = useState<FilterCondition[]>(
    initialFilterGroup?.conditions || [{ field: 'status', value: '' }]
  );

  // Get unique status values from services
  const statusOptions = React.useMemo(() => {
    const statuses = new Set<string>();
    services.forEach(service => {
      if (service.status) statuses.add(service.status);
    });
    return Array.from(statuses);
  }, [services]);

  // Get unique health values from services
  const healthOptions = React.useMemo(() => {
    const healths = new Set<string>();
    services.forEach(service => {
      if (service.health) healths.add(service.health);
    });
    return Array.from(healths);
  }, [services]);

  // Add a new condition
  const addCondition = () => {
    setConditions([...conditions, { field: 'status', value: '' }]);
  };

  // Remove a condition
  const removeCondition = (index: number) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter((_, i) => i !== index));
    }
  };

  // Update a condition
  const updateCondition = (index: number, field: keyof FilterCondition, value: string) => {
    const updatedConditions = [...conditions];
    updatedConditions[index] = {
      ...updatedConditions[index],
      [field]: value
    };
    setConditions(updatedConditions);
  };

  // Apply filter
  const applyFilter = () => {
    // Validate conditions - ensure all have values
    const validConditions = conditions.filter(c => c.value !== '');
    if (validConditions.length === 0) {
      return; // Don't apply empty filters
    }

    onApplyFilter({
      operator,
      conditions: validConditions
    });
    onClose();
  };

  // Reset form
  const resetForm = () => {
    if (initialFilterGroup) {
      setOperator(initialFilterGroup.operator);
      setConditions([...initialFilterGroup.conditions]);
    } else {
      setOperator('AND');
      setConditions([{ field: 'status', value: '' }]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="filter-dialog">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {initialFilterGroup ? 'Edit Filter' : 'Add Filter'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close"
            data-testid="close-dialog-button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Filter Operator
          </label>
          <select
            value={operator}
            onChange={(e) => setOperator(e.target.value as FilterOperator)}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          >
            <option value="AND">AND (All conditions must match)</option>
            <option value="OR">OR (Any condition can match)</option>
            <option value="NOT">NOT (None of the conditions should match)</option>
          </select>
        </div>

        <div className="space-y-3 mb-4">
          {conditions.map((condition, index) => (
            <div key={index} className="flex items-center space-x-2">
              <select
                value={condition.field}
                onChange={(e) => updateCondition(index, 'field', e.target.value as FilterField)}
                className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              >
                <option value="status">Status</option>
                <option value="health">Health</option>
              </select>
              
              <select
                value={condition.value}
                onChange={(e) => updateCondition(index, 'value', e.target.value)}
                className="flex-1 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              >
                <option value="">Select a value</option>
                {condition.field === 'status' ? (
                  statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))
                ) : (
                  healthOptions.map(health => (
                    <option key={health} value={health}>{health}</option>
                  ))
                )}
              </select>
              
              <button
                onClick={() => removeCondition(index)}
                disabled={conditions.length <= 1}
                className={`p-1 rounded-md ${
                  conditions.length <= 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-red-500 hover:bg-red-100 dark:hover:bg-red-900'
                }`}
                aria-label="Remove condition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addCondition}
          className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-4"
        >
          <Plus className="h-4 w-4 mr-1" /> Add condition
        </button>

        <div className="flex justify-end space-x-2">
          <button
            onClick={resetForm}
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            Reset
          </button>
          <button
            onClick={applyFilter}
            className="px-4 py-2 text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-md"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};
