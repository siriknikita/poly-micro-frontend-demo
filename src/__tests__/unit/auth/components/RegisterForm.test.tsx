import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterForm from '@/components/auth/RegisterForm';
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

describe('RegisterForm', () => {
  const mockRegister = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup the useAuth mock
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      register: mockRegister,
      isAuthenticated: false,
      user: null,
      isLoading: false
    });
  });
  
  const renderRegisterForm = () => {
    return render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>
    );
  };
  
  it('renders the registration form correctly', () => {
    /**
     * Steps:
     * 1. Render the RegisterForm component
     * 2. Check for form elements
     * 3. Check for business name input
     * 4. Check for email input
     * 5. Check for username input
     * 6. Check for password input
     * 7. Check for submit button
     * 8. Check for login link
     */
    renderRegisterForm();
    
    // Check for form elements
    expect(screen.getByText('Register your business')).toBeInTheDocument();
    expect(screen.getByLabelText(/business name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account\? sign in!/i)).toBeInTheDocument();
  });
  
  it('validates required fields', async () => {
    /**
     * Steps:
     * 1. Render the RegisterForm component
     * 2. Submit the form without filling in any fields
     * 3. Check for validation errors
     */
    renderRegisterForm();
    
    // Submit the form without filling in any fields
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    // Register should not be called with empty fields
    await waitFor(() => {
      expect(mockRegister).not.toHaveBeenCalled();
    });
  });
  
  it('validates email format', async () => {
    /**
     * Steps:
     * 1. Render the RegisterForm component
     * 2. Fill in the form with invalid email
     * 3. Submit the form
     * 4. Check for validation errors
     */
    renderRegisterForm();
    const user = userEvent.setup();
    
    // Fill in the form with invalid email
    await user.type(screen.getByLabelText(/business name/i), 'Test Business');
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /register/i }));
    
    // Register should not be called with invalid email
    await waitFor(() => {
      expect(mockRegister).not.toHaveBeenCalled();
    });
  });
  
  it('validates username length', async () => {
    /**
     * Steps:
     * 1. Render the RegisterForm component
     * 2. Fill in the form with short username
     * 3. Submit the form
     * 4. Check for validation errors
     */
    renderRegisterForm();
    const user = userEvent.setup();
    
    // Fill in the form with short username
    await user.type(screen.getByLabelText(/business name/i), 'Test Business');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/username/i), 'ab'); // Too short
    await user.type(screen.getByLabelText(/password/i), 'password123');
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /register/i }));
    
    // Check for username validation error
    await waitFor(() => {
      expect(screen.getByText('Username must be at least 3 characters')).toBeInTheDocument();
    });
    
    // Register should not be called
    expect(mockRegister).not.toHaveBeenCalled();
  });
  
  it('validates password length', async () => {
    /**
     * Steps:
     * 1. Render the RegisterForm component
     * 2. Fill in the form with short password
     * 3. Submit the form
     * 4. Check for validation errors
     */
    renderRegisterForm();
    const user = userEvent.setup();
    
    // Fill in the form with short password
    await user.type(screen.getByLabelText(/business name/i), 'Test Business');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), '12345'); // Too short
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /register/i }));
    
    // Check for password validation error
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
    
    // Register should not be called
    expect(mockRegister).not.toHaveBeenCalled();
  });
  
  it('submits the form with valid data', async () => {
    /**
     * Steps:
     * 1. Render the RegisterForm component
     * 2. Fill in the form with valid data
     * 3. Submit the form
     * 4. Check for register call
     */
    renderRegisterForm();
    const user = userEvent.setup();
    
    // Fill in the form with valid data
    await user.type(screen.getByLabelText(/business name/i), 'Test Business');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /register/i }));
    
    // Check that register was called with correct values
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        businessName: 'Test Business',
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123'
      });
    });
  });
  
  it('displays an error message when registration fails', async () => {
    /**
     * Steps:
     * 1. Setup register to fail
     * 2. Render the RegisterForm component
     * 3. Fill in the form with valid data
     * 4. Submit the form
     * 5. Check for error message
     */
    // Setup register to fail
    mockRegister.mockRejectedValueOnce(new Error('Username already exists'));
    
    renderRegisterForm();
    const user = userEvent.setup();
    
    // Fill in the form with valid data
    await user.type(screen.getByLabelText(/business name/i), 'Test Business');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/username/i), 'existinguser');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /register/i }));
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('Username already exists')).toBeInTheDocument();
    });
  });
  
  it('allows typing in form fields', async () => {
    /**
     * Steps:
     * 1. Render the RegisterForm component
     * 2. Type in the business name field
     * 3. Check for updated input value
     */
    renderRegisterForm();
    const user = userEvent.setup();
    
    // Type in the business name field
    await user.type(screen.getByLabelText(/business name/i), 'Test Business');
    
    // Verify input value is updated
    expect(screen.getByLabelText(/business name/i)).toHaveValue('Test Business');
  });
  
  it('has a working link to the login page', () => {
    /**
     * Steps:
     * 1. Render the RegisterForm component
     * 2. Check for login link
     * 3. Check for link href
     */
    renderRegisterForm();
    
    const loginLink = screen.getByText(/already have an account\? sign in!/i);
    expect(loginLink.getAttribute('href')).toBe('/login');
  });
});
