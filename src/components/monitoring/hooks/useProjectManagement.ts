import { useState, useEffect, useCallback } from 'react';
import { Project } from '@/types';
import { mockProjects } from '@data/mockData';
import { mockTestDataByProject } from '@data/mockTestData';
import { useProject } from '@/context/ProjectContext';

/**
 * Custom hook for managing project selection and data
 * Handles loading, selecting, and updating project data
 */
export function useProjectManagement(activeTab: string) {
  const { setProject } = useProject();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Load saved project on component mount
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
  
  // Update project context when tab or selected project changes
  useEffect(() => {
    if (!selectedProject) return;
    
    // If we're on the testing tab, make sure the project has microservices data
    if (activeTab === 'testing') {
      // Get project-specific test data or fallback to an empty array
      const projectTestData = mockTestDataByProject[selectedProject.id] || [];
      
      const projectWithMicroservices = {
        ...selectedProject,
        microservices: projectTestData
      };
      
      setProject(projectWithMicroservices);
    } else {
      // For other tabs, we don't need the microservices data
      setProject({
        ...selectedProject,
        microservices: undefined
      });
    }
  }, [activeTab, selectedProject, setProject]);

  // Handle project selection
  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProject(project);
    localStorage.setItem('lastSelectedProject', project.id);
  }, []);

  return {
    selectedProject,
    setSelectedProject,
    handleSelectProject
  };
}
