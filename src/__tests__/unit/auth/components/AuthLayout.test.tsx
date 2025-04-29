import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthLayout } from '@/components/auth/components';
import { User } from 'lucide-react';

describe('AuthLayout', () => {
  it('renders the layout with title and icon', () => {
    /**
     * Steps:
     * 1. Render the AuthLayout component with title and icon
     * 2. Check for title
     * 3. Check for icon
     * 4. Check for content
     */
    render(
      <AuthLayout 
        title="Test Title" 
        icon={<User className="h-12 w-12" data-testid="test-icon" />}
      >
        <div data-testid="test-content">Test Content</div>
      </AuthLayout>
    );
    
    // Check for title
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    
    // Check for icon
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    
    // Check for content
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
  
  it('renders with a null icon', () => {
    /**
     * Steps:
     * 1. Render the AuthLayout component with title and null icon
     * 2. Check for title
     * 3. Check for content
     */
    render(
      <AuthLayout title="Test Title" icon={null}>
        <div data-testid="test-content">Test Content</div>
      </AuthLayout>
    );
    
    // Check for title
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    
    // Check for content
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });
  
});
