import React, { useState } from 'react';
import { CPUChart } from './CPUChart';
import { ServiceStatus } from './ServiceStatus';
import { LogViewer } from './LogViewer';
import { useMonitoringData } from '../../hooks/useMonitoringData';

export const MonitoringDashboard: React.FC = () => {
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
  } = useMonitoringData();

  return (
    <div className="mt-4 space-y-6">
      <CPUChart
        data={selectedMetricService ? cpuData[selectedMetricService] : null}
        selectedService={selectedMetricService}
        services={services}
        onServiceSelect={setSelectedMetricService}
      />
      <ServiceStatus services={services} />
      <LogViewer
        logs={logs}
        selectedService={selectedLogService}
        selectedSeverity={selectedSeverity}
        onServiceChange={setSelectedLogService}
        onSeverityChange={setSelectedSeverity}
        services={services}
      />
    </div>
  );
};
