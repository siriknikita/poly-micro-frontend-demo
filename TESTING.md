# Poly Micro Manager Testing Guide

This document provides an overview of the testing strategy and instructions for running tests in the Poly Micro Manager frontend application.

## Testing Strategy

We use a comprehensive testing approach with three main levels:

### 1. Unit Tests

Unit tests verify individual components, hooks, and utility functions in isolation. They're located in `src/__tests__/unit/`.

Key unit test suites:
- Component tests (IconButton, TestItem, ResizeHandle, etc.)
- Custom hooks tests (useResizablePanel, useTestItems, useMicroserviceNavigation)
- Utility function tests
- Constants validation

### 2. Integration Tests

Integration tests verify how components interact with each other. They're located in `src/__tests__/integration/`.

Key integration test suites:
- Testing components that combine multiple smaller components
- Form submissions and validations
- Component interactions with hooks

### 3. End-to-End (E2E) Tests

E2E tests verify complete user workflows across the application. They're located in `e2e/`.

Key E2E test suites:
- Basic app functionality
- Navigation flows
- Responsive design

## Test Setup

The project uses the following testing tools:

- **Vitest**: For unit and integration tests
- **React Testing Library**: For component testing
- **Playwright**: For end-to-end tests
- **MSW (Mock Service Worker)**: For API mocking

## Running Tests

### Unit and Integration Tests

To run all unit and integration tests:

```bash
npm run test
```

To run tests in watch mode during development:

```bash
npm run test:watch
```

To run tests with UI:

```bash
npm run test:ui
```

To generate coverage reports:

```bash
npm run test:coverage
```

### End-to-End Tests

To run all E2E tests:

```bash
npm run test:e2e
```

To run E2E tests with a specific browser:

```bash
npx playwright test --project=chromium
```

To run a specific E2E test file:

```bash
npx playwright test e2e/basic.spec.ts
```

To view the Playwright HTML report:

```bash
npx playwright show-report
```

## Test Structure

### Unit Test Example

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../utils/test-utils';
import { IconButton } from '../../../../components/testing/components/IconButton';

describe('IconButton Component', () => {
  it('renders correctly with icon and text', () => {
    render(<IconButton icon={<Icon />} label="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
  
  it('calls onClick handler when clicked', async () => {
    const mockOnClick = vi.fn();
    const { user } = render(<IconButton icon={<Icon />} onClick={mockOnClick} />);
    await user.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
```

### E2E Test Example

```ts
import { test, expect } from '@playwright/test';

test('app loads with correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Poly Micro Manager/);
});
```

## Mocking Strategy

We use MSW (Mock Service Worker) to intercept and mock API requests. The mock handlers are defined in `src/__tests__/mocks/handlers.ts`. This allows us to test components that make API requests without actually hitting any backend services.

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it.
2. **Use Proper Test Isolation**: Each test should be independent and not rely on the state from other tests.
3. **Mock External Dependencies**: Use mocks for API calls and other external services.
4. **Write Descriptive Test Names**: Test names should clearly state what is being tested.
5. **Follow the AAA Pattern**: Arrange, Act, Assert - organize tests in this logical flow.
6. **Test Edge Cases**: Include tests for error states, empty states, loading states, etc.
7. **Keep Tests Fast**: Optimize tests to run quickly for faster feedback.

## Adding New Tests

When adding new tests, follow the established patterns in the existing test files. Make sure to:

1. Put unit tests in the appropriate directory under `src/__tests__/unit/`
2. Put E2E tests in the `e2e/` directory
3. Use the custom render function from `src/__tests__/utils/test-utils.tsx` for component tests
4. Add appropriate mocks for any API calls or external dependencies
5. Run the tests to verify they pass

## Continuous Integration

Tests are automatically run as part of our CI pipeline. The pipeline is configured to:

1. Run all unit and integration tests
2. Run E2E tests against multiple browsers
3. Generate and report test coverage
4. Fail the build if any tests fail
