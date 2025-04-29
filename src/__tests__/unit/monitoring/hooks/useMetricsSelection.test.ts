import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMetricsSelection } from '../../../../components/monitoring/hooks/useMetricsSelection';
import { Metric } from '@/types';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    getStore: () => store
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('useMetricsSelection Hook', () => {
  const defaultMetrics: Metric[] = [
    { id: 'load', name: 'CPU Load %', dataKey: 'load', color: '#4f46e5', selected: true },
    { id: 'memory', name: 'Memory Usage %', dataKey: 'memory', color: '#059669', selected: true },
    { id: 'threads', name: 'Active Threads', dataKey: 'threads', color: '#db2777', selected: true }
  ];

  const projectId = 'project1';
  const serviceName = 'service1';

  beforeEach(() => {
    mockLocalStorage.clear();
    vi.clearAllMocks();
  });

  it('should return default metrics when no stored preferences exist', () => {
    /**
     * Steps:
     * 1. Render the useMetricsSelection hook
     * 2. Check for initial state
     * 3. Check for default metrics
     */
    const { result } = renderHook(() => useMetricsSelection({
      projectId,
      serviceName,
      defaultMetrics
    }));

    expect(result.current.metrics).toEqual(defaultMetrics);
    expect(result.current.selectedMetricIds).toEqual(['load', 'memory', 'threads']);
  });

  it('should load stored preferences when they exist', () => {
    /**
     * Steps:
     * 1. Render the useMetricsSelection hook
     * 2. Check for initial state
     * 3. Check for stored preferences
     */
    // Setup stored preferences
    const storedPreferences = {
      [projectId]: {
        [serviceName]: ['load', 'memory'] // Only load and memory are selected
      }
    };
    mockLocalStorage.setItem('metrics-selection-preferences', JSON.stringify(storedPreferences));

    const { result } = renderHook(() => useMetricsSelection({
      projectId,
      serviceName,
      defaultMetrics
    }));

    // Verify metrics have correct selected state based on stored preferences
    expect(result.current.metrics).toEqual([
      { id: 'load', name: 'CPU Load %', dataKey: 'load', color: '#4f46e5', selected: true },
      { id: 'memory', name: 'Memory Usage %', dataKey: 'memory', color: '#059669', selected: true },
      { id: 'threads', name: 'Active Threads', dataKey: 'threads', color: '#db2777', selected: false }
    ]);
    expect(result.current.selectedMetricIds).toEqual(['load', 'memory']);
  });

  it('should update metrics selection and save to localStorage', () => {
    /**
     * Steps:
     * 1. Render the useMetricsSelection hook
     * 2. Check for initial state
     * 3. Check for update metrics selection
     */
    const { result } = renderHook(() => useMetricsSelection({
      projectId,
      serviceName,
      defaultMetrics
    }));

    // Initially all metrics are selected
    expect(result.current.selectedMetricIds).toEqual(['load', 'memory', 'threads']);

    // Update to only have 'load' selected
    act(() => {
      result.current.updateMetricSelection(['load']);
    });

    // Check that metrics state is updated
    expect(result.current.metrics).toEqual([
      { id: 'load', name: 'CPU Load %', dataKey: 'load', color: '#4f46e5', selected: true },
      { id: 'memory', name: 'Memory Usage %', dataKey: 'memory', color: '#059669', selected: false },
      { id: 'threads', name: 'Active Threads', dataKey: 'threads', color: '#db2777', selected: false }
    ]);
    expect(result.current.selectedMetricIds).toEqual(['load']);

    // Verify localStorage was updated
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
    const savedPreferences = JSON.parse(mockLocalStorage.getStore()['metrics-selection-preferences']);
    expect(savedPreferences[projectId][serviceName]).toEqual(['load']);
  });

  it('should handle localStorage errors gracefully', () => {
    /**
     * Steps:
     * 1. Render the useMetricsSelection hook
     * 2. Check for initial state
     * 3. Check for localStorage errors
     */
    // Mock localStorage.getItem to throw an error
    mockLocalStorage.getItem.mockImplementationOnce(() => {
      throw new Error('localStorage error');
    });

    // Should not throw and should use default metrics
    const { result } = renderHook(() => useMetricsSelection({
      projectId,
      serviceName,
      defaultMetrics
    }));

    expect(result.current.metrics).toEqual(defaultMetrics);
  });

  it('should update metrics when project or service changes', () => {
    /**
     * Steps:
     * 1. Render the useMetricsSelection hook
     * 2. Check for initial state
     * 3. Check for project or service changes
     */
    // Setup stored preferences for two different services
    const storedPreferences = {
      [projectId]: {
        [serviceName]: ['load', 'memory'],
        'service2': ['threads']
      }
    };
    mockLocalStorage.setItem('metrics-selection-preferences', JSON.stringify(storedPreferences));

    // Initial render with service1
    const { result, rerender } = renderHook(
      ({ projectId, serviceName }: { projectId: string, serviceName: string | null }) => useMetricsSelection({
        projectId,
        serviceName,
        defaultMetrics
      }),
      { initialProps: { projectId, serviceName } }
    );

    // Verify service1 preferences loaded
    expect(result.current.selectedMetricIds).toEqual(['load', 'memory']);

    // Change to service2
    rerender({ projectId, serviceName: 'service2' as string });

    // Verify service2 preferences loaded
    expect(result.current.selectedMetricIds).toEqual(['threads']);
  });
});

/**
 * | Test Number | Testing Environment | Test | Expected Result | Result |
 * |-----------|----------------------|------|------------------|--------|
 * | 1 | Web Browser | - Render the useMetricsSelection hook <br> - Check for initial state <br> - Check for correct rendering | renders correctly with all subcomponents | + |
 * | 2 | Web Browser | - Render the useMetricsSelection hook <br> - Check for initial state <br> - Check for correct rendering | allows service selection through the service selector | + |
 * | 3 | Web Browser | - Render the useMetricsSelection hook <br> - Check for initial state <br> - Check for correct rendering | shows correct selected state for metrics | + |
 * | 4 | Web Browser | - Render the useMetricsSelection hook <br> - Check for initial state <br> - Check for correct rendering | calls updateMetricSelection when metrics change | + |
 * | 5 | Web Browser | - Render the useMetricsSelection hook <br> - Check for initial state <br> - Check for correct rendering | handles localStorage errors gracefully | + |
 * | 6 | Web Browser | - Render the useMetricsSelection hook <br> - Check for initial state <br> - Check for correct rendering | updates metrics when project or service changes | + |
 */