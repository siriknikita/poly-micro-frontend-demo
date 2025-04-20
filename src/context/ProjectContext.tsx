import { createContext, useContext, useState, ReactNode } from 'react';
import { TestItem } from '@/types';

export interface Project {
  id: string;
  name: string;
  microservices?: TestItem[];
  // Add other fields as needed
}

interface ProjectContextType {
  project: Project | null;
  setProject: (project: Project | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [project, setProject] = useState<Project | null>(null);
  return (
    <ProjectContext.Provider value={{ project, setProject }}>
      {children}
    </ProjectContext.Provider>
  );
};
