import { useState, useMemo } from 'react';
import { Log, MockedCPUData, MockedServices } from '../types/monitoring';
import { mockCpuData, mockServices, mockLogs } from '../data/mockData';

export const useMonitoringData = () => {
  const [cpuData] = useState<MockedCPUData>(mockCpuData);
  const [services] = useState<MockedServices>(mockServices);
  const [logs] = useState<Log[]>(mockLogs);
  const [selectedLogService, setSelectedLogService] = useState<string>('All');
  const [selectedMetricService, setSelectedMetricService] = useState<string>('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('1');

  const filteredLogs = useMemo(() => {
    return logs.filter(log =>
      (selectedLogService === 'All' || log.service === selectedLogService) &&
      (selectedSeverity === 'All' || log.severity === selectedSeverity)
    );
  }, [logs, selectedLogService, selectedSeverity]);

  return {
    cpuData,
    services,
    logs: filteredLogs, // Return the memoized filtered logs
    selectedLogService,
    setSelectedLogService,
    selectedMetricService,
    setSelectedMetricService,
    selectedSeverity,
    setSelectedSeverity,
    selectedProjectId,
    setSelectedProjectId
  };
};
