import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/components/auth/hooks/useAuth';
import userEvent from '@testing-library/user-event';

// Mock the useAuth hook
vi.mock('@/components/auth/hooks/useAuth', () => ({
  useAuth: vi.fn()
}));

// Mock the useNavigate hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

describe('LoginForm', () => {
  const mockLogin = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup the useAuth mock
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
      user: null,
      isLoading: false
    });
  });
  
  const renderLoginForm = () => {
    return render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
  };
  
  it('renders the login form correctly', () => {
    /**
     * Steps:
     * 1. Render the LoginForm component
     * 2. Check for form elements
     * 3. Check for username input
     * 4. Check for password input
     * 5. Check for submit button
     * 6. Check for registration link
     */
    renderLoginForm();
    
    // Check for form elements
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\? sign up!/i)).toBeInTheDocument();
  });
  
  it('validates required fields', async () => {
    /**
     * Steps:
     * 1. Render the LoginForm component
     * 2. Submit the form without filling in any fields
     * 3. Check for validation errors
     */
    renderLoginForm();
    
    // Submit the form without filling in any fields
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Login should not be called with empty fields
    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });
  
  it('submits the form with valid data', async () => {
    /**
     * Steps:
     * 1. Render the LoginForm component
     * 2. Fill in the form
     * 3. Submit the form
     * 4. Check for login call
     */
    renderLoginForm();
    const user = userEvent.setup();
    
    // Fill in the form
    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Check that login was called with correct values
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123');
    });
  });
  
  it('displays an error message when login fails', async () => {
    /**
     * Steps:
     * 1. Setup login to fail
     * 2. Render the LoginForm component
     * 3. Fill in the form
     * 4. Submit the form
     * 5. Check for error message
     */
    // Setup login to fail
    mockLogin.mockRejectedValueOnce(new Error('Invalid username or password'));
    
    renderLoginForm();
    const user = userEvent.setup();
    
    // Fill in the form
    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    });
  });
  
  it('allows typing in form fields', async () => {
    /**
     * Steps:
     * 1. Render the LoginForm component
     * 2. Type in the username field
     * 3. Check for updated input value
     */
    renderLoginForm();
    const user = userEvent.setup();
    
    // Type in the username field
    await user.type(screen.getByLabelText(/username/i), 'testuser');
    
    // Verify input value is updated
    expect(screen.getByLabelText(/username/i)).toHaveValue('testuser');
  });
  
  it('has a working link to the registration page', () => {
    /**
     * Steps:
     * 1. Render the LoginForm component
     * 2. Check for registration link
     * 3. Check for link href
     */
    renderLoginForm();
    
    const registerLink = screen.getByText(/don't have an account\? sign up!/i);
    expect(registerLink.getAttribute('href')).toBe('/register');
  });
});
