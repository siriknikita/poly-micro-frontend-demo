import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Map URL paths to tab names
const PATH_TO_TAB = {
  '/dashboard': 'dashboard',
  '/monitoring': 'monitoring',
  '/cicd': 'cicd',
  '/testing': 'testing'
};

/**
 * Custom hook for handling tab navigation in the dashboard
 * Manages active tab state and synchronizes it with the URL
 */
export function useTabNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active tab from URL path
  const [activeTab, setActiveTab] = useState(
    PATH_TO_TAB[location.pathname as keyof typeof PATH_TO_TAB] || 'dashboard'
  );
  
  // Update URL when tab changes
  useEffect(() => {
    const tabPath = Object.entries(PATH_TO_TAB).find(([, tab]) => tab === activeTab)?.[0] || '/dashboard';
    if (location.pathname !== tabPath) {
      navigate(tabPath);
    }
  }, [activeTab, navigate, location.pathname]);

  return {
    activeTab,
    setActiveTab,
    pathToTab: PATH_TO_TAB
  };
}
