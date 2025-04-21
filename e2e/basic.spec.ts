import { test, expect } from '@playwright/test';

// Basic test to verify app loads correctly
test('app loads with correct title', async ({ page }) => {
  // Navigate to the application
  await page.goto('/');
  
  // Check that the page loads with expected title
  await expect(page).toHaveTitle(/Poly Micro Manager/);
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

// Test responsive design
test('app is responsive', async ({ page }) => {
  // Set viewport to desktop size
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  
  // Check navigation is visible on desktop
  const navigation = page.getByRole('navigation');
  await expect(navigation).toBeVisible();
  
  // Set viewport to mobile size
  await page.setViewportSize({ width: 375, height: 667 });
  
  // On mobile, navigation might be hidden behind a menu button
  const menuButton = page.getByRole('button', { name: /menu/i });
  if (await menuButton.isVisible()) {
    await menuButton.click();
    // Check that navigation appears after clicking the menu button
    await expect(navigation).toBeVisible();
  }
});
