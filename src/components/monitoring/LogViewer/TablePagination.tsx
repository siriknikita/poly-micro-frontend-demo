import React, { memo } from 'react';
import { isEqual } from 'lodash';

interface TablePaginationInput {
  className: string;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

export const TablePagination: React.FC<TablePaginationInput> = memo(({
  className,
  currentPage,
  totalPages,
  handlePageChange,
}) => {
  return (
    <div className={className}>
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
  );
}, (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
});

export default TablePagination;
