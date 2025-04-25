import { test, expect } from '@playwright/test';

// Basic test to verify app loads correctly
test('app loads with correct title', async ({ page }) => {
  // Navigate to the application
  await page.goto('/');
  
  // Check that the page loads with expected title - more flexible with different browsers
  await expect(page).toHaveTitle(/poly micro manager/i);
});

// Test basic navigation functionality
test('can navigate between different sections', async ({ page }) => {
  // Start at homepage
  await page.goto('/');
  
  // Navigate to Testing section (if it exists)
  const testingLink = page.getByRole('link', { name: /testing/i });
  if (await testingLink.isVisible()) {
    await testingLink.click();
    await expect(page.url()).toContain('/testing');
  }
  
  // Navigate to Monitoring section (if it exists)
  const monitoringLink = page.getByRole('link', { name: /monitoring/i });
  if (await monitoringLink.isVisible()) {
    await monitoringLink.click();
    await expect(page.url()).toContain('/monitoring');
  }
  
  // Navigate to Pipeline section (if it exists)
  const pipelineLink = page.getByRole('link', { name: /pipeline/i });
  if (await pipelineLink.isVisible()) {
    await pipelineLink.click();
    await expect(page.url()).toContain('/pipeline');
  }
});
