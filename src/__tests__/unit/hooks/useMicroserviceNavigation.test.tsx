import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMicroserviceNavigation } from '@/components/testing/hooks/useMicroserviceNavigation';
import { mockMicroservices } from '../../mocks/mockData';

describe('useMicroserviceNavigation', () => {
  // Mock localStorage
  let localStorageMock: Record<string, string> = {};
  
  beforeEach(() => {
    // Clear mock localStorage before each test
    localStorageMock = {};
    
    // Mock localStorage methods
    global.Storage.prototype.getItem = vi.fn((key) => localStorageMock[key] || null);
    global.Storage.prototype.setItem = vi.fn((key, value) => {
      localStorageMock[key] = value.toString();
    });
    
    // Mock fetch function
    global.fetch = vi.fn();
  });
  
  it('initializes with empty microservices list', () => {
    const { result } = renderHook(() => useMicroserviceNavigation('project1'));
    
    expect(result.current.microservices).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.selectedMicroserviceId).toBe(null);
  });
  
  it('fetches microservices when projectId is provided', async () => {
    // Mock successful API response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        success: true, 
        data: mockMicroservices.filter(ms => ms.projectId === 'project1') 
      }),
    });
    
    const { result } = renderHook(() => useMicroserviceNavigation('project1'));
    
    // Wait for the fetch to complete
    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));
    
    expect(result.current.microservices).toEqual(
      mockMicroservices.filter(ms => ms.projectId === 'project1')
    );
    expect(result.current.error).toBe(null);
    expect(global.fetch).toHaveBeenCalledWith('/api/microservices?projectId=project1');
  });
  
  it('selects the first microservice when none is stored in localStorage', async () => {
    const projectMicroservices = mockMicroservices.filter(ms => ms.projectId === 'project1');
    
    // Mock successful API response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: projectMicroservices }),
    });
    
    const { result } = renderHook(() => useMicroserviceNavigation('project1'));
    
    // Wait for the fetch to complete
    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // Should select the first microservice by default
    expect(result.current.selectedMicroserviceId).toBe(projectMicroservices[0].id);
    expect(localStorageMock['selected-microservice-project1']).toBe(projectMicroservices[0].id);
  });
  
  it('selects the stored microservice from localStorage', async () => {
    // Set a stored microservice in localStorage
    localStorageMock['selected-microservice-project1'] = 'ms2';
    
    // Mock successful API response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        success: true, 
        data: mockMicroservices.filter(ms => ms.projectId === 'project1') 
      }),
    });
    
    const { result } = renderHook(() => useMicroserviceNavigation('project1'));
    
    // Wait for the fetch to complete
    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // Should select the stored microservice
    expect(result.current.selectedMicroserviceId).toBe('ms2');
  });
  
  it('changes the selected microservice when navigating', async () => {
    // Mock successful API response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        success: true, 
        data: mockMicroservices.filter(ms => ms.projectId === 'project1') 
      }),
    });
    
    const { result } = renderHook(() => useMicroserviceNavigation('project1'));
    
    // Wait for the fetch to complete
    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // Navigate to a specific microservice
    act(() => {
      result.current.navigateToMicroservice('ms2');
    });
    
    expect(result.current.selectedMicroserviceId).toBe('ms2');
    expect(localStorageMock['selected-microservice-project1']).toBe('ms2');
  });
  
  it('handles API error correctly', async () => {
    // Mock API error
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });
    
    const { result } = renderHook(() => useMicroserviceNavigation('project1'));
    
    // Wait for the fetch to complete
    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));
    
    expect(result.current.microservices).toEqual([]);
    expect(result.current.error).toMatch(/failed to fetch microservices/i);
  });
  
  it('refetches when projectId changes', async () => {
    // First fetch for project1
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        success: true, 
        data: mockMicroservices.filter(ms => ms.projectId === 'project1') 
      }),
    });
    
    const { result, rerender } = renderHook(
      ({ projectId }) => useMicroserviceNavigation(projectId),
      { initialProps: { projectId: 'project1' } }
    );
    
    // Wait for the first fetch to complete
    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // Reset and mock second fetch for project2
    (global.fetch as any).mockReset();
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        success: true, 
        data: mockMicroservices.filter(ms => ms.projectId === 'project2') 
      }),
    });
    
    // Change projectId to trigger refetch
    rerender({ projectId: 'project2' });
    
    // Should be loading again
    expect(result.current.isLoading).toBe(true);
    
    // Wait for the second fetch to complete
    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // Should have fetched with the new projectId
    expect(global.fetch).toHaveBeenCalledWith('/api/microservices?projectId=project2');
    expect(result.current.microservices).toEqual(
      mockMicroservices.filter(ms => ms.projectId === 'project2')
    );
  });
  
  it('handles filtering microservices by search query', async () => {
    // Mock successful API response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        success: true, 
        data: mockMicroservices.filter(ms => ms.projectId === 'project1') 
      }),
    });
    
    const { result } = renderHook(() => useMicroserviceNavigation('project1'));
    
    // Wait for the fetch to complete
    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // Set search query
    act(() => {
      result.current.setSearchQuery('service 1');
    });
    
    // Should filter microservices based on the search query
    expect(result.current.filteredMicroservices.length).toBe(1);
    expect(result.current.filteredMicroservices[0].name).toContain('service 1');
    
    // Clear search query
    act(() => {
      result.current.setSearchQuery('');
    });
    
    // Should show all microservices again
    expect(result.current.filteredMicroservices.length).toBe(
      mockMicroservices.filter(ms => ms.projectId === 'project1').length
    );
  });
});
