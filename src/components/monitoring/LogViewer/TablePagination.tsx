import React, { memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TablePaginationProps {
  className?: string;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  showPageNumbers?: boolean;
  maxPageButtons?: number;
}

export const TablePagination: React.FC<TablePaginationProps> = memo(({
  className = '',
  currentPage,
  totalPages,
  handlePageChange,
  showPageNumbers = false,
  maxPageButtons = 5,
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    if (!showPageNumbers || totalPages <= 1) return [];
    
    const pageNumbers = [];
    const halfMaxButtons = Math.floor(maxPageButtons / 2);
    let startPage = Math.max(1, currentPage - halfMaxButtons);
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };
  
  const pageNumbers = getPageNumbers();
  const buttonClasses = "flex items-center justify-center px-3 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded disabled:opacity-50 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors";
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={buttonClasses}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      {showPageNumbers && pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => handlePageChange(number)}
          className={`${buttonClasses} ${number === currentPage ? 'bg-indigo-500 dark:bg-indigo-600 text-white hover:bg-indigo-600 dark:hover:bg-indigo-700' : ''}`}
        >
          {number}
        </button>
      ))}
      
      {!showPageNumbers && (
        <span className="text-gray-900 dark:text-gray-100 px-2">
          Page {currentPage} of {totalPages}
        </span>
      )}
      
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
        className={buttonClasses}
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if these props change
  return prevProps.currentPage === nextProps.currentPage &&
    prevProps.totalPages === nextProps.totalPages;
});

export default TablePagination;
