import React, { useState } from 'react';
import { PipelineToolbox } from './PipelineToolbox';
import { PipelineCanvas } from './PipelineCanvas';
import { NavigationControls } from './NavigationControls';
import { VariablesPanel } from './VariablesPanel';
import { Save, Download, Play, Grid3X3 } from 'lucide-react';
import { mockServices } from '../../data/mockData';
import { Service, Project } from '../../types/monitoring';

interface CICDPipelineProps {
  selectedProjectId: Project['id'];
}

export const CICDPipeline: React.FC<CICDPipelineProps> = ({
  selectedProjectId,
}) => {
  const [selectedService, setSelectedService] = useState<Service>(
    mockServices[selectedProjectId][0]
  );
  const [showGrid, setShowGrid] = useState(true);
  const [toolboxPosition, setToolboxPosition] = useState<
    'left' | 'right' | 'float'
  >('left');
  const [isSimulating, setIsSimulating] = useState(false);

  const handleServiceChange = (direction: 'up' | 'down') => {
    const currentMockServices = mockServices[selectedProjectId];
    const currentIndex = currentMockServices.findIndex(
      (s) => s.name === selectedService.name
    );
    const newIndex =
      direction === 'up'
        ? (currentIndex - 1 + currentMockServices.length) % currentMockServices.length
        : (currentIndex + 1) % currentMockServices.length;
    setSelectedService(currentMockServices[newIndex]);
  };

  const handleExport = () => {
    // Mock export functionality
    const pipeline = {
      service: selectedService.name,
      blocks: [], // Would contain actual pipeline configuration
      variables: {},
    };
    const blob = new Blob([JSON.stringify(pipeline, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pipeline-${selectedService.name.toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Pipeline: {selectedService.name}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-2 rounded-lg ${
                  showGrid
                    ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Toggle grid"
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                isSimulating
                  ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                  : 'bg-indigo-600 text-white dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600'
              }`}
            >
              <Play className="h-4 w-4" />
              <span>
                {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
              </span>
            </button>
            <button
              onClick={() => {
                /* Save functionality */
              }}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              title="Save pipeline"
            >
              <Save className="h-5 w-5" />
            </button>
            <button
              onClick={handleExport}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              title="Export pipeline"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <PipelineToolbox
          position={toolboxPosition}
          onPositionChange={setToolboxPosition}
          isSimulating={isSimulating}
        />

        <div className="flex-1 relative">
          <PipelineCanvas showGrid={showGrid} isSimulating={isSimulating} />

          <NavigationControls
            onNavigate={handleServiceChange}
            currentService={selectedService}
            services={mockServices[selectedProjectId]}
          />
        </div>

        <VariablesPanel />
      </div>
    </div>
  );
};
