import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../utils/test-utils';
import { NavigationControls } from '@/components/testing/components';

describe('NavigationControls Component', () => {
  const mockMicroservices = [
    { id: 'ms1', name: 'Microservice 1' },
    { id: 'ms2', name: 'Microservice 2' },
    { id: 'ms3', name: 'Microservice 3' },
  ];

  it('renders correctly with microservices', () => {
    render(
      <NavigationControls
        microservices={mockMicroservices}
        selectedMicroserviceId="ms1"
        onNavigate={() => {}}
      />
    );
    
    expect(screen.getByText('Microservice 1')).toBeInTheDocument();
    expect(screen.getByTestId('navigation-controls')).toBeInTheDocument();
  });
  
  it('disables previous button when first microservice is selected', () => {
    render(
      <NavigationControls
        microservices={mockMicroservices}
        selectedMicroserviceId="ms1"
        onNavigate={() => {}}
      />
    );
    
    expect(screen.getByTestId('prev-button')).toBeDisabled();
    expect(screen.getByTestId('next-button')).not.toBeDisabled();
  });
  
  it('disables next button when last microservice is selected', () => {
    render(
      <NavigationControls
        microservices={mockMicroservices}
        selectedMicroserviceId="ms3"
        onNavigate={() => {}}
      />
    );
    
    expect(screen.getByTestId('prev-button')).not.toBeDisabled();
    expect(screen.getByTestId('next-button')).toBeDisabled();
  });
  
  it('enables both buttons when middle microservice is selected', () => {
    render(
      <NavigationControls
        microservices={mockMicroservices}
        selectedMicroserviceId="ms2"
        onNavigate={() => {}}
      />
    );
    
    expect(screen.getByTestId('prev-button')).not.toBeDisabled();
    expect(screen.getByTestId('next-button')).not.toBeDisabled();
  });
  
  it('calls onNavigate with previous microservice ID when prev button is clicked', async () => {
    const handleNavigate = vi.fn();
    const { user } = render(
      <NavigationControls
        microservices={mockMicroservices}
        selectedMicroserviceId="ms2"
        onNavigate={handleNavigate}
      />
    );
    
    await user.click(screen.getByTestId('prev-button'));
    
    expect(handleNavigate).toHaveBeenCalledWith('ms1');
  });
  
  it('calls onNavigate with next microservice ID when next button is clicked', async () => {
    const handleNavigate = vi.fn();
    const { user } = render(
      <NavigationControls
        microservices={mockMicroservices}
        selectedMicroserviceId="ms2"
        onNavigate={handleNavigate}
      />
    );
    
    await user.click(screen.getByTestId('next-button'));
    
    expect(handleNavigate).toHaveBeenCalledWith('ms3');
  });
  
  it('renders correctly when there are no microservices', () => {
    render(
      <NavigationControls
        microservices={[]}
        selectedMicroserviceId={null}
        onNavigate={() => {}}
      />
    );
    
    expect(screen.getByText('No Microservices')).toBeInTheDocument();
    expect(screen.getByTestId('prev-button')).toBeDisabled();
    expect(screen.getByTestId('next-button')).toBeDisabled();
  });
  
  it('renders correctly when selectedMicroserviceId is null', () => {
    render(
      <NavigationControls
        microservices={mockMicroservices}
        selectedMicroserviceId={null}
        onNavigate={() => {}}
      />
    );
    
    expect(screen.getByText('Select a Microservice')).toBeInTheDocument();
  });
  
  it('displays microservice name with counter', () => {
    render(
      <NavigationControls
        microservices={mockMicroservices}
        selectedMicroserviceId="ms2"
        onNavigate={() => {}}
      />
    );
    
    expect(screen.getByText('Microservice 2')).toBeInTheDocument();
    expect(screen.getByText('2/3')).toBeInTheDocument();
  });
});
