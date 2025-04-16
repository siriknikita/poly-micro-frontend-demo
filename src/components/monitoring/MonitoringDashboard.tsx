import { CPUChart } from './CPUChart';
import { ServiceStatus } from './ServiceStatus';
import { LogViewer } from './LogViewer/LogViewer';
import { useMonitoringData } from '@hooks';
import { Project } from '@types';
import { useEffect } from 'react';

interface MonitoringDashboardProps {
  selectedProjectId: Project['id'];
  initialServiceName?: string | null;
}

export const MonitoringDashboard = ({ selectedProjectId, initialServiceName }: MonitoringDashboardProps) => {
  const {
    cpuData,
    services,
    logs,
    selectedLogService,
    setSelectedLogService,
    selectedMetricService,
    setSelectedMetricService,
    selectedSeverity,
    setSelectedSeverity,
    setSelectedProjectId
  } = useMonitoringData();
  
  // Update the hook's selectedProjectId when prop changes
  useEffect(() => {
    setSelectedProjectId(selectedProjectId);
  }, [selectedProjectId, setSelectedProjectId]);
  
  // Initialize selected service from localStorage or prop
  useEffect(() => {
    // Check if we have services for this project
    const projectServices = services[selectedProjectId] || [];
    if (projectServices.length === 0) return;
    
    // Try to use the initialServiceName prop first
    if (initialServiceName) {
      const service = projectServices.find(s => s.name === initialServiceName);
      if (service) {
        setSelectedMetricService(service.name);
        setSelectedLogService(service.name);
        return;
      }
    }
    
    // If no initial service provided, set the first service as default
    if (!selectedMetricService && projectServices[0]) {
      setSelectedMetricService(projectServices[0].name);
    }
  }, [selectedProjectId, services, initialServiceName, selectedMetricService, setSelectedMetricService, setSelectedLogService]);
  
  // Save selected service to localStorage when it changes
  useEffect(() => {
    if (selectedMetricService) {
      localStorage.setItem(`lastSelected_monitoring_${selectedProjectId}`, selectedMetricService);
    }
  }, [selectedMetricService, selectedProjectId]);
  
  // Save selected service to localStorage for dashboard tab as well
  useEffect(() => {
    if (selectedMetricService) {
      localStorage.setItem(`lastSelected_dashboard_${selectedProjectId}`, selectedMetricService);
    }
  }, [selectedMetricService, selectedProjectId]);

  return (
    <div className="space-y-6">
      <CPUChart
        data={selectedMetricService ? cpuData[selectedProjectId][selectedMetricService] : null}
        selectedService={selectedMetricService}
        services={services[selectedProjectId]}
        onServiceSelect={setSelectedMetricService}
      />
      <ServiceStatus
        services={services[selectedProjectId]}
      />
      <LogViewer
        logs={logs}
        selectedService={selectedLogService}
        selectedSeverity={selectedSeverity}
        onServiceChange={setSelectedLogService}
        onSeverityChange={setSelectedSeverity}
        services={services[selectedProjectId]}
      />
    </div>
  );
};
