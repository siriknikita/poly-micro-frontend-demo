import { vi, describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/components/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { db } from '@/db/db';

// Mock the react-router-dom useNavigate hook
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn()
}));

// Mock the database with Dexie's query API structure
vi.mock('@/db/db', () => {
  // Create mock functions for Dexie queries
  const mockFirst = vi.fn();
  const mockEquals = vi.fn().mockImplementation(() => ({ first: mockFirst }));
  const mockWhere = vi.fn().mockImplementation(() => ({ equals: mockEquals }));
  
  return {
    db: {
      users: {
        where: mockWhere,
        add: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        get: vi.fn()
      },
      projects: {
        where: mockWhere,
        toArray: vi.fn(),
        add: vi.fn(),
        update: vi.fn(),
        get: vi.fn()
      }
    }
  };
});

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('useAuth', () => {
  const mockNavigate = vi.fn();
  const mockUser = {
    id: 1,
    username: 'testuser',
    password: 'password123',
    email: 'test@example.com',
    businessName: 'Test Business'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.clear();
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
  });

  it('initializes with loading state and no user', () => {
    /**
     * Steps:
     * 1. Mock localStorage.getItem to return null (no user)
     * 2. Render the useAuth hook
     * 3. Check initial state
     */
    // Mock localStorage.getItem to return null (no user)
    mockLocalStorage.getItem.mockReturnValueOnce(null);

    const { result } = renderHook(() => useAuth());

    // Initial state should be loading
    expect(result.current.isLoading).toBe(false); 
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('loads user from localStorage on initialization', async () => {
    /**
     * Steps:
     * 1. Setup localStorage with a user
     * 2. Render the useAuth hook
     * 3. Check initial state
     */
    // Setup localStorage with a user
    const storedUser = JSON.stringify(mockUser);
    mockLocalStorage.getItem.mockReturnValueOnce(storedUser);
    
    const { result } = renderHook(() => useAuth());
    
    await vi.waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('handles login success', async () => {
    /**
     * Steps:
     * 1. Create a test user that matches the mock in the test
     * 2. Mock db.users.where().equals().first() to return our test user
     * 3. Render the useAuth hook
     * 4. Call login with correct credentials
     * 5. Check state after login
     * 6. Check localStorage
     */
    // Create a test user that matches the mock in the test
    const testUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      businessName: 'Test Business',
      password: 'password123'
    };
    
    // Mock db.users.where().equals().first() to return our test user
    vi.mocked(db.users.where('username').equals('testuser').first).mockResolvedValueOnce(testUser as any);

    const { result } = renderHook(() => useAuth());

    // Mock successful login
    await act(async () => {
      await result.current.login('testuser', 'password123');
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(testUser);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('currentUser', JSON.stringify(testUser));
  });

  it('handles login failure with invalid credentials', async () => {
    /**
     * Steps:
     * 1. Mock db.users.where().equals().first() to return null (user not found)
     * 2. Render the useAuth hook
     * 3. Call login with invalid credentials
     * 4. Check state after failed login
     */
    // Mock db.users.where().equals().first() to return null (user not found)
    vi.mocked(db.users.where('username').equals('wronguser').first).mockResolvedValueOnce(null);

    const { result } = renderHook(() => useAuth());

    // Mock failed login
    await expect(result.current.login('wronguser', 'wrongpassword'))
      .rejects.toThrow('Invalid username or password');
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('handles login failure with correct username but wrong password', async () => {
    /**
     * Steps:
     * 1. Mock db.users.where().equals().first() to return a user with different password
     * 2. Render the useAuth hook
     * 3. Call login with correct username but wrong password
     * 4. Check state after failed login
     */
    // Mock db.users.where().equals().first() to return a user with different password
    vi.mocked(db.users.where('username').equals('testuser').first).mockResolvedValueOnce({
      id: 1,
      username: 'testuser',
      password: 'correctpassword', // Different from what we'll try to login with
      email: 'test@example.com',
      businessName: 'Test Business'
    } as any);

    const { result } = renderHook(() => useAuth());

    // Mock failed login
    await expect(result.current.login('testuser', 'wrongpassword'))
      .rejects.toThrow('Invalid username or password');
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('handles registration success', async () => {
    /**
     * Steps:
     * 1. Mock db.users.where().equals().first() to return null (username doesn't exist)
     * 2. Render the useAuth hook
     * 3. Call register with new user data
     * 4. Check state after registration
     * 5. Check localStorage
     */
    // Mock db.users.where().equals().first() to return null (username doesn't exist)
    vi.mocked(db.users.where('username').equals('newuser').first).mockResolvedValueOnce(null);
    
    const { result } = renderHook(() => useAuth());

    const newUser = {
      username: 'newuser',
      password: 'newpassword',
      email: 'new@example.com',
      businessName: 'New Business'
    };

    await act(async () => {
      await result.current.register(newUser);
    });
    
    expect(db.users.add).toHaveBeenCalledWith(newUser);
  });

  it('handles registration failure when username exists', async () => {
    /**
     * Steps:
     * 1. Mock db.users.where().equals().first() to return a user (username exists)
     * 2. Render the useAuth hook
     * 3. Call register with existing username
     * 4. Check state after failed registration
     */
    // Mock db.users.where().equals().first() to return a user (username exists)
    vi.mocked(db.users.where('username').equals('testuser').first).mockResolvedValueOnce({
      id: 1,
      username: 'testuser',
      password: 'password123',
      email: 'test@example.com',
      businessName: 'Test Business'
    } as any);

    const { result } = renderHook(() => useAuth());

    const newUser = {
      username: 'testuser', // Same username as existing user
      password: 'newpassword',
      email: 'new@example.com',
      businessName: 'New Business'
    };

    await expect(result.current.register(newUser))
      .rejects.toThrow('Username already exists');
    
    expect(db.users.add).not.toHaveBeenCalled();
  });

  it('handles logout correctly', () => {
    /**
     * Steps:
     * 1. Setup: First set a user in the state
     * 2. Render the useAuth hook
     * 3. Call logout
     * 4. Check state after logout
     * 5. Check localStorage
     */
    // Setup: First set a user in the state
    const testUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      businessName: 'Test Business',
      password: 'password123'
    };
    
    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(testUser));
    const { result } = renderHook(() => useAuth());
    
    // Verify user is logged in
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(testUser);

    // Act: Logout
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('currentUser');
  });
});

/**
 * | Test Number | Testing Environment | Test | Expected Result | Result |
 * |-----------|----------------------|------|------------------|--------|
 * | 1 | Web Browser | - Render the useAuth hook <br> - Check for initial state <br> - Check for successful login | should initialize with loading state and no user | + |
 * | 2 | Web Browser | - Render the useAuth hook <br> - Check for initial state <br> - Check for successful login | should load user from localStorage on initialization | + |
 * | 3 | Web Browser | - Render the useAuth hook <br> - Check for initial state <br> - Check for successful login | should handle login success | + |
 * | 4 | Web Browser | - Render the useAuth hook <br> - Check for initial state <br> - Check for successful login | should handle login failure with invalid credentials | + |
 * | 5 | Web Browser | - Render the useAuth hook <br> - Check for initial state <br> - Check for successful login | should handle login failure with correct username but wrong password | + |
 * | 6 | Web Browser | - Render the useAuth hook <br> - Check for initial state <br> - Check for successful login | should handle registration success | + |
 * | 7 | Web Browser | - Render the useAuth hook <br> - Check for initial state <br> - Check for successful login | should handle registration failure when username exists | + |
 * | 8 | Web Browser | - Render the useAuth hook <br> - Check for initial state <br> - Check for successful login | should handle logout correctly | + |
 */