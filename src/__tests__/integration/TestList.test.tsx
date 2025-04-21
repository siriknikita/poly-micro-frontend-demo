import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../utils/test-utils';

// Mock the hooks module first, before any imports that might use it
vi.mock('../../components/testing/hooks', () => {
  return {
    useTestItems: vi.fn().mockImplementation((tests, projectId, microserviceId) => ({
      testItems: tests || [],
      isLoading: false,
      error: null,
      expandedItems: { test1: true, test2: false },
      toggleExpand: vi.fn(),
      expandAll: vi.fn(),
      collapseAll: vi.fn(),
      showResults: true,
      toggleResultsVisibility: vi.fn(),
      currentMicroserviceId: microserviceId || null,
      runTest: vi.fn(),
      viewTestOutput: vi.fn(),
      runningTests: {},
      isOutputModalOpen: false,
      selectedTestId: null,
      closeOutputModal: vi.fn(),
      setRunningTests: vi.fn(),
      setCurrentMicroservice: vi.fn(),
      runAllTests: vi.fn(),
    }))
  };
});

// Mock the ProjectContext
vi.mock('../../context/ProjectContext', () => ({
  useProject: () => ({
    project: { id: 'project1', name: 'Test Project' },
    setProject: vi.fn(),
  }),
  ProjectProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the TestItem component
vi.mock('../../components/testing/components/TestItem', () => ({
  TestItemComponent: ({ item, isExpanded, onToggleExpand, onRunTest, onShowOutput }: any) => {
    // This mock only renders the test item itself, not its children
    // The children will be rendered by the TestList component
    return (
      <div data-testid={`test-item-${item.id}`}>
        {item.name}
        {isExpanded && (
          <div>
            <div>description</div>
            <button>Run Test</button>
            <button>View Output</button>
            <div data-testid="test-status-indicator" className={`status-${item.status || 'unknown'}`}></div>
          </div>
        )}
      </div>
    );
  },
}));

// Mock the IconButton component
vi.mock('../../components/testing/components/IconButton', () => ({
  IconButton: ({ children, onClick, title }: any) => (
    <button onClick={onClick} title={title}>
      {children}
    </button>
  ),
}));

// Mock the TestOutputModal
vi.mock('../../components/testing/components/TestOutputModal', () => ({
  TestOutputModal: ({ isOpen }: any) => isOpen ? <div data-testid="test-output-modal"></div> : null,
}));

// Import after all mocks are defined
import { TestList } from '../../components/testing/TestList';
import { mockTestItems } from '../mocks/mockData';
import { useTestItems } from '../../components/testing/hooks';

describe('TestList Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset the mock implementation for each test
    vi.mocked(useTestItems).mockImplementation((tests, projectId, microserviceId) => ({
      isLoading: false,
      functionResults: {},
      error: null,
      expandedItems: { func1: true, func2: false, func3: false },
      toggleExpand: vi.fn(),
      expandAll: vi.fn(),
      collapseAll: vi.fn(),
      showResults: true,
      toggleResultsVisibility: vi.fn(),
      currentMicroserviceId: microserviceId || null,
      runTest: vi.fn(),
      viewTestOutput: vi.fn(),
      runningTests: {},
      isOutputModalOpen: false,
      selectedTestId: null,
      closeOutputModal: vi.fn(),
      setRunningTests: vi.fn(),
      setCurrentMicroservice: vi.fn(),
      runAllTests: vi.fn(),
    }));
  });

  it('renders the list of test items', () => {
    render(<TestList 
      microserviceId="ms1" 
      tests={mockTestItems}
      onRunTest={vi.fn()}
      onGenerateTest={vi.fn()}
      functionResults={{}}
    />);
    
    // Should render all test items
    mockTestItems.forEach((testItem) => {
      expect(screen.getByText(testItem.name)).toBeInTheDocument();
    });
  });
  
  it('displays expanded test item with details', () => {
    render(<TestList 
      microserviceId="ms1" 
      tests={mockTestItems}
      onRunTest={vi.fn()}
      onGenerateTest={vi.fn()}
      functionResults={{}}
    />);
    
    // Find the expanded function item (func1)
    const expandedFuncItem = screen.getByTestId('test-item-func1');
    expect(expandedFuncItem).toBeInTheDocument();
    
    // Check that it contains the description (which is only visible when expanded)
    expect(expandedFuncItem).toHaveTextContent('description');
    
    // Since func1 is expanded, we should see its children rendered by the TestList component
    // The children are rendered in the border-l-2 div after the func1 item
    const renderedItems = screen.getAllByText(/should authenticate|should reject/i);
    expect(renderedItems.length).toBeGreaterThan(0);
  });
  
  it('does not display details for collapsed test items', () => {
    render(<TestList 
      microserviceId="ms1" 
      tests={mockTestItems}
      onRunTest={vi.fn()}
      onGenerateTest={vi.fn()}
      functionResults={{}}
    />);
    
    // Find the func2 item (which should not be expanded)
    const func2Item = screen.getByTestId('test-item-func2');
    expect(func2Item).toBeInTheDocument();
    
    // Since func2 is not expanded, it should not have the description text
    expect(func2Item).not.toHaveTextContent('description');
    
    // And its children should not be visible
    // We can check that the test case names from func2's children are not in the document
    expect(screen.queryByText(/should validate a valid token/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/should reject an expired token/i)).not.toBeInTheDocument();
  });
  
  it('shows empty state when there are no test items', () => {
    // Override the mock to return empty test items
    vi.mocked(useTestItems).mockReturnValueOnce({
      isLoading: false,
      functionResults: {},
      error: null,
      expandedItems: { func1: true, func2: false, func3: false },
      toggleExpand: vi.fn(),
      expandAll: vi.fn(),
      collapseAll: vi.fn(),
      showResults: true,
      toggleResultsVisibility: vi.fn(),
      currentMicroserviceId: 'ms1',
      runTest: vi.fn(),
      viewTestOutput: vi.fn(),
      runningTests: {},
      isOutputModalOpen: false,
      selectedTestId: null,
      closeOutputModal: vi.fn(),
      setRunningTests: vi.fn(),
      setCurrentMicroservice: vi.fn(),
      runAllTests: vi.fn(),
    });
    
    render(<TestList 
      microserviceId="ms1" 
      tests={[]}
      onRunTest={vi.fn()}
      onGenerateTest={vi.fn()}
      functionResults={{}}
    />);
    
    expect(screen.getByText(/no tests available/i)).toBeInTheDocument();
  });
  
  it('shows loading state when tests are being fetched', () => {
    // Override the mock to return loading state
    vi.mocked(useTestItems).mockReturnValueOnce({
      isLoading: true,
      functionResults: {},
      error: null,
      expandedItems: { func1: true, func2: false, func3: false },
      toggleExpand: vi.fn(),
      expandAll: vi.fn(),
      collapseAll: vi.fn(),
      showResults: true,
      toggleResultsVisibility: vi.fn(),
      currentMicroserviceId: 'ms1',
      runTest: vi.fn(),
      viewTestOutput: vi.fn(),
      runningTests: {},
      isOutputModalOpen: false,
      selectedTestId: null,
      closeOutputModal: vi.fn(),
      setRunningTests: vi.fn(),
      setCurrentMicroservice: vi.fn(),
      runAllTests: vi.fn(),
    });
    
    render(<TestList 
      microserviceId="ms1" 
      tests={[]}
      onRunTest={vi.fn()}
      onGenerateTest={vi.fn()}
      functionResults={{}}
    />);
    
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });
  
  it('shows error state when there is an error fetching tests', () => {
    // Override the mock to return error state
    vi.mocked(useTestItems).mockReturnValueOnce({
      isLoading: false,
      functionResults: {},
      error: 'Failed to fetch test items',
      expandedItems: { func1: true, func2: false, func3: false },
      toggleExpand: vi.fn(),
      expandAll: vi.fn(),
      collapseAll: vi.fn(),
      showResults: true,
      toggleResultsVisibility: vi.fn(),
      currentMicroserviceId: 'ms1',
      runTest: vi.fn(),
      viewTestOutput: vi.fn(),
      runningTests: {},
      isOutputModalOpen: false,
      selectedTestId: null,
      closeOutputModal: vi.fn(),
      setRunningTests: vi.fn(),
      setCurrentMicroservice: vi.fn(),
      runAllTests: vi.fn(),
    });
    
    render(<TestList 
      microserviceId="ms1" 
      tests={[]}
      onRunTest={vi.fn()}
      onGenerateTest={vi.fn()}
      functionResults={{}}
    />);
    
    expect(screen.getByText(/failed to fetch test items/i)).toBeInTheDocument();
  });
  
  it('renders TestOutputModal when a test output is being viewed', () => {
    // Override the mock to show the output modal
    vi.mocked(useTestItems).mockReturnValueOnce({
      isLoading: false,
      functionResults: { test1: 'Test output for test1' },
      error: null,
      expandedItems: { func1: true },
      toggleExpand: vi.fn(),
      expandAll: vi.fn(),
      collapseAll: vi.fn(),
      showResults: true,
      toggleResultsVisibility: vi.fn(),
      currentMicroserviceId: 'ms1',
      runTest: vi.fn(),
      viewTestOutput: vi.fn(),
      runningTests: {},
      isOutputModalOpen: true,
      selectedTestId: 'test1',
      closeOutputModal: vi.fn(),
      setRunningTests: vi.fn(),
      setCurrentMicroservice: vi.fn(),
      runAllTests: vi.fn(),
    });
    
    const { container } = render(<TestList 
      microserviceId="ms1" 
      tests={mockTestItems}
      onRunTest={vi.fn()}
      onGenerateTest={vi.fn()}
      functionResults={{ test1: 'Test output for test1' }}
    />);
    
    expect(screen.getByTestId('test-output-modal')).toBeInTheDocument();
    // Log the container HTML to debug
    console.log('Container HTML:', container.innerHTML);
  });
  
  it('shows empty state when there are no test items', () => {
    // Override the mock to return empty test items
    vi.mocked(useTestItems).mockReturnValueOnce({
      isLoading: false,
      functionResults: {},
      error: null,
      expandedItems: { func1: true, func2: false, func3: false },
      toggleExpand: vi.fn(),
      expandAll: vi.fn(),
      collapseAll: vi.fn(),
      showResults: true,
      toggleResultsVisibility: vi.fn(),
      currentMicroserviceId: 'ms1',
      runTest: vi.fn(),
      viewTestOutput: vi.fn(),
      runningTests: {},
      isOutputModalOpen: false,
      selectedTestId: null,
      closeOutputModal: vi.fn(),
      setRunningTests: vi.fn(),
      setCurrentMicroservice: vi.fn(),
      runAllTests: vi.fn(),
    });
    
    render(<TestList 
      microserviceId="ms1" 
      tests={[]}
      onRunTest={vi.fn()}
      onGenerateTest={vi.fn()}
      functionResults={{}}
    />);
    
    expect(screen.getByText(/no tests available/i)).toBeInTheDocument();
  });
  
  it('calls expandAll when "Expand all functions" button is clicked', async () => {
    const expandAllMock = vi.fn();
    
    // Override the mock to provide our expandAll mock
    vi.mocked(useTestItems).mockReturnValueOnce({
      isLoading: false,
      functionResults: {},
      error: null,
      expandedItems: { func1: false, func2: false, func3: false },
      toggleExpand: vi.fn(),
      expandAll: expandAllMock,
      collapseAll: vi.fn(),
      showResults: true,
      toggleResultsVisibility: vi.fn(),
      currentMicroserviceId: 'ms1',
      runTest: vi.fn(),
      viewTestOutput: vi.fn(),
      runningTests: {},
      isOutputModalOpen: false,
      selectedTestId: null,
      closeOutputModal: vi.fn(),
      setRunningTests: vi.fn(),
      setCurrentMicroservice: vi.fn(),
      runAllTests: vi.fn(),
    });
    
    const { user } = render(<TestList 
      microserviceId="ms1" 
      tests={mockTestItems}
      onRunTest={vi.fn()}
      onGenerateTest={vi.fn()}
      functionResults={{}}
    />);
    
    // Find and click the "Expand all functions" button
    const expandAllButton = screen.getByText(/expand all functions/i);
    await user.click(expandAllButton);
    
    // Check that expandAll was called
    expect(expandAllMock).toHaveBeenCalled();
  });
  
  it('calls collapseAll when "Collapse all" button is clicked', async () => {
    const collapseAllMock = vi.fn();
    
    // Override the mock to show all items as expanded and provide our collapseAll mock
    vi.mocked(useTestItems).mockReturnValueOnce({
      isLoading: false,
      functionResults: {},
      error: null,
      expandedItems: { func1: true, func2: true, func3: true },
      toggleExpand: vi.fn(),
      expandAll: vi.fn(),
      collapseAll: collapseAllMock,
      showResults: true,
      toggleResultsVisibility: vi.fn(),
      currentMicroserviceId: 'ms1',
      runTest: vi.fn(),
      viewTestOutput: vi.fn(),
      runningTests: {},
      isOutputModalOpen: false,
      selectedTestId: null,
      closeOutputModal: vi.fn(),
      setRunningTests: vi.fn(),
      setCurrentMicroservice: vi.fn(),
      runAllTests: vi.fn(),
    });
    
    const { user } = render(<TestList 
      microserviceId="ms1" 
      tests={mockTestItems}
      onRunTest={vi.fn()}
      onGenerateTest={vi.fn()}
      functionResults={{}}
    />);
    
    // Find and click the "Collapse all" button
    const collapseAllButton = screen.getByText(/collapse all/i);
    await user.click(collapseAllButton);
    
    // Check that collapseAll was called
    expect(collapseAllMock).toHaveBeenCalled();
  });
  
  it('updates button text correctly based on areAllExpanded state', async () => {
    const expandAllMock = vi.fn();
    const collapseAllMock = vi.fn();
    
    // First render with all items collapsed
    vi.mocked(useTestItems).mockReturnValueOnce({
      isLoading: false,
      functionResults: {},
      error: null,
      expandedItems: {},
      toggleExpand: vi.fn(),
      expandAll: expandAllMock,
      collapseAll: collapseAllMock,
      showResults: true,
      toggleResultsVisibility: vi.fn(),
      currentMicroserviceId: 'ms1',
      runTest: vi.fn(),
      viewTestOutput: vi.fn(),
      runningTests: {},
      isOutputModalOpen: false,
      selectedTestId: null,
      closeOutputModal: vi.fn(),
      setRunningTests: vi.fn(),
      setCurrentMicroservice: vi.fn(),
      runAllTests: vi.fn(),
    });
    
    const { user, rerender } = render(<TestList 
      microserviceId="ms1" 
      tests={mockTestItems}
      onRunTest={vi.fn()}
      onGenerateTest={vi.fn()}
      functionResults={{}}
    />);
    
    // Initially it should show "Expand all functions"
    expect(screen.getByText(/expand all functions/i)).toBeInTheDocument();
    
    // Now rerender with all items expanded
    vi.mocked(useTestItems).mockReturnValueOnce({
      isLoading: false,
      functionResults: {},
      error: null,
      expandedItems: { func1: true, func2: true, func3: true, test1: true, test2: true, test3: true, test4: true, test5: true, test6: true },
      toggleExpand: vi.fn(),
      expandAll: expandAllMock,
      collapseAll: collapseAllMock,
      showResults: true,
      toggleResultsVisibility: vi.fn(),
      currentMicroserviceId: 'ms1',
      runTest: vi.fn(),
      viewTestOutput: vi.fn(),
      runningTests: {},
      isOutputModalOpen: false,
      selectedTestId: null,
      closeOutputModal: vi.fn(),
      setRunningTests: vi.fn(),
      setCurrentMicroservice: vi.fn(),
      runAllTests: vi.fn(),
    });
    
    rerender(<TestList 
      microserviceId="ms1" 
      tests={mockTestItems}
      onRunTest={vi.fn()}
      onGenerateTest={vi.fn()}
      functionResults={{}}
    />);
    
    // Now it should show "Collapse all"
    expect(screen.getByText(/collapse all/i)).toBeInTheDocument();
  });
});
