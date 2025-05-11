import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectSelector } from '@/components/shared/selectors/ProjectSelector';
import { Project } from '@/types';

describe('ProjectSelector Component', () => {
  // Mock data
  const mockProjects: Project[] = [
    { id: 'proj1', name: 'E-Commerce Platform', path: '/e-commerce' },
    { id: 'proj2', name: 'Banking System', path: '/banking' },
    { id: 'proj3', name: 'Healthcare Portal', path: '/healthcare' },
  ];

  const mockOnSelectProject = vi.fn();

  // Reset mock function before each test
  beforeEach(() => {
    mockOnSelectProject.mockClear();
  });

  test('renders with all projects in dropdown', () => {
    render(
      <ProjectSelector
        projects={mockProjects}
        selectedProject={null}
        onSelectProject={mockOnSelectProject}
      />,
    );

    // Get the select element
    const selectElement = screen.getByTestId('selected-project');
    expect(selectElement).toBeInTheDocument();

    // Check if all projects are in the dropdown
    mockProjects.forEach((project) => {
      expect(screen.getByText(project.name)).toBeInTheDocument();
    });

    // Check if default option is present
    expect(screen.getByText('Select a project')).toBeInTheDocument();
  });

  test('displays the selected project', () => {
    const selectedProject = mockProjects[1]; // Banking System

    render(
      <ProjectSelector
        projects={mockProjects}
        selectedProject={selectedProject}
        onSelectProject={mockOnSelectProject}
      />,
    );

    // Check if the correct project is selected
    const selectElement = screen.getByTestId('selected-project') as HTMLSelectElement;
    expect(selectElement.value).toBe(selectedProject.id);
  });

  test('calls onSelectProject when a project is selected', () => {
    render(
      <ProjectSelector
        projects={mockProjects}
        selectedProject={null}
        onSelectProject={mockOnSelectProject}
      />,
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
    render(
      <ProjectSelector
        projects={mockProjects}
        selectedProject={mockProjects[0]}
        onSelectProject={mockOnSelectProject}
      />,
    );

    // Get the select element
    const selectElement = screen.getByTestId('selected-project');

    // Select the empty option
    fireEvent.change(selectElement, { target: { value: '' } });

    // Check that onSelectProject was not called
    expect(mockOnSelectProject).not.toHaveBeenCalled();
  });

  test('handles empty projects array', () => {
    render(
      <ProjectSelector
        projects={[]}
        selectedProject={null}
        onSelectProject={mockOnSelectProject}
      />,
    );

    // Check if only the default option is present
    const selectElement = screen.getByTestId('selected-project');
    expect(selectElement.children.length).toBe(1);
    expect(screen.getByText('Select a project')).toBeInTheDocument();
  });

  test('renders with correct styling', () => {
    render(
      <ProjectSelector
        projects={mockProjects}
        selectedProject={null}
        onSelectProject={mockOnSelectProject}
      />,
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
