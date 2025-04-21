import { test, expect } from '@playwright/test';

test.describe('Microservice Management', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the home page and select a project before each test
    await page.goto('/');
    await page.getByText('Project 1').click();
    
    // Wait for microservices to load
    await page.waitForSelector('[data-testid="microservice-list"]');
  });

  test('should display microservices for selected project', async ({ page }) => {
    // Verify microservices are displayed
    await expect(page.getByText('Microservice 1')).toBeVisible();
    await expect(page.getByText('Microservice 2')).toBeVisible();
  });

  test('should allow searching for microservices', async ({ page }) => {
    // Click on search icon
    await page.getByTestId('search-microservices-button').click();
    
    // Search input should be visible
    await expect(page.getByTestId('search-input')).toBeVisible();
    
    // Enter search term
    await page.getByTestId('search-input').fill('Microservice 1');
    
    // Verify filtered results
    await expect(page.getByText('Microservice 1')).toBeVisible();
    await expect(page.getByText('Microservice 2')).not.toBeVisible();
    
    // Clear search
    await page.getByTestId('search-input').clear();
    
    // All microservices should be visible again
    await expect(page.getByText('Microservice 1')).toBeVisible();
    await expect(page.getByText('Microservice 2')).toBeVisible();
  });

  test('should navigate between microservices', async ({ page }) => {
    // Click on Microservice 1
    await page.getByText('Microservice 1').click();
    
    // Verify selection
    await expect(page.getByTestId('selected-microservice')).toHaveText('Microservice 1');
    
    // Click on Microservice 2
    await page.getByText('Microservice 2').click();
    
    // Verify selection changed
    await expect(page.getByTestId('selected-microservice')).toHaveText('Microservice 2');
  });

  test('should preserve microservice state when navigating back to it', async ({ page }) => {
    // Select Microservice 1
    await page.getByText('Microservice 1').click();
    
    // Perform some action that changes state (e.g., expand a test item)
    await page.getByTestId('test-item-test1').click();
    
    // Verify test item is expanded
    await expect(page.getByTestId('test-item-test1-expanded')).toBeVisible();
    
    // Navigate to Microservice 2
    await page.getByText('Microservice 2').click();
    
    // Navigate back to Microservice 1
    await page.getByText('Microservice 1').click();
    
    // Verify state is preserved (test item is still expanded)
    await expect(page.getByTestId('test-item-test1-expanded')).toBeVisible();
  });

  test('should default to first microservice when none is selected', async ({ page }) => {
    // Go to project page without previously selected microservice
    await page.evaluate(() => {
      // Keep project selection but clear microservice selection
      const projectId = localStorage.getItem('selectedProject');
      localStorage.clear();
      if (projectId) localStorage.setItem('selectedProject', projectId);
    });
    
    // Refresh page
    await page.reload();
    
    // The first microservice should be selected by default
    await expect(page.getByTestId('selected-microservice')).toHaveText('Microservice 1');
  });
});
