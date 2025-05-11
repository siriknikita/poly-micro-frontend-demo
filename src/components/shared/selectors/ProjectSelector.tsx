import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Project } from '@/types';
import { GuidanceTooltip } from '@/components/guidance';
import { OnboardingStep } from '@/context/GuidanceContext';

interface ProjectSelectorProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (project: Project) => void;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  projects,
  selectedProject,
  onSelectProject,
}) => {
  return (
    <GuidanceTooltip
      step={OnboardingStep.PROJECT_SELECTION}
      title="Project Selection"
      description="Select your project from this dropdown to view and manage its microservices. Each project contains its own set of services and configurations."
      position="bottom"
      className="relative project-selector"
    >
      <select
        value={selectedProject?.id || ''}
        onChange={(e) => {
          const project = projects.find((p) => p.id === e.target.value);
          if (project) onSelectProject(project);
        }}
        className="appearance-none w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
        data-testid="selected-project"
      >
        <option value="">Select a project</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
      <FolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
    </GuidanceTooltip>
  );
};
