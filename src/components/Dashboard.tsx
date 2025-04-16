import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@hooks';
import { Project } from '@types';

import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MonitoringDashboard } from './monitoring/MonitoringDashboard';
import { AutomatedTesting } from './testing/AutomatedTesting';
import { CICDPipeline } from './pipelining/CICDPipeline';

export function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, setDarkMode } = useTheme();
  const userString = localStorage.getItem('currentUser');
  const user = userString ? JSON.parse(userString) : null;
  
  // Determine active tab from URL path
  const pathToTab = {
    '/dashboard': 'dashboard',
    '/monitoring': 'monitoring',
    '/cicd': 'cicd',
    '/testing': 'testing'
  };
  
  const [activeTab, setActiveTab] = React.useState(
    pathToTab[location.pathname as keyof typeof pathToTab] || 'dashboard'
  );
  
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(
    null
  );
  
  // Update URL when tab changes
  useEffect(() => {
    const tabPath = Object.entries(pathToTab).find(([_, tab]) => tab === activeTab)?.[0] || '/dashboard';
    if (location.pathname !== tabPath) {
      navigate(tabPath);
    }
  }, [activeTab, navigate, location.pathname]);

  const mainPageRenderClassName =
    selectedProject && (activeTab === 'testing' || activeTab === 'cicd')
      ? 'mx-auto'
      : `max-w-7xl mx-auto`;

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        user={user} 
      />

      <div className="flex-1 flex flex-col">
        <TopBar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
          onLogout={() => {
            localStorage.removeItem('currentUser');
            navigate('/login');
          }}
        />

        <main className="flex-1 overflow-y-auto">
          <div className={mainPageRenderClassName}>
            {selectedProject ? (
              <div>
                {activeTab === 'dashboard' && <MonitoringDashboard selectedProjectId={selectedProject.id} />}
                {activeTab === 'monitoring' && <MonitoringDashboard selectedProjectId={selectedProject.id} />}
                {activeTab === 'cicd' && <CICDPipeline selectedProjectId={selectedProject.id} />}
                {activeTab === 'testing' && <AutomatedTesting />}
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
