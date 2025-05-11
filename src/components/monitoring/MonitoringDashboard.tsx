import React, { memo } from 'react';
import { CPUChart } from './CPUChart';
import { ServiceStatus } from './ServiceStatus';
import { LogViewer } from './LogViewer/LogViewer';
import { useMonitoringData } from '@hooks/index';
import { Project } from '@/types';
import { useServiceSelection } from './hooks';

interface MonitoringDashboardProps {
  selectedProjectId: Project['id'];
  initialServiceName?: string | null;
}

export const MonitoringDashboard: React.FC<MonitoringDashboardProps> = memo(
  ({ selectedProjectId, initialServiceName }: MonitoringDashboardProps) => {
    const { cpuData, services, logs, selectedSeverity, setSelectedSeverity, setSelectedProjectId } =
      useMonitoringData();

    // Use our custom hook for metric service selection
    const { selectedService: selectedMetricService, setSelectedService: setSelectedMetricService } =
      useServiceSelection({
        projectId: selectedProjectId,
        services: services[selectedProjectId] || [],
        initialServiceName,
        storageKey: 'monitoring',
      });

    // Use our custom hook for log service selection
    const { selectedService: selectedLogService, setSelectedService: setSelectedLogService } =
      useServiceSelection({
        projectId: selectedProjectId,
        services: services[selectedProjectId] || [],
        initialServiceName,
        storageKey: 'logs',
      });

    // Update the hook's selectedProjectId when prop changes
    React.useEffect(() => {
      setSelectedProjectId(selectedProjectId);
    }, [selectedProjectId, setSelectedProjectId]);

    return (
      <div className="space-y-6">
        <CPUChart
          data={selectedMetricService ? cpuData[selectedProjectId][selectedMetricService] : null}
          selectedService={selectedMetricService}
          services={services[selectedProjectId]}
          onServiceSelect={setSelectedMetricService}
          selectedProjectId={selectedProjectId}
        />
        <ServiceStatus services={services[selectedProjectId]} projectId={selectedProjectId} />
        <LogViewer
          logs={logs}
          selectedService={selectedLogService || ''}
          selectedSeverity={selectedSeverity}
          onServiceChange={setSelectedLogService}
          onSeverityChange={setSelectedSeverity}
          services={services[selectedProjectId]}
        />
      </div>
    );
  },
);
