import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/auth/components';

describe('Button', () => {
  it('renders a button with default styling', () => {
    /**
     * Steps:
     * 1. Render the Button component with text
     * 2. Check for button
     * 3. Check for default styling
     */
    render(<Button>Click Me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-indigo-600');
    expect(button).not.toHaveClass('w-full');
    expect(button).not.toHaveAttribute('disabled');
  });
  
  it('renders a full width button when fullWidth is true', () => {
    /**
     * Steps:
     * 1. Render the Button component with fullWidth prop
     * 2. Check for button
     * 3. Check for full width styling
     */
    render(<Button fullWidth>Full Width Button</Button>);
    
    const button = screen.getByRole('button', { name: /full width button/i });
    expect(button).toHaveClass('w-full');
  });
  
  it('renders a disabled button when disabled is true', () => {
    /**
     * Steps:
     * 1. Render the Button component with disabled prop
     * 2. Check for button
     * 3. Check for disabled styling
     */
    render(<Button disabled>Disabled Button</Button>);
    
    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50');
    expect(button).toHaveClass('cursor-not-allowed');
  });
  
  it('renders a loading state with spinner when isLoading is true', () => {
    /**
     * Steps:
     * 1. Render the Button component with isLoading prop
     * 2. Check for button
     * 3. Check for disabled state
     * 4. Check for spinner
     * 5. Check for text opacity
     */
    render(<Button isLoading>Loading Button</Button>);
    
    const button = screen.getByRole('button', { name: /loading button/i });
    expect(button).toBeDisabled();
    
    // Check for spinner
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
    
    // Text should still be visible but with opacity
    const buttonText = screen.getByText(/loading button/i);
    expect(buttonText).toHaveClass('opacity-0');
  });
  
  it('calls onClick handler when clicked', () => {
    /**
     * Steps:
     * 1. Render the Button component with onClick prop
     * 2. Check for button
     * 3. Call onClick handler
     * 4. Check for handler call
     */
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable Button</Button>);
    
    const button = screen.getByRole('button', { name: /clickable button/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('does not call onClick when disabled', () => {
    /**
     * Steps:
     * 1. Render the Button component with onClick and disabled props
     * 2. Check for button
     * 3. Call onClick handler
     * 4. Check for handler call
     */
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Disabled Button</Button>);
    
    const button = screen.getByRole('button', { name: /disabled button/i });
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });
  
  it('does not call onClick when loading', () => {
    /**
     * Steps:
     * 1. Render the Button component with onClick and isLoading props
     * 2. Check for button
     * 3. Call onClick handler
     * 4. Check for handler call
     */
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} isLoading>Loading Button</Button>);
    
    const button = screen.getByRole('button', { name: /loading button/i });
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });
  
  it('renders with custom type attribute', () => {
    /**
     * Steps:
     * 1. Render the Button component with custom type attribute
     * 2. Check for button
     * 3. Check for custom type attribute
     */
    render(<Button type="submit">Submit Button</Button>);
    
    const button = screen.getByRole('button', { name: /submit button/i });
    expect(button).toHaveAttribute('type', 'submit');
  });
  
  it('renders with additional className when provided', () => {
    /**
     * Steps:
     * 1. Render the Button component with custom className
     * 2. Check for button
     * 3. Check for custom className
     * 4. Check for default classes
     */
    render(<Button className="custom-class">Custom Button</Button>);
    
    const button = screen.getByRole('button', { name: /custom button/i });
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('bg-indigo-600'); // Still has default classes
  });
});
