import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { Log } from '../../types/monitoring';
import { BoxedWrapper } from '../shared/BoxedWrapper';

interface LogViewerProps {
  logs: Log[];
  selectedService: string;
  selectedSeverity: string;
  onServiceChange: (service: string) => void;
  onSeverityChange: (severity: string) => void;
  services: { name: string }[];
}

const DEFAULT_ITEMS_PER_PAGE = 10;

export const LogViewer: React.FC<LogViewerProps> = ({
  logs,
  selectedService,
  selectedSeverity,
  onServiceChange,
  onSeverityChange,
  services,
}) => {
  const [currentPage, setCurrentPage] = useState(() => {
    return Number(localStorage.getItem('logViewerCurrentPage')) || 1;
  });

  const [itemsPerPage, setItemsPerPage] = useState(() => {
    return Number(localStorage.getItem('logViewerItemsPerPage')) || DEFAULT_ITEMS_PER_PAGE;
  });

  useEffect(() => {
    localStorage.setItem('logViewerCurrentPage', currentPage.toString());
    localStorage.setItem('logViewerItemsPerPage', itemsPerPage.toString());
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const paginatedLogs = useMemo(() => logs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ), [logs, currentPage, itemsPerPage]);

  const lastLogRef = useRef<HTMLTableRowElement>(null);
  const setLastLogRowRef = useCallback((node: HTMLTableRowElement | null) => {
    lastLogRef.current = node;
  }, []);

  const handlePageChange = (page: number) => {
    const nextPageLogs = logs.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    if (nextPageLogs.length > paginatedLogs.length) {
      setCurrentPage(page);
      setTimeout(() => {
        if (lastLogRef.current) {
          lastLogRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    } else {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = Number(e.target.value);
    const nextPageLogs = logs.slice(0, newItemsPerPage);
    if (nextPageLogs.length > paginatedLogs.length) {
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1);
      setTimeout(() => {
        if (lastLogRef.current) {
          lastLogRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    } else {
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1);
    }
  };

  return (
    <BoxedWrapper>
      <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
        <AlertCircle className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
        Logs
      </h3>
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
          <option value="DEBUG">DEBUG</option>
          <option value="INFO">INFO</option>
          <option value="WARN">WARN</option>
          <option value="ERROR">ERROR</option>
        </select>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Message
              </th>
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
                    log.severity === 'ERROR' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                    log.severity === 'WARN' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                    log.severity === 'DEBUG' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
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
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-900 dark:text-gray-100">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </BoxedWrapper>
  );
};
