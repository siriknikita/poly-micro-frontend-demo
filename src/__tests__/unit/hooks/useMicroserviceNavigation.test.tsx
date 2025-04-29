import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMicroserviceNavigation } from '@/components/testing/hooks/useMicroserviceNavigation';
import { mockMicroservices } from '../../mocks/mockData';

describe('useMicroserviceNavigation', () => {

  it('initializes with empty microservices list', () => {
    /**
     * Steps:
     * 1. Render the useMicroserviceNavigation hook
     * 2. Check for initial state
     * 3. Check for empty microservices list
     * 4. Check for empty filtered microservices list
     * 5. Check for empty search query
     */
    const { result } = renderHook(() => useMicroserviceNavigation({
      microservices: []
    }));
    
    expect(result.current.selectedMicroservice).toBe(null);
    expect(result.current.filteredMicroservices).toEqual([]);
    expect(result.current.searchQuery).toBe('');
  });
  
  it('selects the first microservice by default', () => {
    /**
     * Steps:
     * 1. Render the useMicroserviceNavigation hook
     * 2. Check for initial state
     * 3. Check for first microservice
     */
    const projectMicroservices = mockMicroservices.filter(ms => ms.projectId === 'project1');
    
    const { result } = renderHook(() => useMicroserviceNavigation({
      microservices: projectMicroservices
    }));
    
    expect(result.current.selectedMicroservice).toEqual(projectMicroservices[0]);
  });
  
  it('uses initialMicroservice when provided', () => {
    /**
     * Steps:
     * 1. Render the useMicroserviceNavigation hook
     * 2. Check for initial state
     * 3. Check for initial microservice
     */
    const projectMicroservices = mockMicroservices.filter(ms => ms.projectId === 'project1');
    const initialMicroservice = projectMicroservices[1]; // User Service
    
    const { result } = renderHook(() => useMicroserviceNavigation({
      microservices: projectMicroservices,
      initialMicroservice
    }));
    
    expect(result.current.selectedMicroservice).toEqual(initialMicroservice);
  });
  
  it('changes the selected microservice', () => {
    /**
     * Steps:
     * 1. Render the useMicroserviceNavigation hook
     * 2. Check for initial state
     * 3. Check for selected microservice
     */
    const projectMicroservices = mockMicroservices.filter(ms => ms.projectId === 'project1');
    
    const { result } = renderHook(() => useMicroserviceNavigation({
      microservices: projectMicroservices
    }));
    
    // Select a different microservice
    act(() => {
      result.current.setSelectedMicroservice(projectMicroservices[1]);
    });
    
    expect(result.current.selectedMicroservice).toEqual(projectMicroservices[1]);
  });
  
  it('resets selected microservice when microservices array changes', () => {
    /**
     * Steps:
     * 1. Render the useMicroserviceNavigation hook
     * 2. Check for initial state
     * 3. Check for selected microservice
     */
    const project1Microservices = mockMicroservices.filter(ms => ms.projectId === 'project1');
    
    const { result, rerender } = renderHook(
      (props) => useMicroserviceNavigation(props),
      { initialProps: { microservices: project1Microservices } }
    );
    
    // Initially selects first microservice from project1
    expect(result.current.selectedMicroservice).toEqual(project1Microservices[0]);
    
    // Change to project2 microservices
    const project2Microservices = mockMicroservices.filter(ms => ms.projectId === 'project2');
    rerender({ microservices: project2Microservices });
    
    // Should reset to first microservice in project2
    expect(result.current.selectedMicroservice).toEqual(project2Microservices[0]);
  });
  
  it('handles filtering microservices by search query', () => {
    /**
     * Steps:
     * 1. Render the useMicroserviceNavigation hook
     * 2. Check for initial state
     * 3. Check for filtered microservices
     */
    const projectMicroservices = mockMicroservices.filter(ms => ms.projectId === 'project1');
    
    const { result } = renderHook(() => useMicroserviceNavigation({
      microservices: projectMicroservices
    }));
    
    // Set search query to filter for "user"
    act(() => {
      result.current.setSearchQuery('user');
    });
    
    // Should filter microservices to only show User Service
    expect(result.current.filteredMicroservices.length).toBe(1);
    expect(result.current.filteredMicroservices[0].name).toBe('User Service');
  });
  
  it('navigates to previous microservice', () => {
    /**
     * Steps:
     * 1. Render the useMicroserviceNavigation hook
     * 2. Check for initial state
     * 3. Check for previous microservice
     */
    const projectMicroservices = mockMicroservices.filter(ms => ms.projectId === 'project1');
    
    const { result } = renderHook(() => useMicroserviceNavigation({
      microservices: projectMicroservices
    }));
    
    // Initially selects first microservice (Authentication Service)
    expect(result.current.selectedMicroservice?.name).toBe('Authentication Service');
    
    // Navigate up (should wrap around to the last item)
    act(() => {
      result.current.navigateMicroservice('up');
    });
    
    // Should select the last microservice (Payment Service)
    expect(result.current.selectedMicroservice?.name).toBe('Payment Service');
  });
  
  it('navigates to next microservice', () => {
    /**
     * Steps:
     * 1. Render the useMicroserviceNavigation hook
     * 2. Check for initial state
     * 3. Check for next microservice
     */
    const projectMicroservices = mockMicroservices.filter(ms => ms.projectId === 'project1');
    
    const { result } = renderHook(() => useMicroserviceNavigation({
      microservices: projectMicroservices
    }));
    
    // Initially selects first microservice (Authentication Service)
    expect(result.current.selectedMicroservice?.name).toBe('Authentication Service');
    
    // Navigate down
    act(() => {
      result.current.navigateMicroservice('down');
    });
    
    // Should select the next microservice (User Service)
    expect(result.current.selectedMicroservice?.name).toBe('User Service');
  });
  
  it('gets previous microservice name', () => {
    /**
     * Steps:
     * 1. Render the useMicroserviceNavigation hook
     * 2. Check for initial state
     * 3. Check for previous microservice
     */
    const projectMicroservices = mockMicroservices.filter(ms => ms.projectId === 'project1');
    
    const { result } = renderHook(() => useMicroserviceNavigation({
      microservices: projectMicroservices
    }));
    
    // Select the middle microservice (User Service)
    act(() => {
      result.current.setSelectedMicroservice(projectMicroservices[1]);
    });
    
    // Previous should be Authentication Service
    expect(result.current.getPreviousMicroserviceName()).toBe('Authentication Service');
  });
  
  it('gets next microservice name', () => {
    /**
     * Steps:
     * 1. Render the useMicroserviceNavigation hook
     * 2. Check for initial state
     * 3. Check for next microservice
     */
    const projectMicroservices = mockMicroservices.filter(ms => ms.projectId === 'project1');
    
    const { result } = renderHook(() => useMicroserviceNavigation({
      microservices: projectMicroservices
    }));
    
    // Select the middle microservice (User Service)
    act(() => {
      result.current.setSelectedMicroservice(projectMicroservices[1]);
    });
    
    // Next should be Payment Service
    expect(result.current.getNextMicroserviceName()).toBe('Payment Service');
  });
  
  it('clears search query when microservices change', () => {
    /**
     * Steps:
     * 1. Render the useMicroserviceNavigation hook
     * 2. Check for initial state
     * 3. Check for search query
     */
    const project1Microservices = mockMicroservices.filter(ms => ms.projectId === 'project1');
    
    const { result, rerender } = renderHook(
      (props) => useMicroserviceNavigation(props),
      { initialProps: { microservices: project1Microservices } }
    );
    
    // Set a search query
    act(() => {
      result.current.setSearchQuery('user');
    });
    
    expect(result.current.searchQuery).toBe('user');
    
    // Change microservices
    const project2Microservices = mockMicroservices.filter(ms => ms.projectId === 'project2');
    rerender({ microservices: project2Microservices });
    
    // Search query should be cleared
    expect(result.current.searchQuery).toBe('');
  });
});

