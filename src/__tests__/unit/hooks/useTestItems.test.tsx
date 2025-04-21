import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useTestItems from '../../../components/testing/hooks/useTestItems';
import { mockTestItems } from '../../../mocks/mockData';

describe('useTestItems', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Mock fetch function
    global.fetch = vi.fn();
  });
  
  it('initializes with empty test items', () => {
    const { result } = renderHook(() => useTestItems('ms1'));
    
    expect(result.current.testItems).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
  });
  
  it('fetches test items when microserviceId is provided', async () => {
    // Mock successful API response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockTestItems }),
    });
    
    const { result, rerender } = renderHook(
      ({ microserviceId }) => useTestItems(microserviceId),
      { initialProps: { microserviceId: 'ms1' } }
    );
    
    // Wait for the fetch to complete
    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));
    
    expect(result.current.testItems).toEqual(mockTestItems);
    expect(result.current.error).toBe(null);
    expect(global.fetch).toHaveBeenCalledWith('/api/tests?microserviceId=ms1');
  });
  
  it('handles API error correctly', async () => {
    // Mock API error
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });
    
    const { result } = renderHook(() => useTestItems('ms1'));
    
    // Wait for the fetch to complete
    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));
    
    expect(result.current.testItems).toEqual([]);
    expect(result.current.error).toMatch(/failed to fetch test items/i);
  });
  
  it('refetches when microserviceId changes', async () => {
    // First fetch for ms1
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        success: true, 
        data: mockTestItems.filter(t => t.microserviceId === 'ms1') 
      }),
    });
    
    const { result, rerender } = renderHook(
      ({ microserviceId }) => useTestItems(microserviceId),
      { initialProps: { microserviceId: 'ms1' } }
    );
    
    // Wait for the first fetch to complete
    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // Reset and mock second fetch for ms2
    (global.fetch as any).mockReset();
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        success: true, 
        data: mockTestItems.filter(t => t.microserviceId === 'ms2') 
      }),
    });
    
    // Change microserviceId to trigger refetch
    rerender({ microserviceId: 'ms2' });
    
    // Should be loading again
    expect(result.current.isLoading).toBe(true);
    
    // Wait for the second fetch to complete
    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // Should have fetched with the new microserviceId
    expect(global.fetch).toHaveBeenCalledWith('/api/tests?microserviceId=ms2');
    expect(result.current.testItems).toEqual(
      mockTestItems.filter(t => t.microserviceId === 'ms2')
    );
  });
  
  it('toggles expanded state for a test item', async () => {
    // Mock successful API response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockTestItems }),
    });
    
    const { result } = renderHook(() => useTestItems('ms1'));
    
    // Wait for the fetch to complete
    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // Initially no items should be expanded
    expect(result.current.expandedItems).toEqual({});
    
    // Expand an item
    act(() => {
      result.current.toggleExpandedItem('test1');
    });
    
    expect(result.current.expandedItems).toEqual({ test1: true });
    
    // Toggle it again (collapse)
    act(() => {
      result.current.toggleExpandedItem('test1');
    });
    
    expect(result.current.expandedItems).toEqual({ test1: false });
  });
  
  it('handles running a test', async () => {
    // Mock successful API response for test items
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockTestItems }),
    });
    
    const { result } = renderHook(() => useTestItems('ms1'));
    
    // Wait for the fetch to complete
    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // Mock successful API response for running a test
    (global.fetch as any).mockReset();
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Test started successfully' }),
    });
    
    // Run a test
    act(() => {
      result.current.runTest('test1');
    });
    
    // Should set running state for the test
    expect(result.current.runningTests).toEqual({ test1: true });
    
    // Wait for the API call to complete
    await vi.waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
      '/api/tests/test1/run',
      expect.objectContaining({ method: 'POST' })
    ));
    
    // Running state should be cleared
    expect(result.current.runningTests).toEqual({ test1: false });
  });
  
  it('handles viewing test output', async () => {
    // Mock successful API response for test items
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockTestItems }),
    });
    
    const { result } = renderHook(() => useTestItems('ms1'));
    
    // Wait for the fetch to complete
    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // View test output
    act(() => {
      result.current.viewTestOutput('test1');
    });
    
    expect(result.current.selectedTestId).toBe('test1');
    expect(result.current.isOutputModalOpen).toBe(true);
    
    // Close modal
    act(() => {
      result.current.closeOutputModal();
    });
    
    expect(result.current.isOutputModalOpen).toBe(false);
  });
});
