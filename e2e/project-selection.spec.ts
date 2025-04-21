import { test, expect } from '@playwright/test';

test.describe('Project Selection Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the home page before each test
    await page.goto('/');
  });

  test('should display available projects', async ({ page }) => {
    // Verify that projects are displayed
    await expect(page.getByText('Project 1')).toBeVisible();
    await expect(page.getByText('Project 2')).toBeVisible();
    await expect(page.getByText('Project 3')).toBeVisible();
  });

  test('should allow selecting a project', async ({ page }) => {
    // Click on a project
    await page.getByText('Project 1').click();
    
    // Verify that the project is selected (this depends on your UI implementation)
    await expect(page.getByTestId('selected-project')).toHaveText('Project 1');
    
    // Verify that we navigate to the project dashboard or detail page
    await expect(page).toHaveURL(/.*\/project\/project1/);
  });
  
  test('should remember selected project on refresh', async ({ page }) => {
    // Select a project
    await page.getByText('Project 2').click();
    
    // Verify selected
    await expect(page.getByTestId('selected-project')).toHaveText('Project 2');
    
    // Refresh the page
    await page.reload();
    
    // Verify the project is still selected
    await expect(page.getByTestId('selected-project')).toHaveText('Project 2');
  });
  
  test('should display placeholder when no project is selected', async ({ page }) => {
    // Clear localStorage to ensure no project is selected
    await page.evaluate(() => localStorage.clear());
    
    // Refresh the page
    await page.reload();
    
    // Check for placeholder text
    await expect(page.getByText('No project selected')).toBeVisible();
    await expect(page.getByText('Please select a project to get started')).toBeVisible();
  });
  
  test('should navigate to project details when clicking on a project', async ({ page }) => {
    // Click on Project 3
    await page.getByText('Project 3').click();
    
    // Verify navigation to project details
    await expect(page).toHaveURL(/.*\/project\/project3/);
    
    // Verify project details are displayed
    await expect(page.getByText('Project 3 description')).toBeVisible();
  });
});
