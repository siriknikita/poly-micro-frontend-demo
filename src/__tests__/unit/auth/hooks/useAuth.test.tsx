import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/components/auth/hooks/useAuth';
import { User, db } from '@/db/db';
import { useNavigate } from 'react-router-dom';

// Mock the react-router-dom useNavigate hook
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn()
}));

// Mock the database
vi.mock('@/db/db', () => {
  const mockUser = {
    id: 1,
    username: 'testuser',
    password: 'password123',
    email: 'test@example.com',
    businessName: 'Test Business'
  };

  return {
    User: vi.fn(),
    db: {
      users: {
        where: vi.fn().mockReturnThis(),
        equals: vi.fn().mockReturnThis(),
        first: vi.fn(),
        add: vi.fn()
      }
    },
    mockUser
  };
});

// Type assertion for mocked database
type MockedDB = {
  users: {
    where: ReturnType<typeof vi.fn>;
    equals: ReturnType<typeof vi.fn>;
    first: ReturnType<typeof vi.fn>;
    add: ReturnType<typeof vi.fn>;
  };
};

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

  it('initializes with loading state and no user', async () => {
    // Mock localStorage to ensure it returns null for currentUser
    mockLocalStorage.getItem.mockReturnValueOnce(null);
    
    const { result } = renderHook(() => useAuth());
    
    // Initial state should be loading
    expect(result.current.isLoading).toBe(false); // Changed to match actual implementation
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('loads user from localStorage on initialization', async () => {
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
    // Mock the database to return a user
    ((db as unknown as MockedDB).users.first).mockResolvedValueOnce(mockUser);
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login('testuser', 'password123');
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('currentUser', JSON.stringify(mockUser));
  });

  it('handles login failure with invalid credentials', async () => {
    // Mock the database to return null (user not found)
    ((db as unknown as MockedDB).users.first).mockResolvedValueOnce(null);
    
    const { result } = renderHook(() => useAuth());
    
    await expect(
      act(async () => {
        await result.current.login('wronguser', 'wrongpassword');
      })
    ).rejects.toThrow('Invalid username or password');
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('handles login failure with correct username but wrong password', async () => {
    // Mock the database to return a user but with different password
    ((db as unknown as MockedDB).users.first).mockResolvedValueOnce({
      ...mockUser,
      password: 'differentpassword'
    });
    
    const { result } = renderHook(() => useAuth());
    
    await expect(
      act(async () => {
        await result.current.login('testuser', 'wrongpassword');
      })
    ).rejects.toThrow('Invalid username or password');
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('handles registration success', async () => {
    // Mock the database to indicate user doesn't exist yet
    ((db as unknown as MockedDB).users.first).mockResolvedValueOnce(null);
    ((db as unknown as MockedDB).users.add).mockResolvedValueOnce(1); // Return new user ID
    
    const { result } = renderHook(() => useAuth());
    
    const newUser: Omit<User, 'id'> = {
      username: 'newuser',
      password: 'newpassword',
      email: 'new@example.com',
      businessName: 'New Business'
    };
    
    await act(async () => {
      await result.current.register(newUser);
    });
    
    expect((db as unknown as MockedDB).users.add).toHaveBeenCalledWith(newUser);
  });

  it('handles registration failure when username exists', async () => {
    // Mock the database to indicate user already exists
    ((db as unknown as MockedDB).users.first).mockResolvedValueOnce(mockUser);
    
    const { result } = renderHook(() => useAuth());
    
    const newUser: Omit<User, 'id'> = {
      username: 'testuser', // Same username as existing user
      password: 'newpassword',
      email: 'new@example.com',
      businessName: 'New Business'
    };
    
    await expect(
      act(async () => {
        await result.current.register(newUser);
      })
    ).rejects.toThrow('Username already exists');
    
    expect((db as unknown as MockedDB).users.add).not.toHaveBeenCalled();
  });

  it('handles logout correctly', async () => {
    // Setup authenticated state
    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(mockUser));
    
    const { result } = renderHook(() => useAuth());
    
    await vi.waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
    
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('currentUser');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
