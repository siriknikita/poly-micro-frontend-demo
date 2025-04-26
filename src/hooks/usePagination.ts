import { useState, useMemo, useCallback } from 'react';
import { Log } from '@/types';

const usePagination = (logs: Log[], itemsPerPageDefaultValue: number) => {
  const [currentPage, setCurrentPage] = useState(() => {
    return Number(localStorage.getItem('logViewerCurrentPage')) || 1;
  });

  const [itemsPerPage, setItemsPerPage] = useState(() => {
    return Number(localStorage.getItem('logViewerItemsPerPage')) || itemsPerPageDefaultValue;
  });

  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const paginatedLogs = useMemo(() => logs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ), [logs, currentPage, itemsPerPage]);

  // Instead of using useRef directly, we'll maintain our own reference
  let lastLogNodeRef: HTMLTableRowElement | null = null;
  
  // Create a callback ref function that will be used in the component
  const setLastLogRowRef = useCallback((node: HTMLTableRowElement | null) => {
    // Store the reference in our variable
    lastLogNodeRef = node;
  }, []);
  
  // Function to access the current node
  const getLastLogNode = useCallback(() => {
    return lastLogNodeRef;
  }, []);

  const handlePageChange = (page: number) => {
    const nextPageLogs = logs.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    if (nextPageLogs.length > paginatedLogs.length) {
      setCurrentPage(page);
      setTimeout(() => {
        const node = getLastLogNode();
        if (node) {
          node.scrollIntoView({ behavior: 'smooth' });
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
        const node = getLastLogNode();
        if (node) {
          node.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    } else {
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1);
    }
  };

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedLogs,
    setLastLogRowRef,
    handlePageChange,
    handleItemsPerPageChange,
  };
};

export default usePagination;
