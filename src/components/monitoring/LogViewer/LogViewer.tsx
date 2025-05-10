import React, { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { BoxedWrapper, SectionHeader } from '@shared/index';
import { usePagination } from '@hooks/index';
import { Log, Service } from '@/types';
import {
  DEFAULT_ITEMS_PER_PAGE,
  LOGS_TABLE_HEADERS,
} from '@constants';
import { TablePagination } from './TablePagination';
import { ServiceSelector, SeveritySelector, RowsPerPageSelector } from '../shared';
import StatusBadge from '../shared/StatusBadge';
import { GuidanceTooltip } from '@/components/guidance';
import { OnboardingStep } from '@/context/GuidanceContext';

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
  const navigate = useNavigate();
  
  // Filter logs based on selected service and severity
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const serviceMatch = selectedService === 'All' || log.service === selectedService;
      const severityMatch = selectedSeverity === 'All' || log.severity === selectedSeverity;
      return serviceMatch && severityMatch;
    });
  }, [logs, selectedService, selectedSeverity]);
  
  // Handle navigation to testing section
  const handleContinueToTesting = () => {
    // Store the next step in sessionStorage
    sessionStorage.setItem('forceTestingTab', 'true');
    sessionStorage.setItem('pendingGuidanceStep', '6'); // OnboardingStep.AUTOMATED_TESTING = 6
    
    // Navigate to testing section
    navigate('/testing');
  };

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
      <GuidanceTooltip
        step={OnboardingStep.LOGS}
        title="Log Monitoring"
        description="View and filter logs from all your microservices. You can filter by service, severity level, and adjust how many entries to display per page. Use this to troubleshoot issues and monitor application behavior."
        position="right"
        className="flex flex-col"
      >
      <div className="flex items-center justify-between mb-4">
        <SectionHeader
          title="Logs"
          HeaderIcon={AlertCircle}
          headerClassName="text-lg font-semibold flex items-center text-gray-900 dark:text-gray-100"
          iconClassName="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400"
        />
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {filteredLogs.length} {filteredLogs.length === 1 ? 'entry' : 'entries'}
          </div>
          <button
            onClick={handleContinueToTesting}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            aria-label="Continue to Testing"
          >
            Continue to Testing →
          </button>
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
        
        <SeveritySelector
          selectedSeverity={selectedSeverity}
          onSeverityChange={onSeverityChange}
        />
        
        <RowsPerPageSelector
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
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
      </GuidanceTooltip>
    </BoxedWrapper>
  );
});

