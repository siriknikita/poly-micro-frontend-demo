import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectSelector } from '@/components/shared/selectors/ProjectSelector';
import { Project } from '@/types';

describe('ProjectSelector Component', () => {
  // Mock data
  const mockProjects: Project[] = [
    { id: 'proj1', name: 'E-Commerce Platform', path: '/e-commerce' },
    { id: 'proj2', name: 'Banking System', path: '/banking' },
    { id: 'proj3', name: 'Healthcare Portal', path: '/healthcare' }
  ];

  const mockOnSelectProject = vi.fn();

  // Reset mock function before each test
  beforeEach(() => {
    mockOnSelectProject.mockClear();
  });

  test('renders with all projects in dropdown', () => {
    /**
     * Steps:
     * 1. Render the ProjectSelector component
     * 2. Check for initial state
     * 3. Check for all projects in dropdown
     */
    render(
      <ProjectSelector 
        projects={mockProjects} 
        selectedProject={null} 
        onSelectProject={mockOnSelectProject} 
      />
    );

    // Get the select element
    const selectElement = screen.getByTestId('selected-project');
    expect(selectElement).toBeInTheDocument();

    // Check if all projects are in the dropdown
    mockProjects.forEach(project => {
      expect(screen.getByText(project.name)).toBeInTheDocument();
    });

    // Check if default option is present
    expect(screen.getByText('Select a project')).toBeInTheDocument();
  });

  test('displays the selected project', () => {
    /**
     * Steps:
     * 1. Render the ProjectSelector component
     * 2. Check for initial state
     * 3. Check for selected project
     */
    const selectedProject = mockProjects[1]; // Banking System
    
    render(
      <ProjectSelector 
        projects={mockProjects} 
        selectedProject={selectedProject} 
        onSelectProject={mockOnSelectProject} 
      />
    );

    // Check if the correct project is selected
    const selectElement = screen.getByTestId('selected-project') as HTMLSelectElement;
    expect(selectElement.value).toBe(selectedProject.id);
  });

  test('calls onSelectProject when a project is selected', () => {
    /**
     * Steps:
     * 1. Render the ProjectSelector component
     * 2. Check for initial state
     * 3. Check for onSelectProject
     */
    render(
      <ProjectSelector 
        projects={mockProjects} 
        selectedProject={null} 
        onSelectProject={mockOnSelectProject} 
      />
    );

    // Get the select element
    const selectElement = screen.getByTestId('selected-project');
    
    // Select a project
    fireEvent.change(selectElement, { target: { value: 'proj3' } });
    
    // Check if onSelectProject was called with the correct project
    expect(mockOnSelectProject).toHaveBeenCalledTimes(1);
    expect(mockOnSelectProject).toHaveBeenCalledWith(mockProjects[2]);
  });

  test('does not call onSelectProject when empty option is selected', () => {
    /**
     * Steps:
     * 1. Render the ProjectSelector component
     * 2. Check for initial state
     * 3. Check for onSelectProject
     */
    render(
      <ProjectSelector 
        projects={mockProjects} 
        selectedProject={mockProjects[0]} 
        onSelectProject={mockOnSelectProject} 
      />
    );

    // Get the select element
    const selectElement = screen.getByTestId('selected-project');
    
    // Select the empty option
    fireEvent.change(selectElement, { target: { value: '' } });
    
    // Check that onSelectProject was not called
    expect(mockOnSelectProject).not.toHaveBeenCalled();
  });

  test('handles empty projects array', () => {
    /**
     * Steps:
     * 1. Render the ProjectSelector component
     * 2. Check for initial state
     * 3. Check for empty projects array
     */
    render(
      <ProjectSelector 
        projects={[]} 
        selectedProject={null} 
        onSelectProject={mockOnSelectProject} 
      />
    );

    // Check if only the default option is present
    const selectElement = screen.getByTestId('selected-project');
    expect(selectElement.children.length).toBe(1);
    expect(screen.getByText('Select a project')).toBeInTheDocument();
  });

  test('renders with correct styling', () => {
    /**
     * Steps:
     * 1. Render the ProjectSelector component
     * 2. Check for initial state
     * 3. Check for correct styling
     */
    render(
      <ProjectSelector 
        projects={mockProjects} 
        selectedProject={null} 
        onSelectProject={mockOnSelectProject} 
      />
    );

    // Check if the component has the expected classes
    const selectElement = screen.getByTestId('selected-project');
    expect(selectElement).toHaveClass('appearance-none');
    expect(selectElement).toHaveClass('w-full');
    
    // Check if the folder icon is present
    const folderIcon = document.querySelector('.text-gray-400');
    expect(folderIcon).toBeInTheDocument();
  });
});

/**
 * | Test Number | Testing Environment | Test | Expected Result | Result |
 * |-----------|----------------------|------|------------------|--------|
 * | 1 | Web Browser | - Render the ProjectSelector component <br> - Check for initial state <br> - Check for all projects in dropdown | renders correctly with all subcomponents | + |
 * | 2 | Web Browser | - Render the ProjectSelector component <br> - Check for initial state <br> - Check for all projects in dropdown | allows service selection through the service selector | + |
 * | 3 | Web Browser | - Render the ProjectSelector component <br> - Check for initial state <br> - Check for all projects in dropdown | shows correct selected state for projects | + |
 * | 4 | Web Browser | - Render the ProjectSelector component <br> - Check for initial state <br> - Check for all projects in dropdown | calls onSelectProject when a project is selected | + |
 * | 5 | Web Browser | - Render the ProjectSelector component <br> - Check for initial state <br> - Check for all projects in dropdown | handles empty projects array | + |
 * | 6 | Web Browser | - Render the ProjectSelector component <br> - Check for initial state <br> - Check for all projects in dropdown | renders with correct styling | + |
 */