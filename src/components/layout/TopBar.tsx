import React from 'react';
import { LogOut, Boxes } from 'lucide-react';
import { ProjectSelector } from '../shared/selectors/ProjectSelector';
import { ThemeToggle } from './ThemeToggle';
import { Project } from '@/types';
import { mockProjects } from '@/data/mockData';
import { LANDING_PAGE_URL } from '@/config';

interface TopBarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  selectedProject: Project | null;
  onSelectProject: (project: Project) => void;
  onLogout: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  darkMode,
  setDarkMode,
  selectedProject,
  onSelectProject,
  onLogout,
}) => {
  return (
    <nav className="sticky top-0 z-10 w-full h-16 bg-white dark:bg-gray-800 border-b border-white dark:border-gray-700">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <a 
              href={LANDING_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
              <Boxes className="relative w-12 h-12 text-blue-400 transform group-hover:scale-110 transition duration-500" />
            </a>
            <div className="w-64">
              <ProjectSelector
                projects={mockProjects}
                selectedProject={selectedProject}
                onSelectProject={onSelectProject}
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle
              darkMode={darkMode}
              onToggle={() => setDarkMode(!darkMode)}
            />
            <button
              onClick={onLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
