import React, { memo, useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import { BoxedWrapper, SectionHeader } from '@shared/index';
import { usePagination } from '@hooks/index';
import { Log, Service } from '@types';
import {
  DEFAULT_ITEMS_PER_PAGE,
  LOGS_TABLE_HEADERS,
  ROWS_PER_PAGE_OPTIONS,
  SEVERITY_LEVELS,
} from '@constants';
import { TablePagination } from './TablePagination';
import { ServiceSelector, StatusBadge } from '../shared';

interface LogViewerProps {
  logs: Log[];
  selectedService: string;
  selectedSeverity: string;
  onServiceChange: (service: string) => void;
  onSeverityChange: (severity: string) => void;
  services: Service[];
}

export const LogViewer: React.FC<LogViewerProps> = memo(({
  logs,
  selectedService,
  selectedSeverity,
  onServiceChange,
  onSeverityChange,
  services,
}) => {
  // Filter logs based on selected service and severity
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const serviceMatch = selectedService === 'All' || log.service === selectedService;
      const severityMatch = selectedSeverity === 'All' || log.severity === selectedSeverity;
      return serviceMatch && severityMatch;
    });
  }, [logs, selectedService, selectedSeverity]);

  const {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedLogs,
    setLastLogRowRef,
    handlePageChange,
    handleItemsPerPageChange,
  } = usePagination(filteredLogs, DEFAULT_ITEMS_PER_PAGE);

  return (
    <BoxedWrapper>
      <div className="flex items-center justify-between mb-4">
        <SectionHeader
          title="Logs"
          HeaderIcon={AlertCircle}
          headerClassName="text-lg font-semibold flex items-center text-gray-900 dark:text-gray-100"
          iconClassName="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400"
        />
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {filteredLogs.length} {filteredLogs.length === 1 ? 'entry' : 'entries'}
        </div>
      </div>

      {/* Filter */}
      <div className="mb-4 flex flex-wrap gap-4">
        <ServiceSelector
          selectedService={selectedService}
          services={services}
          onServiceSelect={onServiceChange}
          showAllOption={true}
        />
        
        <select
          value={selectedSeverity}
          onChange={(e) => onSeverityChange(e.target.value)}
          className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          aria-label="Select severity level"
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
          aria-label="Select items per page"
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
                  <StatusBadge 
                    status={log.severity} 
                    variant={log.severity.toLowerCase().includes('error') ? 'error' : 
                            log.severity.toLowerCase().includes('warn') ? 'warning' : 
                            log.severity.toLowerCase().includes('info') ? 'info' : 'success'} 
                  />
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {log.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {paginatedLogs.length > 0 ? (
        <TablePagination
          className="flex justify-between items-center mt-4"
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          showPageNumbers={true}
        />
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No logs found matching the current filters
        </div>
      )}
    </BoxedWrapper>
  );
});

