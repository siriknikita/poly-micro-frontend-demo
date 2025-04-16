import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@hooks';
import { Project } from '@types';
import { mockProjects } from '@data/mockData';

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
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Update URL when tab changes
  useEffect(() => {
    const tabPath = Object.entries(pathToTab).find(([_, tab]) => tab === activeTab)?.[0] || '/dashboard';
    if (location.pathname !== tabPath) {
      navigate(tabPath);
    }
  }, [activeTab, navigate, location.pathname]);

  // Load saved project and services on component mount
  useEffect(() => {
    // Load last selected project
    const savedProjectId = localStorage.getItem('lastSelectedProject');
    if (savedProjectId) {
      const project = mockProjects.find(p => p.id === savedProjectId);
      if (project) {
        setSelectedProject(project);
      }
    }
  }, []);
  
  // Get the last selected service for the current tab and project
  const getLastSelectedService = (projectId: string, tabName: string) => {
    const key = `lastSelected_${tabName}_${projectId}`;
    return localStorage.getItem(key);
  };

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
          onSelectProject={(project) => {
            setSelectedProject(project);
            localStorage.setItem('lastSelectedProject', project.id);
          }}
          onLogout={() => {
            localStorage.removeItem('currentUser');
            navigate('/login');
          }}
        />

        <main className="flex-1 overflow-y-auto">
          <div className={mainPageRenderClassName}>
            {selectedProject ? (
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
                  <AutomatedTesting 
                    initialMicroserviceId={getLastSelectedService(selectedProject.id, 'testing')}
                    projectId={selectedProject.id}
                  />
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
