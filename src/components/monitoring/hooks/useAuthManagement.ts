import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for managing authentication-related functionality
 * Handles user data retrieval and logout
 */
export function useAuthManagement() {
  const navigate = useNavigate();
  
  // Get user from localStorage
  const userString = localStorage.getItem('currentUser');
  const user = userString ? JSON.parse(userString) : null;
  
  // Handle logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  }, [navigate]);
  
  // Get the last selected service for the current tab and project
  const getLastSelectedService = useCallback((projectId: string, tabName: string) => {
    const key = `lastSelected_${tabName}_${projectId}`;
    return localStorage.getItem(key);
  }, []);

  return {
    user,
    handleLogout,
    getLastSelectedService
  };
}
