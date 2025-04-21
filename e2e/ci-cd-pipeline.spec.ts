import { test, expect } from '@playwright/test';

test.describe('CI/CD Pipeline Features', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the CI/CD pipeline page
    await page.goto('/');
    await page.getByText('Project 1').click();
    await page.getByTestId('pipeline-tab').click();
    
    // Wait for pipeline editor to load
    await page.waitForSelector('[data-testid="pipeline-editor"]');
  });

  test('should display pipeline elements', async ({ page }) => {
    // Verify that pipeline elements are displayed
    await expect(page.getByTestId('pipeline-elements')).toBeVisible();
    
    // Verify specific element types are available
    await expect(page.getByText('Build')).toBeVisible();
    await expect(page.getByText('Test')).toBeVisible();
    await expect(page.getByText('Deploy')).toBeVisible();
  });

  test('should allow adding elements to the pipeline', async ({ page }) => {
    // Initial count of elements in the pipeline
    const initialCount = await page.getByTestId('pipeline-element').count();
    
    // Drag and drop a new element to the pipeline
    await page.getByText('Build').dragTo(page.getByTestId('pipeline-canvas'));
    
    // Verify that a new element was added
    await expect(page.getByTestId('pipeline-element')).toHaveCount(initialCount + 1);
  });

  test('should allow linking elements with logical flow', async ({ page }) => {
    // Add two elements to the pipeline
    await page.getByText('Build').dragTo(page.getByTestId('pipeline-canvas'));
    await page.getByText('Test').dragTo(page.getByTestId('pipeline-canvas'));
    
    // Initial count of links
    const initialLinkCount = await page.getByTestId('pipeline-link').count();
    
    // Connect the elements
    await page.getByTestId('element-output-connector').first().dragTo(page.getByTestId('element-input-connector').nth(1));
    
    // Verify that a new link was created
    await expect(page.getByTestId('pipeline-link')).toHaveCount(initialLinkCount + 1);
  });

  test('should support global and local variables', async ({ page }) => {
    // Open variables panel
    await page.getByTestId('variables-panel-button').click();
    
    // Wait for variables panel to open
    await page.waitForSelector('[data-testid="variables-panel"]');
    
    // Add a global variable
    await page.getByTestId('add-global-variable-button').click();
    await page.getByTestId('variable-name-input').fill('API_URL');
    await page.getByTestId('variable-value-input').fill('https://api.example.com');
    await page.getByTestId('save-variable-button').click();
    
    // Verify global variable was added
    await expect(page.getByText('API_URL')).toBeVisible();
    
    // Add element that uses the variable
    await page.getByText('Deploy').dragTo(page.getByTestId('pipeline-canvas'));
    
    // Configure the element to use the variable
    await page.getByTestId('pipeline-element').last().click();
    await page.getByTestId('element-config-panel').waitFor();
    await page.getByTestId('deployment-url-input').fill('${API_URL}/deploy');
    await page.getByTestId('apply-config-button').click();
    
    // Verify the configuration was saved
    await page.getByTestId('pipeline-element').last().click();
    await expect(page.getByTestId('deployment-url-input')).toHaveValue('${API_URL}/deploy');
  });

  test('should save pipeline changes automatically', async ({ page }) => {
    // Add an element to the pipeline
    await page.getByText('Build').dragTo(page.getByTestId('pipeline-canvas'));
    
    // Should show saving indicator
    await expect(page.getByTestId('saving-indicator')).toBeVisible();
    
    // Wait for save to complete
    await page.waitForSelector('[data-testid="saving-indicator"]', { state: 'hidden' });
    
    // Refresh the page
    await page.reload();
    
    // Wait for pipeline editor to load
    await page.waitForSelector('[data-testid="pipeline-editor"]');
    
    // Verify that the added element persists
    await expect(page.getByTestId('pipeline-element')).toBeVisible();
  });

  test('should validate pipeline connections', async ({ page }) => {
    // Add incompatible elements
    await page.getByText('Deploy').dragTo(page.getByTestId('pipeline-canvas'));
    await page.getByText('Build').dragTo(page.getByTestId('pipeline-canvas'));
    
    // Try to connect in invalid order (Deploy -> Build)
    await page.getByTestId('element-output-connector').first().dragTo(page.getByTestId('element-input-connector').nth(1));
    
    // Should show validation error
    await expect(page.getByTestId('validation-error')).toBeVisible();
    await expect(page.getByText('Invalid connection: Deploy cannot precede Build')).toBeVisible();
    
    // Connection should not be created
    await expect(page.getByTestId('pipeline-link')).toHaveCount(0);
  });
});
