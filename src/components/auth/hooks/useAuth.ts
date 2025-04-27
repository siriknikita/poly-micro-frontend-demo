import { useState, useEffect, useCallback } from 'react';
import { User, db } from '@/db/db';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<void> => {
    try {
      const user = await db.users
        .where('username')
        .equals(username)
        .first();
      
      if (user && user.password === password) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
        return Promise.resolve();
      } else {
        return Promise.reject(new Error('Invalid username or password'));
      }
    } catch (error) {
      console.error('Login failed:', error);
      return Promise.reject(new Error('Login failed'));
    }
  }, []);

  const register = useCallback(async (userData: Omit<User, 'id'>): Promise<void> => {
    try {
      const existingUser = await db.users.where('username').equals(userData.username).first();
      if (existingUser) {
        return Promise.reject(new Error('Username already exists'));
      }
      await db.users.add(userData);
      return Promise.resolve();
    } catch (error) {
      console.error('Registration failed:', error);
      return Promise.reject(new Error('Registration failed'));
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('currentUser');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
    // Navigation will be handled by the component that uses this hook
  }, []);

  return {
    ...authState,
    login,
    register,
    logout
  };
}
