import { test, expect } from '@playwright/test';

test.describe('Testing Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Navigate to a specific microservice's tests
    await page.goto('/');
    await page.getByText('Project 1').click();
    await page.getByText('Microservice 1').click();
    
    // Wait for test list to load
    await page.waitForSelector('[data-testid="test-list"]');
  });

  test('should display test items for selected microservice', async ({ page }) => {
    // Verify test items are displayed
    await expect(page.getByText('Test 1')).toBeVisible();
    await expect(page.getByText('Test 2')).toBeVisible();
  });

  test('should expand test item when clicked', async ({ page }) => {
    // Initially the test details should be hidden
    await expect(page.getByTestId('test-item-test1-details')).not.toBeVisible();
    
    // Click on Test 1
    await page.getByText('Test 1').click();
    
    // Test details should now be visible
    await expect(page.getByTestId('test-item-test1-details')).toBeVisible();
    await expect(page.getByText('Test 1 description')).toBeVisible();
  });

  test('should execute a test and show results', async ({ page }) => {
    // Click on Test 1 to expand it
    await page.getByText('Test 1').click();
    
    // Click run test button
    await page.getByTestId('run-test-button-test1').click();
    
    // Should show loading indicator
    await expect(page.getByTestId('test-running-indicator')).toBeVisible();
    
    // Wait for test to complete
    await page.waitForSelector('[data-testid="test-result"]', { state: 'visible' });
    
    // Should display test results
    await expect(page.getByTestId('test-result')).toBeVisible();
  });

  test('should show test output in modal when view output button is clicked', async ({ page }) => {
    // Click on Test 1 to expand it
    await page.getByText('Test 1').click();
    
    // Click view output button
    await page.getByTestId('view-output-button-test1').click();
    
    // Output modal should be visible
    await expect(page.getByTestId('test-output-modal')).toBeVisible();
    
    // Output content should be visible
    await expect(page.getByText('Test output content')).toBeVisible();
    
    // Close modal
    await page.getByTestId('close-modal-button').click();
    
    // Modal should be closed
    await expect(page.getByTestId('test-output-modal')).not.toBeVisible();
  });

  test('should handle empty test list gracefully', async ({ page }) => {
    // Navigate to a microservice with no tests (we'll need to mock this scenario)
    await page.getByText('Microservice 2').click();
    
    // Mock empty test response
    await page.route('**/api/tests?microserviceId=ms2', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true, data: [] }),
      });
    });
    
    // Refresh to apply the mock
    await page.reload();
    
    // Should show empty state message
    await expect(page.getByText('No tests available')).toBeVisible();
    await expect(page.getByText('There are no tests for this microservice')).toBeVisible();
  });

  test('should open AI prompt modal when creating a new test', async ({ page }) => {
    // Click on the "Create Test" button
    await page.getByTestId('create-test-button').click();
    
    // AI prompt modal should be visible
    await expect(page.getByTestId('ai-prompt-modal')).toBeVisible();
    
    // Type in the prompt
    await page.getByTestId('ai-prompt-input').fill('Create a test for user authentication');
    
    // Submit the prompt
    await page.getByTestId('submit-prompt-button').click();
    
    // Should show loading state while generating
    await expect(page.getByTestId('ai-generating-indicator')).toBeVisible();
    
    // Wait for AI response
    await page.waitForSelector('[data-testid="ai-response"]', { state: 'visible' });
    
    // Should display generated test
    await expect(page.getByTestId('ai-response')).toBeVisible();
  });
});
