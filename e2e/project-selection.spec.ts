import { test, expect } from '@playwright/test';

// Test user credentials
const TEST_USER = {
  username: 'testuser',
  password: 'password123',
  email: 'test@example.com',
  businessName: 'Test Company'
};

test.describe('Project Selection Flow', () => {
  // Register user once before all tests
  test.beforeAll(async ({ browser }) => {
    // Skip registration if the test user already exists
    // This is a workaround to make tests more reliable
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Navigate to register page
    await page.goto('/register');
    
    // Wait for the registration form
    await page.waitForSelector('form');
    
    // Fill in registration details
    await page.fill('#businessName', TEST_USER.businessName);
    await page.fill('#email', TEST_USER.email);
    await page.fill('#username', TEST_USER.username);
    await page.fill('#password', TEST_USER.password);
    
    // Submit registration form
    await page.click('button[type="submit"]');
    
    // Wait for registration to complete (should redirect to login)
    await page.waitForURL('**/login');
    
    await context.close();
  });
  
  // Setup authentication before each test
  test.beforeEach(async ({ page }) => {
    // Go to the login page
    await page.goto('/login');

    // Wait for the login page to load
    await page.waitForSelector('form');

    // Fill in login credentials and submit
    await page.fill('#username', TEST_USER.username);
    await page.fill('#password', TEST_USER.password);
    await page.click('button[type="submit"]');

    // Wait for navigation to dashboard after login
    await page.waitForURL('**/dashboard');
  });

  test('should allow selecting a project', async ({ page }) => {
    // Click on a project
    await page.evaluate(() => {
      console.log("Current page URL:", window.location.href);
    });
    
    // Select the project by ID since the value is the ID, not the name
    await page.getByTestId('selected-project').selectOption('1');
    
    // Verify that the project is selected (by ID)
    await expect(page.getByTestId('selected-project')).toHaveValue('1');
  });

  test('should display available projects', async ({ page }) => {
    // Verify that projects are displayed
    // Log more detailed page information
    await page.evaluate(() => {
      console.log('Page title:', document.title);
      console.log('Current pathname:', window.location.pathname);
      console.log('Current search params:', window.location.search);
    });
    const element = page.getByTestId('selected-project');
    
    // Wait for the select element to be visible
    await element.waitFor({ state: 'visible' });
    
    // Get all options from the select element
    const options = await page.evaluate(() => {
      const select = document.querySelector('[data-testid="selected-project"]') as HTMLSelectElement;
      console.log('Select:', select);
      return Array.from(select?.options || []).map(option => option.text);
    });
    
    // Verify the project options
    expect(options).toContain('Select a project');
    expect(options).toContain('E-commerce Platform');
    expect(options).toContain('Banking System');
    expect(options).toContain('Healthcare Portal');
    expect(options).toContain('Education Platform');
  });

  test('should remember selected project on refresh', async ({ page }) => {
    // Log the current URL
    await page.evaluate(() => {
      console.log('Current page URL:', window.location.href);
    });
    
    // Select a project
    await page.getByTestId('selected-project').selectOption('2');
    
    // Verify selected
    await expect(page.getByTestId('selected-project')).toHaveValue('2');
    
    // Refresh the page
    await page.reload();
    
    // Log URL after refresh
    await page.evaluate(() => {
      console.log('URL after refresh:', window.location.href);
    });
    
    // We need to login again after refresh
    await page.fill('#username', TEST_USER.username);
    await page.fill('#password', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    // Log URL after login
    await page.evaluate(() => {
      console.log('URL after login:', window.location.href);
    });
    
    // Verify the project is still selected
    await expect(page.getByTestId('selected-project')).toHaveValue('2');
  });
  
  test('should display placeholder when no project is selected', async ({ page }) => {
    // Clear localStorage to ensure no project is selected
    await page.evaluate(() => {
      // Keep the authentication data but remove project selection
      const user = localStorage.getItem('currentUser');
      localStorage.clear();
      if (user) localStorage.setItem('currentUser', user);
    });
    
    // Refresh the page
    await page.reload();
    
    // Verify the default option is selected
    const selectedValue = await page.evaluate(() => {
      const select = document.querySelector('[data-testid="selected-project"]') as HTMLSelectElement;
      return select?.value;
    });
    
    expect(selectedValue).toBe('');
  });

  test('should show microservices for the selected project', async ({ page }) => {
    // Select a specific project
    await page.getByTestId('selected-project').selectOption('1');
    
    // Wait for microservices to load
    await page.waitForTimeout(500);
    
    // Verify microservices for the selected project are displayed
    await expect(page.getByText('User Service')).toBeVisible();
    await expect(page.getByText('Payment Service')).toBeVisible();
  });

  test('should handle switching between projects', async ({ page }) => {
    // Select first project
    await page.getByTestId('selected-project').selectOption('1');
    await page.waitForTimeout(500);
    
    // Verify first project's microservices
    await expect(page.getByText('User Service')).toBeVisible();
    
    // Switch to second project
    await page.getByTestId('selected-project').selectOption('2');
    await page.waitForTimeout(500);
    
    // Verify second project's microservices
    await expect(page.getByText('Loan Service')).toBeVisible();
    await expect(page.getByText('Payment Service')).toBeVisible();
  });

  test('should persist project selection in local storage', async ({ page }) => {
    // Select a project
    await page.getByTestId('selected-project').selectOption('3');
    
    // Verify local storage has been updated
    const storedProject = await page.evaluate(() => {
      return localStorage?.getItem('lastSelectedProject');
    });
    
    // The actual storage format will depend on your implementation
    expect(storedProject).not.toBeNull();
    expect(storedProject).toBe('3');
  });
});
