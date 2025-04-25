import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../utils/test-utils';
import { Header } from '@/components/testing/Header';
import { mockProjects } from '@/__tests__/mocks/mockData';

// Mock window.open
global.open = vi.fn();

describe('Header Component', () => {
  it('renders correctly with project name', () => {
    render(<Header projectName="Project 1" />);
    
    expect(screen.getByText('Project 1')).toBeInTheDocument();
    expect(screen.getByTestId('app-logo')).toBeInTheDocument();
  });
  
  it('navigates to landing page when logo is clicked', async () => {
    const { user } = render(<Header projectName="Project 1" />);
    
    await user.click(screen.getByTestId('app-logo'));
    
    expect(global.open).toHaveBeenCalledWith(expect.any(String), '_blank');
  });
  
  it('renders without project name when not provided', () => {
    render(<Header />);
    
    expect(screen.queryByTestId('project-name')).not.toBeInTheDocument();
  });
  
  it('renders project selector when projects are provided', () => {
    render(<Header projectName="Project 1" projects={mockProjects} onSelectProject={() => {}} />);
    
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
  
  it('calls onSelectProject when a project is selected', async () => {
    const handleSelectProject = vi.fn();
    const { user } = render(
      <Header 
        projectName="Project 1" 
        projects={mockProjects} 
        onSelectProject={handleSelectProject} 
      />
    );
    
    // Open dropdown
    await user.click(screen.getByRole('combobox'));
    
    // Select a different project
    await user.click(screen.getByText('Project 2'));
    
    expect(handleSelectProject).toHaveBeenCalledWith('project2');
  });
  
  it('renders settings button when onOpenSettings is provided', () => {
    render(<Header projectName="Project 1" onOpenSettings={() => {}} />);
    
    expect(screen.getByTestId('settings-button')).toBeInTheDocument();
  });
  
  it('calls onOpenSettings when settings button is clicked', async () => {
    const handleOpenSettings = vi.fn();
    const { user } = render(<Header projectName="Project 1" onOpenSettings={handleOpenSettings} />);
    
    await user.click(screen.getByTestId('settings-button'));
    
    expect(handleOpenSettings).toHaveBeenCalledTimes(1);
  });
  
  it('does not render settings button when onOpenSettings is not provided', () => {
    render(<Header projectName="Project 1" />);
    
    expect(screen.queryByTestId('settings-button')).not.toBeInTheDocument();
  });
  
  it('renders with custom className when provided', () => {
    render(<Header projectName="Project 1" className="custom-header" />);
    
    expect(screen.getByTestId('header-container')).toHaveClass('custom-header');
  });
  
  it('renders notification count when provided', () => {
    render(<Header projectName="Project 1" notificationCount={5} />);
    
    expect(screen.getByTestId('notification-count')).toHaveTextContent('5');
  });
  
  it('does not render notification indicator when count is 0', () => {
    render(<Header projectName="Project 1" notificationCount={0} />);
    
    expect(screen.queryByTestId('notification-count')).not.toBeInTheDocument();
  });
});
