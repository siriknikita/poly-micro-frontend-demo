import { useState, useEffect, useCallback } from 'react';
import { Project } from '@/types';
import { mockTestDataByProject } from '@data/mockTestData';
import { useProject } from '@/context/useProject';

const API_BASE_URL = 'http://localhost:8000'; // Configure this to match your FastAPI server URL

/**
 * Custom hook for managing project selection and data
 * Handles loading, selecting, and updating project data
 */
export function useProjectManagement(activeTab: string) {
  const { setProject } = useProject();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects from API on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Load saved project using fetched projects
  useEffect(() => {
    if (loading) return;
    const savedProjectId = localStorage.getItem('lastSelectedProject');
    if (savedProjectId) {
      const project = projects.find((p) => p.id === savedProjectId);
      if (project) {
        setSelectedProject(project);
      }
    }
  }, [loading, projects]);

  // Update project context when tab or selected project changes
  useEffect(() => {
    if (!selectedProject) return;

    // If we're on the testing tab, make sure the project has microservices data
    if (activeTab === 'testing') {
      // Get project-specific test data or fallback to an empty array
      const projectTestData = mockTestDataByProject[selectedProject.id] || [];

      const projectWithMicroservices = {
        ...selectedProject,
        microservices: projectTestData,
      };

      setProject(projectWithMicroservices);
    } else {
      // For other tabs, we don't need the microservices data
      setProject({
        ...selectedProject,
        microservices: undefined,
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
    handleSelectProject,
    projects,
    loading,
    error,
  };
}
