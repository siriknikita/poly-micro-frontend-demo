import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks';

import { Sidebar } from '../layout/Sidebar';
import { TopBar } from '../layout/TopBar';
import { MonitoringDashboard } from './MonitoringDashboard';
import { AutomatedTesting } from '../testing/AutomatedTesting';
import { CICDPipeline } from '../pipelining/CICDPipeline';

// Import custom hooks
import { 
  useTabNavigation,
  useProjectManagement,
  useAuthManagement
} from './hooks';

export function Dashboard() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTheme();
  
  // Use custom hooks to manage different aspects of the dashboard
  const { activeTab, setActiveTab } = useTabNavigation();
  const { selectedProject, handleSelectProject } = useProjectManagement(activeTab);
  const { user, handleLogout, getLastSelectedService } = useAuthManagement();

  // Determine main content class based on active tab
  const mainPageRenderClassName = selectedProject && (activeTab === 'testing' || activeTab === 'cicd')
    ? 'mx-auto'
    : `max-w-7xl mx-auto`;

  // Redirect to login if no user
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
          onSelectProject={handleSelectProject}
          onLogout={handleLogout}
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
