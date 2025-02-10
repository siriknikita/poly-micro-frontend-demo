import React from 'react';
import { AlertCircle } from 'lucide-react';
import { BoxedWrapper, SectionHeader } from '@shared';
import { usePagination } from '@hooks';
import { Log } from '@types';
import {
  DEFAULT_ITEMS_PER_PAGE,
  LOGS_TABLE_HEADERS,
  ROWS_PER_PAGE_OPTIONS,
  SEVERITY_LEVELS,
  CLASSES_BY_SEVERITY,
} from '@constants';
import { TablePagination } from './TablePagination';

interface LogViewerProps {
  logs: Log[];
  selectedService: string;
  selectedSeverity: string;
  onServiceChange: (service: string) => void;
  onSeverityChange: (severity: string) => void;
  services: { name: string }[];
}

export const LogViewer: React.FC<LogViewerProps> = ({
  logs,
  selectedService,
  selectedSeverity,
  onServiceChange,
  onSeverityChange,
  services,
}) => {
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedLogs,
    setLastLogRowRef,
    handlePageChange,
    handleItemsPerPageChange,
  } = usePagination(logs, DEFAULT_ITEMS_PER_PAGE);

  return (
    <BoxedWrapper>
      <SectionHeader
        title="Logs"
        HeaderIcon={AlertCircle}
        headerClassName="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100"
        iconClassName="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400"
      />

      {/* Filter */}
      <div className="mb-4 flex space-x-4">
        <select
          value={selectedService}
          onChange={(e) => onServiceChange(e.target.value)}
          className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
        >
          <option value="All">All Services</option>
          {services.map((service, index) => (
            <option key={index} value={service.name}>{service.name}</option>
          ))}
        </select>
        <select
          value={selectedSeverity}
          onChange={(e) => onSeverityChange(e.target.value)}
          className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
        >
          <option value="All">All Severities</option>
          {SEVERITY_LEVELS.map((severity, index) => (
            <option key={index} value={severity}>{severity}</option>
          ))}
        </select>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
        >
          {ROWS_PER_PAGE_OPTIONS.map((option, index) => (
            <option key={index} value={option}>{option} per page</option>
          ))}
        </select>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {LOGS_TABLE_HEADERS.map((header) => (
                <th key={header.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedLogs.map((log, index) => (
              <tr key={log.id} ref={index === paginatedLogs.length - 1 ? setLastLogRowRef : null}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {log.timestamp}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {log.service}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    CLASSES_BY_SEVERITY[log.severity as keyof typeof CLASSES_BY_SEVERITY]
                  }`}>
                    {log.severity}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {log.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination
        className="flex justify-between items-center mt-4"
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </BoxedWrapper>
  );
};

