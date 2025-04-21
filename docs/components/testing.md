# Testing Feature Documentation

## Overview

The Testing feature provides a comprehensive suite of tools for automated testing of microservices. It allows users to create, manage, and execute tests against their microservices, view test results, and use AI assistance for test creation.

## Components Structure

```
src/components/testing/
├── components/                # Reusable UI components specific to testing
│   ├── IconButton.tsx         # Flexible button component with icon support
│   ├── NavigationControls.tsx # Controls for microservice navigation
│   ├── ResizeHandle.tsx       # Component for resizing panels
│   ├── SearchInput.tsx        # Input component for searching microservices
│   ├── TestItemComponent.tsx  # Component for rendering test items
│   └── index.ts               # Export file for easier imports
├── hooks/                     # Custom hooks for testing functionality
│   ├── useMicroserviceNavigation.tsx # Hook for navigating between microservices
│   ├── useResizablePanel.tsx  # Hook for managing resizable panels
│   ├── useTestItems.tsx       # Hook for managing test items and their expanded state
│   └── index.ts               # Export file for easier imports
├── AIPromptModal.tsx          # Modal for AI-assisted test creation
├── AutomatedTesting.tsx       # Main container for the testing feature
├── ChatContainer.tsx          # Container for test chat interactions
├── EmptyState.tsx             # Component shown when no tests are available
├── Header.tsx                 # Header component for the testing section
├── TestChat.tsx               # Component for test chat functionality
├── TestList.tsx               # Component for displaying the list of tests
├── TestListContainer.tsx      # Container for the test list
├── TestOutputModal.tsx        # Modal for displaying test output
├── constants.ts               # Constants used across testing components
└── index.ts                   # Export file for testing components
```

## Key Components

### AutomatedTesting.tsx

The main container component for the testing feature. It integrates all the testing components and manages the overall state of the testing interface.

**Key Features:**
- Resizable panels for test list and test details
- Navigation between microservices
- Integration with AI for test generation
- Test execution and result viewing

### TestList.tsx

Displays the list of available tests for the selected microservice.

**Key Features:**
- Expandable/collapsible test items
- Test selection and execution
- Filtering and searching tests

### TestChat.tsx

Provides an interactive chat interface for test creation and modification.

**Key Features:**
- AI-assisted test creation
- Test history viewing
- Test execution from chat

### AIPromptModal.tsx

Modal component for creating AI-assisted tests.

**Key Features:**
- Prompt templates for common test scenarios
- Custom prompt input
- Test generation with AI

## Custom Hooks

### useResizablePanel

Manages the state and functionality for resizable panels.

**Usage:**
- Controls panel dimensions
- Handles resize events
- Maintains minimum and maximum sizes

### useTestItems

Manages the state of test items, including expansion state and selection.

**Usage:**
- Tracks expanded/collapsed state of test items
- Handles test selection
- Provides filtering functionality

### useMicroserviceNavigation

Handles navigation between different microservices for testing.

**Usage:**
- Tracks current microservice
- Provides navigation controls
- Maintains navigation history

## Interactions with Other Features

- **Authentication**: Tests are associated with user accounts, requiring authentication
- **Monitoring**: Test results can be viewed in the monitoring dashboard
- **Pipelining**: Tests can be integrated into CI/CD pipelines

## Usage Examples

### Running a Test

1. Navigate to the Testing section from the sidebar
2. Select a microservice from the navigation controls
3. Choose a test from the test list
4. Click the "Run" button to execute the test
5. View test results in the TestOutputModal

### Creating an AI-Assisted Test

1. Click the "Create with AI" button in the TestList component
2. Enter a prompt describing the test requirements in the AIPromptModal
3. Review and modify the generated test
4. Save the test to add it to the test list
