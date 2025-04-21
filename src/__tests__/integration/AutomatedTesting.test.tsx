import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../utils/test-utils';
import { AutomatedTesting } from '@/components/testing';
import { mockMicroservices, mockTestItems } from '../mocks/mockData';

// Mock the hooks
vi.mock('../../../components/testing/hooks/useMicroserviceNavigation', () => ({
  default: vi.fn(() => ({
    microservices: mockMicroservices.filter(ms => ms.projectId === 'project1'),
    isLoading: false,
    error: null,
    selectedMicroserviceId: 'ms1',
    navigateToMicroservice: vi.fn(),
    filteredMicroservices: mockMicroservices.filter(ms => ms.projectId === 'project1'),
    searchQuery: '',
    setSearchQuery: vi.fn(),
  })),
}));

vi.mock('../../../components/testing/hooks/useTestItems', () => ({
  default: vi.fn(() => ({
    testItems: mockTestItems.filter(item => item.microserviceId === 'ms1'),
    isLoading: false,
    error: null,
    expandedItems: { test1: true },
    toggleExpandedItem: vi.fn(),
    runTest: vi.fn(),
    viewTestOutput: vi.fn(),
    runningTests: {},
    isOutputModalOpen: false,
    selectedTestId: null,
    closeOutputModal: vi.fn(),
  })),
}));

vi.mock('../../../components/testing/hooks/useResizablePanel', () => ({
  default: vi.fn(() => ({
    width: 300,
    isResizing: false,
    handleMouseDown: vi.fn(),
    containerRef: { current: document.createElement('div') },
  })),
}));

describe('AutomatedTesting Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component with microservice navigation and test list', () => {
    render(<AutomatedTesting projectId="project1" />);
    
    // Microservice navigation should be rendered
    expect(screen.getByTestId('microservice-navigation')).toBeInTheDocument();
    
    // Test list should be rendered
    expect(screen.getByTestId('test-list')).toBeInTheDocument();
    
    // Resizable panel should be rendered
    expect(screen.getByTestId('resizable-panel')).toBeInTheDocument();
  });
  
  it('displays the selected microservice name', () => {
    render(<AutomatedTesting projectId="project1" />);
    
    // Find the selected microservice (ms1)
    const selectedMicroservice = mockMicroservices.find(ms => ms.id === 'ms1');
    expect(screen.getByText(selectedMicroservice!.name)).toBeInTheDocument();
  });
  
  it('shows the test items for the selected microservice', () => {
    render(<AutomatedTesting projectId="project1" />);
    
    // Test items for ms1 should be displayed
    const ms1TestItems = mockTestItems.filter(item => item.microserviceId === 'ms1');
    
    ms1TestItems.forEach(testItem => {
      expect(screen.getByText(testItem.name)).toBeInTheDocument();
    });
  });
  
  it('renders search input for microservices', async () => {
    const { user } = render(<AutomatedTesting projectId="project1" />);
    
    // Click search button
    const searchButton = screen.getByTestId('search-microservices-button');
    await user.click(searchButton);
    
    // Search input should be visible
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });
  
  it('displays loading state when fetching microservices', () => {
    // Override the mock to return loading state for microservices
    vi.mocked(require('../../../components/testing/hooks/useMicroserviceNavigation').default).mockReturnValueOnce({
      microservices: [],
      isLoading: true,
      error: null,
      selectedMicroserviceId: null,
      navigateToMicroservice: vi.fn(),
      filteredMicroservices: [],
      searchQuery: '',
      setSearchQuery: vi.fn(),
    });
    
    render(<AutomatedTesting projectId="project1" />);
    
    // Should show loading indicator for microservices
    expect(screen.getByTestId('microservice-loading')).toBeInTheDocument();
  });
  
  it('displays error state when there is an error fetching microservices', () => {
    // Override the mock to return error state for microservices
    vi.mocked(require('../../../components/testing/hooks/useMicroserviceNavigation').default).mockReturnValueOnce({
      microservices: [],
      isLoading: false,
      error: 'Failed to fetch microservices',
      selectedMicroserviceId: null,
      navigateToMicroservice: vi.fn(),
      filteredMicroservices: [],
      searchQuery: '',
      setSearchQuery: vi.fn(),
    });
    
    render(<AutomatedTesting projectId="project1" />);
    
    // Should show error message for microservices
    expect(screen.getByText(/failed to fetch microservices/i)).toBeInTheDocument();
  });
  
  it('displays placeholder when no microservice is selected', () => {
    // Override the mock to return null for selectedMicroserviceId
    vi.mocked(require('../../../components/testing/hooks/useMicroserviceNavigation').default).mockReturnValueOnce({
      microservices: mockMicroservices.filter(ms => ms.projectId === 'project1'),
      isLoading: false,
      error: null,
      selectedMicroserviceId: null,
      navigateToMicroservice: vi.fn(),
      filteredMicroservices: mockMicroservices.filter(ms => ms.projectId === 'project1'),
      searchQuery: '',
      setSearchQuery: vi.fn(),
    });
    
    render(<AutomatedTesting projectId="project1" />);
    
    // Should show placeholder for selecting a microservice
    expect(screen.getByText(/select a microservice/i)).toBeInTheDocument();
  });
  
  it('displays EmptyState when there are no microservices', () => {
    // Override the mock to return empty microservices
    vi.mocked(require('../../../components/testing/hooks/useMicroserviceNavigation').default).mockReturnValueOnce({
      microservices: [],
      isLoading: false,
      error: null,
      selectedMicroserviceId: null,
      navigateToMicroservice: vi.fn(),
      filteredMicroservices: [],
      searchQuery: '',
      setSearchQuery: vi.fn(),
    });
    
    render(<AutomatedTesting projectId="project1" />);
    
    // Should show empty state for microservices
    expect(screen.getByText(/no microservices available/i)).toBeInTheDocument();
  });
  
  it('renders the ResizeHandle component', () => {
    render(<AutomatedTesting projectId="project1" />);
    
    // Resize handle should be rendered
    expect(screen.getByTestId('resize-handle')).toBeInTheDocument();
  });
  
  it('renders the AIPromptModal when create test button is clicked', async () => {
    const { user } = render(<AutomatedTesting projectId="project1" />);
    
    // Click create test button
    const createTestButton = screen.getByTestId('create-test-button');
    await user.click(createTestButton);
    
    // AI prompt modal should be visible
    expect(screen.getByTestId('ai-prompt-modal')).toBeInTheDocument();
  });
});
