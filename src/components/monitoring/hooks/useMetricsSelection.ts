import { useState, useEffect, useMemo } from 'react';
import { Metric } from '@/types';

interface UseMetricsSelectionProps {
  projectId: string;
  serviceName: string | null;
  defaultMetrics: Metric[];
}

interface ServiceMetricsMap {
  [serviceId: string]: string[]; // service name -> selected metric ids
}

interface ProjectMetricsMap {
  [projectId: string]: ServiceMetricsMap;
}

export const useMetricsSelection = ({
  projectId,
  serviceName,
  defaultMetrics,
}: UseMetricsSelectionProps) => {
  // Create a unique key for localStorage
  const storageKey = 'metrics-selection-preferences';
  
  // Get the initial metrics state from localStorage or use defaults
  const getInitialMetrics = (): Metric[] => {
    try {
      const storedPreferences = localStorage.getItem(storageKey);
      
      if (storedPreferences && projectId && serviceName) {
        const preferences: ProjectMetricsMap = JSON.parse(storedPreferences);
        const projectPreferences = preferences[projectId];
        
        if (projectPreferences && projectPreferences[serviceName]) {
          const selectedMetricIds = projectPreferences[serviceName];
          
          // Apply stored selection to default metrics
          return defaultMetrics.map(metric => ({
            ...metric,
            selected: selectedMetricIds.includes(metric.id)
          }));
        }
      }
    } catch (error) {
      console.error('Error retrieving metrics preferences:', error);
    }
    
    // Return default metrics if no stored preferences or error
    return defaultMetrics;
  };

  // State for metrics
  const [metrics, setMetrics] = useState<Metric[]>(getInitialMetrics);
  
  // Update metrics when service or project changes
  useEffect(() => {
    if (projectId && serviceName) {
      setMetrics(getInitialMetrics());
    } else {
      // Reset to defaults if no service is selected
      setMetrics(defaultMetrics);
    }
  }, [projectId, serviceName]);

  // Selected metric IDs
  const selectedMetricIds = useMemo(() => 
    metrics.filter(m => m.selected).map(m => m.id),
  [metrics]);

  // Update metric selection
  const updateMetricSelection = (metricIds: string[]) => {
    const updatedMetrics = metrics.map(metric => ({
      ...metric,
      selected: metricIds.includes(metric.id)
    }));
    
    setMetrics(updatedMetrics);
    
    // Save to localStorage
    if (projectId && serviceName) {
      try {
        const storedPreferences = localStorage.getItem(storageKey);
        const preferences: ProjectMetricsMap = storedPreferences 
          ? JSON.parse(storedPreferences) 
          : {};
        
        // Ensure project exists in preferences
        if (!preferences[projectId]) {
          preferences[projectId] = {};
        }
        
        // Update service preferences
        preferences[projectId][serviceName] = metricIds;
        
        // Save back to localStorage
        localStorage.setItem(storageKey, JSON.stringify(preferences));
      } catch (error) {
        console.error('Error saving metrics preferences:', error);
      }
    }
  };

  return {
    metrics,
    selectedMetricIds,
    updateMetricSelection
  };
};

export default useMetricsSelection;
