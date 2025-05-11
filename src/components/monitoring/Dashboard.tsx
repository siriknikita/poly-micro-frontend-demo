import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTheme } from '@/hooks';

import { Sidebar } from '../layout/Sidebar';
import { TopBar } from '../layout/TopBar';
import { MonitoringDashboard } from './MonitoringDashboard';
import { AutomatedTesting } from '../testing/AutomatedTesting';
import { CICDPipeline } from '../pipelining/CICDPipeline';
import { HelpPage } from '../help/HelpPage';

// Import custom hooks
import { useTabNavigation, useProjectManagement, useAuthManagement } from './hooks';

export function Dashboard() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTheme();

  // Use custom hooks to manage different aspects of the dashboard
  const { activeTab, setActiveTab } = useTabNavigation();
  console.log('activeTab', activeTab);
  const { selectedProject, handleSelectProject } = useProjectManagement(activeTab);
  const { user, handleLogout, getLastSelectedService, refreshAuthState } = useAuthManagement();

  // Check for force testing tab flag from guidance navigation
  useEffect(() => {
    const forceTestingTab = sessionStorage.getItem('forceTestingTab');
    if (forceTestingTab === 'true') {
      console.log('Dashboard detected forceTestingTab flag, setting active tab to testing');
      setActiveTab('testing');
      // Clear the flag to prevent infinite redirects
      sessionStorage.removeItem('forceTestingTab');
    }
  }, [setActiveTab]);

  // Ensure authentication state is preserved when navigating
  useEffect(() => {
    // Check URL parameters for guidance navigation
    const urlParams = new URLSearchParams(window.location.search);
    const isGuidanceNavigation = urlParams.get('guidance') === 'true';

    if (isGuidanceNavigation) {
      console.log('Detected guidance navigation, ensuring auth state is preserved...');
      // Force refresh the auth state
      refreshAuthState();
    }

    // Always refresh auth state when tab changes
    if (activeTab === 'testing') {
      console.log('Testing tab active, refreshing auth state...');
      refreshAuthState();
    }
  }, [activeTab, refreshAuthState]);

  // Handle URL parameters for guidance navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isGuidanceNavigation = urlParams.get('guidance') === 'true';
    const stepParam = urlParams.get('step');

    if (isGuidanceNavigation && stepParam) {
      // Clear URL parameters without page reload
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  // Determine main content class based on active tab
  const mainPageRenderClassName =
    selectedProject && (activeTab === 'testing' || activeTab === 'cicd')
      ? 'mx-auto'
      : `max-w-7xl mx-auto`;

  // Redirect to login if no user
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 flex">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={{
          ...user,
          // Add name property if missing to fix lint error
          name: user?.username || 'User',
        }}
      />

      <div className="flex-1 flex flex-col">
        <TopBar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          selectedProject={selectedProject}
          onSelectProject={handleSelectProject}
          onLogout={handleLogout}
        />

        <main
          className={`flex-1 ${activeTab === 'dashboard' || activeTab === 'monitoring' ? 'overflow-auto' : 'overflow-hidden'}`}
        >
          <div
            className={`${mainPageRenderClassName} ${activeTab === 'dashboard' || activeTab === 'monitoring' ? 'pb-8' : ''}`}
          >
            {activeTab === 'help' ? (
              <HelpPage />
            ) : selectedProject ? (
              <div>
                {activeTab === 'dashboard' && (
                  <MonitoringDashboard
                    selectedProjectId={selectedProject.id}
                    initialServiceName={getLastSelectedService(selectedProject.id, 'dashboard')}
                  />
                )}
                {activeTab === 'monitoring' && (
                  <MonitoringDashboard
                    selectedProjectId={selectedProject.id}
                    initialServiceName={getLastSelectedService(selectedProject.id, 'monitoring')}
                  />
                )}
                {activeTab === 'cicd' && (
                  <CICDPipeline
                    selectedProjectId={selectedProject.id}
                    initialServiceName={getLastSelectedService(selectedProject.id, 'cicd')}
                  />
                )}
                {activeTab === 'testing' && (
                  <AutomatedTesting key={`testing-${selectedProject.id}`} />
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Welcome to your dashboard
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Please select a project to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
