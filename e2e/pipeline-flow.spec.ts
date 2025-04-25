import { test, expect } from '@playwright/test';

test.describe('Pipeline Flow Connection', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the pipeline editor
    await page.goto('/');
    await page.getByText('Project 1').click();
    await page.getByTestId('pipeline-tab').click();
    
    // Wait for pipeline editor to load
    await page.waitForSelector('[data-testid="pipeline-editor"]');
    
    // Clear any existing pipeline elements (if there's a clear button)
    const clearButton = page.getByTestId('clear-pipeline-button');
    if (await clearButton.isVisible()) {
      await clearButton.click();
      
      // Confirm clear if there's a confirmation dialog
      const confirmButton = page.getByRole('button', { name: 'Clear' });
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
      }
    }
  });

  test('allows connecting pipeline elements with arrows', async ({ page }) => {
    // Add a source element
    await page.getByText('Build').dragTo(page.getByTestId('pipeline-canvas'));
    
    // Add a target element
    await page.getByText('Test').dragTo(page.getByTestId('pipeline-canvas'));
    
    // Connect the elements
    await page.getByTestId('element-output-connector').first().dragTo(
      page.getByTestId('element-input-connector').nth(1)
    );
    
    // Verify connection was created
    await expect(page.getByTestId('pipeline-link')).toBeVisible();
    
    // Save the pipeline
    await page.getByTestId('save-pipeline-button').click();
    
    // Verify saved message
    await expect(page.getByText('Pipeline saved successfully')).toBeVisible();
    
    // Refresh the page to ensure changes persist
    await page.reload();
    
    // Wait for pipeline editor to load
    await page.waitForSelector('[data-testid="pipeline-editor"]');
    
    // Verify connection still exists
    await expect(page.getByTestId('pipeline-link')).toBeVisible();
  });

  test('validates invalid connections between elements', async ({ page }) => {
    // Add elements in incorrect order
    await page.getByText('Deploy').dragTo(page.getByTestId('pipeline-canvas'));
    await page.getByText('Build').dragTo(page.getByTestId('pipeline-canvas'));
    
    // Try to connect in invalid order (Deploy -> Build)
    await page.getByTestId('element-output-connector').first().dragTo(
      page.getByTestId('element-input-connector').nth(1)
    );
    
    // Verify validation error appears
    await expect(page.getByText('Invalid connection')).toBeVisible();
    
    // Verify no connection was created
    await expect(page.getByTestId('pipeline-link')).not.toBeVisible();
  });

  test('allows creating complex pipeline flows with multiple connections', async ({ page }) => {
    // Add several elements
    await page.getByText('Build').dragTo(page.getByTestId('pipeline-canvas'));
    await page.getByText('Test').dragTo(page.getByTestId('pipeline-canvas'));
    await page.getByText('Deploy').dragTo(page.getByTestId('pipeline-canvas'));
    await page.getByText('Notify').dragTo(page.getByTestId('pipeline-canvas'));
    
    // Connect Build -> Test
    await page.getByTestId('element-output-connector').first().dragTo(
      page.locator('[data-element-type="Test"]').getByTestId('element-input-connector')
    );
    
    // Connect Test -> Deploy
    await page.locator('[data-element-type="Test"]').getByTestId('element-output-connector').dragTo(
      page.locator('[data-element-type="Deploy"]').getByTestId('element-input-connector')
    );
    
    // Connect Test -> Notify (branching)
    await page.locator('[data-element-type="Test"]').getByTestId('element-output-connector').dragTo(
      page.locator('[data-element-type="Notify"]').getByTestId('element-input-connector')
    );
    
    // Verify all connections were created
    await expect(page.getByTestId('pipeline-link')).toHaveCount(3);
    
    // Verify the pipeline can be saved
    await page.getByTestId('save-pipeline-button').click();
    await expect(page.getByText('Pipeline saved successfully')).toBeVisible();
  });

  test('allows deleting connections between elements', async ({ page }) => {
    // Add elements
    await page.getByText('Build').dragTo(page.getByTestId('pipeline-canvas'));
    await page.getByText('Test').dragTo(page.getByTestId('pipeline-canvas'));
    
    // Connect the elements
    await page.getByTestId('element-output-connector').first().dragTo(
      page.getByTestId('element-input-connector').nth(1)
    );
    
    // Verify connection was created
    await expect(page.getByTestId('pipeline-link')).toBeVisible();
    
    // Delete the connection
    await page.getByTestId('pipeline-link').click();
    await page.keyboard.press('Delete');
    
    // Verify connection was removed
    await expect(page.getByTestId('pipeline-link')).not.toBeVisible();
  });

  test('creates logical flow with conditional branches', async ({ page }) => {
    // Add elements
    await page.getByText('Build').dragTo(page.getByTestId('pipeline-canvas'));
    await page.getByText('Condition').dragTo(page.getByTestId('pipeline-canvas'));
    await page.getByText('Deploy').dragTo(page.getByTestId('pipeline-canvas'));
    await page.getByText('Notify').dragTo(page.getByTestId('pipeline-canvas'));
    
    // Connect Build -> Condition
    await page.locator('[data-element-type="Build"]').getByTestId('element-output-connector').dragTo(
      page.locator('[data-element-type="Condition"]').getByTestId('element-input-connector')
    );
    
    // Connect Condition -> Deploy (True path)
    await page.locator('[data-element-type="Condition"]').getByTestId('true-output-connector').dragTo(
      page.locator('[data-element-type="Deploy"]').getByTestId('element-input-connector')
    );
    
    // Connect Condition -> Notify (False path)
    await page.locator('[data-element-type="Condition"]').getByTestId('false-output-connector').dragTo(
      page.locator('[data-element-type="Notify"]').getByTestId('element-input-connector')
    );
    
    // Configure condition
    await page.locator('[data-element-type="Condition"]').click();
    
    // Set condition variable
    await page.getByTestId('condition-variable-input').fill('${BUILD_SUCCESS}');
    await page.getByTestId('condition-operator-select').selectOption('equals');
    await page.getByTestId('condition-value-input').fill('true');
    
    // Save condition
    await page.getByTestId('save-condition-button').click();
    
    // Verify all connections were created with correct types
    await expect(page.getByTestId('pipeline-link')).toHaveCount(3);
    await expect(page.getByTestId('true-path-link')).toBeVisible();
    await expect(page.getByTestId('false-path-link')).toBeVisible();
  });

  test('supports variable substitution in pipeline elements', async ({ page }) => {
    // Open variables panel
    await page.getByTestId('variables-panel-button').click();
    
    // Add a global variable
    await page.getByTestId('add-global-variable-button').click();
    await page.getByTestId('variable-name-input').fill('DEPLOY_URL');
    await page.getByTestId('variable-value-input').fill('https://example.com/deploy');
    await page.getByTestId('save-variable-button').click();
    
    // Add Deploy element
    await page.getByText('Deploy').dragTo(page.getByTestId('pipeline-canvas'));
    
    // Configure Deploy element to use the variable
    await page.locator('[data-element-type="Deploy"]').click();
    await page.getByTestId('deployment-url-input').fill('${DEPLOY_URL}');
    await page.getByTestId('save-element-config-button').click();
    
    // Verify configuration was saved
    await page.locator('[data-element-type="Deploy"]').click();
    await expect(page.getByTestId('deployment-url-input')).toHaveValue('${DEPLOY_URL}');
    
    // Check variable preview shows the resolved value
    await expect(page.getByTestId('variable-preview')).toContainText('https://example.com/deploy');
  });

  test('handles pipeline element rearrangement while preserving connections', async ({ page }) => {
    // Add elements
    await page.getByText('Build').dragTo(page.getByTestId('pipeline-canvas'));
    await page.getByText('Test').dragTo(page.getByTestId('pipeline-canvas'));
    
    // Connect the elements
    await page.getByTestId('element-output-connector').first().dragTo(
      page.getByTestId('element-input-connector').nth(1)
    );
    
    // Move the Test element to a new position
    await page.locator('[data-element-type="Test"]').dragTo(
      page.getByTestId('pipeline-canvas'),
      { targetPosition: { x: 500, y: 300 } }
    );
    
    // Verify connection is preserved but updated with new coordinates
    await expect(page.getByTestId('pipeline-link')).toBeVisible();
    
    // Save to ensure the new layout persists
    await page.getByTestId('save-pipeline-button').click();
    
    // Refresh the page
    await page.reload();
    await page.waitForSelector('[data-testid="pipeline-editor"]');
    
    // Verify elements and connection still exist at their new positions
    await expect(page.locator('[data-element-type="Test"]')).toBeVisible();
    await expect(page.locator('[data-element-type="Build"]')).toBeVisible();
    await expect(page.getByTestId('pipeline-link')).toBeVisible();
  });
});
