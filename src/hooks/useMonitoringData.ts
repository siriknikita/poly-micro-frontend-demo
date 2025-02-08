import { useState } from 'react';
import { CPUData, Service, Log } from '../types/monitoring';
import { mockCpuData, mockServices, mockLogs } from '../data/mockData';

export const useMonitoringData = () => {
  const [cpuData] = useState<Record<string, CPUData[]>>(mockCpuData);
  const [services] = useState<Service[]>(mockServices);
  const [logs] = useState<Log[]>(mockLogs);
  const [selectedLogService, setSelectedLogService] = useState<string>('All');
  const [selectedMetricService, setSelectedMetricService] = useState<string>('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');

  const filteredLogs = logs.filter(log => 
    (selectedLogService === 'All' || log.service === selectedLogService) &&
    (selectedSeverity === 'All' || log.severity === selectedSeverity)
  );

  return {
    cpuData,
    services,
    logs: filteredLogs,
    selectedLogService,
    setSelectedLogService,
    selectedMetricService,
    setSelectedMetricService,
    selectedSeverity,
    setSelectedSeverity
  };
};