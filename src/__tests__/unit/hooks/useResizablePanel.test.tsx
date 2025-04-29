import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useResizablePanel } from '../../../components/testing/hooks/useResizablePanel';
import { CHAT_PANEL } from '../../../components/testing/constants';

describe('useResizablePanel', () => {
  let originalAddEventListener: typeof document.addEventListener;
  let originalRemoveEventListener: typeof document.removeEventListener;
  let addEventListenerSpy: ReturnType<typeof vi.fn>;
  let removeEventListenerSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Create spies for addEventListener and removeEventListener
    originalAddEventListener = document.addEventListener;
    originalRemoveEventListener = document.removeEventListener;
    
    addEventListenerSpy = vi.fn();
    removeEventListenerSpy = vi.fn();
    
    document.addEventListener = addEventListenerSpy as typeof document.addEventListener;
    document.removeEventListener = removeEventListenerSpy as typeof document.removeEventListener;
    
    // Mock document.body.classList methods
    document.body.classList.add = vi.fn();
    document.body.classList.remove = vi.fn();
    
    // Reset mocks between tests
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original methods
    document.addEventListener = originalAddEventListener;
    document.removeEventListener = originalRemoveEventListener;
  });

  it('initializes with default values', () => {
    /**
     * Steps:
     * 1. Render the useResizablePanel hook
     * 2. Check for initial state
     * 3. Check for default width
     * 4. Check for default isDragging
     */
    const { result } = renderHook(() => useResizablePanel());
    
    expect(result.current.width).toBe(CHAT_PANEL.DEFAULT_WIDTH);
    expect(result.current.isDragging).toBe(false);
  });
  
  it('initializes with custom values', () => {
    /**
     * Steps:
     * 1. Render the useResizablePanel hook
     * 2. Check for initial state
     * 3. Check for custom width
     */
    const { result } = renderHook(() => useResizablePanel({
      initialWidth: 500,
      minWidth: 250,
      maxWidth: 800
    }));
    
    expect(result.current.width).toBe(500);
  });
  
  it('starts resizing on mouse down', () => {
    /**
     * Steps:
     * 1. Render the useResizablePanel hook
     * 2. Check for initial state
     * 3. Check for isDragging
     */
    const { result } = renderHook(() => useResizablePanel());
    
    act(() => {
      result.current.startResize({ preventDefault: vi.fn(), clientX: 100 } as unknown as React.MouseEvent<HTMLDivElement>);
    });
    
    expect(result.current.isDragging).toBe(true);
  });
  
  it('sets up event listeners when dragging starts', () => {
    /**
     * Steps:
     * 1. Render the useResizablePanel hook
     * 2. Check for initial state
     * 3. Check for event listeners
     */
    const { result } = renderHook(() => useResizablePanel());
    
    act(() => {
      result.current.startResize({ preventDefault: vi.fn(), clientX: 100 } as unknown as React.MouseEvent<HTMLDivElement>);
    });
    
    // Should add mousemove and mouseup event listeners
    expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
    
    // Should add no-select class to body
    expect(document.body.classList.add).toHaveBeenCalledWith('resize-no-select');
  });
  
  it('cleans up event listeners when unmounted', () => {
    /**
     * Steps:
     * 1. Render the useResizablePanel hook
     * 2. Check for initial state
     * 3. Check for event listeners
     */
    const { result, unmount } = renderHook(() => useResizablePanel());
    
    act(() => {
      result.current.startResize({ preventDefault: vi.fn(), clientX: 100 } as unknown as React.MouseEvent<HTMLDivElement>);
    });
    
    unmount();
    
    // Should remove event listeners and classes
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
    expect(document.body.classList.remove).toHaveBeenCalledWith('resize-no-select');
  });
});

/**
 * | Test Number | Testing Environment | Test | Expected Result | Result |
 * |-----------|----------------------|------|------------------|--------|
 * | 1 | Web Browser | - Render the useMicroserviceNavigation hook <br> - Check for initial state <br> - Check for correct rendering | initializes with custom values| + |
 * | 2 | Web Browser | - Render the useMicroserviceNavigation hook <br> - Check for initial state <br> - Check for correct rendering | starts resizing on mouse down| + |
 * | 3 | Web Browser | - Render the useMicroserviceNavigation hook <br> - Check for initial state <br> - Check for correct rendering | sets up event listeners when dragging starts| + |
 * | 4 | Web Browser | - Render the useMicroserviceNavigation hook <br> - Check for initial state <br> - Check for correct rendering | cleans up event listeners when unmounted| + |
 * | 5 | Web Browser | - Render the useMicroserviceNavigation hook <br> - Check for initial state <br> - Check for correct rendering | initializes with default values| + |
 */