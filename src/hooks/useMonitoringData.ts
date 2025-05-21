import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Log } from '@/types';

const API_BASE_URL = 'http://localhost:8000/api';

export default function useMonitoringData(selectedProjectId: string) {
  const {
    data: cpuData,
    isLoading: cpuLoading,
    error: cpuError,
  } = useQuery({
    queryKey: ['cpuData', selectedProjectId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/metrics/cpu/project/${selectedProjectId}`);
      if (!response.ok) throw new Error('Failed to fetch CPU data');
      return response.json();
    },
    enabled: !!selectedProjectId,
  });
  console.log('cpuData', cpuData);

  const {
    data: servicesData,
    isLoading: servicesLoading,
    error: servicesError,
  } = useQuery({
    queryKey: ['services', selectedProjectId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/services/project/${selectedProjectId}`);
      if (!response.ok) throw new Error('Failed to fetch services');
      return response.json();
    },
    enabled: !!selectedProjectId,
  });
  console.log('servicesData', servicesData);

  const {
    data: logsData,
    isLoading: logsLoading,
    error: logsError,
  } = useQuery({
    queryKey: ['logs'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/logs`);
      if (!response.ok) throw new Error('Failed to fetch logs');
      return response.json();
    },
  });

  const loading = cpuLoading || servicesLoading || logsLoading;
  const error =
    cpuError || servicesError || logsError
      ? cpuError?.message || servicesError?.message || logsError?.message
      : null;

  const [selectedLogService, setSelectedLogService] = useState<string>('All');
  const [selectedMetricService, setSelectedMetricService] = useState<string>('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');

  const filteredLogs = logsData?.filter(
    (log: Log) =>
      (selectedLogService === 'All' || log.service === selectedLogService) &&
      (selectedSeverity === 'All' || log.severity === selectedSeverity),
  );

  return {
    cpuData: cpuData || [],
    services: servicesData || [],
    logs: filteredLogs || [],
    selectedLogService,
    setSelectedLogService,
    selectedMetricService,
    setSelectedMetricService,
    selectedSeverity,
    setSelectedSeverity,
    selectedProjectId,
    loading,
    error,
  };
}