/**
 * | Test Number | Testing Environment | Test | Expected Result | Result |
 * |-----------|----------------------|------|------------------|--------|
 * | 1 | Web Browser | - Render the TestItemComponent <br> - Check for initial state <br> - Check for correct rendering | initializes with empty microservices list| + |
 * | 2 | Web Browser | - Render the TestItemComponent <br> - Check for initial state <br> - Check for correct rendering | selects the first microservice by default| + |
 * | 3 | Web Browser | - Render the TestItemComponent <br> - Check for initial state <br> - Check for correct rendering | uses initialMicroservice when provided| + |
 * | 4 | Web Browser | - Render the TestItemComponent <br> - Check for initial state <br> - Check for correct rendering | changes the selected microservice| + |
 * | 5 | Web Browser | - Render the TestItemComponent <br> - Check for initial state <br> - Check for correct rendering | resets selected microservice when microservices array changes| + |
 * | 6 | Web Browser | - Render the TestItemComponent <br> - Check for initial state <br> - Check for correct rendering | handles filtering microservices by search query| + |
 * | 7 | Web Browser | - Render the TestItemComponent <br> - Check for initial state <br> - Check for correct rendering | navigates to previous microservice| + |
 * | 8 | Web Browser | - Render the TestItemComponent <br> - Check for initial state <br> - Check for correct rendering | navigates to next microservice| + |
 * | 9 | Web Browser | - Render the TestItemComponent <br> - Check for initial state <br> - Check for correct rendering | gets previous microservice name| + |
 * | 10 | Web Browser | - Render the TestItemComponent <br> - Check for initial state <br> - Check for correct rendering | gets next microservice name| + |
 * | 11 | Web Browser | - Render the TestItemComponent <br> - Check for initial state <br> - Check for correct rendering | clears search query when microservices change| + |
 */