import { test, expect } from '@playwright/test';

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the home page first
    await page.goto('/');
    // Select a project (assuming it's needed for navigation)
    await page.getByText('Project 1').click();
    // Navigate to settings page
    await page.getByTestId('settings-button').click();
    
    // Should be on the settings page
    await expect(page).toHaveURL(/.*\/settings/);
  });

  test('displays the user settings page with correct sections', async ({ page }) => {
    // Check page title
    await expect(page.getByRole('heading', { name: 'User Settings' })).toBeVisible();
    
    // Check that main sections are visible
    await expect(page.getByText('Appearance')).toBeVisible();
    await expect(page.getByText('Notifications')).toBeVisible();
    await expect(page.getByText('Default Project')).toBeVisible();
  });

  test('allows changing theme preference', async ({ page }) => {
    // Default should be light theme
    await expect(page.getByLabel('Light')).toBeChecked();
    
    // Change to dark theme
    await page.getByLabel('Dark').check();
    
    // Save settings
    await page.getByRole('button', { name: 'Save Changes' }).click();
    
    // Verify success message
    await expect(page.getByText('Settings saved successfully')).toBeVisible();
    
    // Refresh the page
    await page.reload();
    
    // Dark theme should still be selected
    await expect(page.getByLabel('Dark')).toBeChecked();
    
    // UI should have dark theme applied
    await expect(page.locator('body')).toHaveClass(/dark-theme/);
  });

  test('allows toggling notifications', async ({ page }) => {
    // Notifications toggle should be visible
    const notificationsToggle = page.getByTestId('notifications-toggle');
    await expect(notificationsToggle).toBeVisible();
    
    // Get initial state
    const initialState = await notificationsToggle.isChecked();
    
    // Toggle notifications
    await notificationsToggle.click();
    
    // Save settings
    await page.getByRole('button', { name: 'Save Changes' }).click();
    
    // Refresh the page
    await page.reload();
    
    // Toggle should have the new state
    await expect(page.getByTestId('notifications-toggle')).toBeChecked({ checked: !initialState });
  });

  test('allows changing default project', async ({ page }) => {
    // Default project dropdown should be visible
    const projectSelect = page.getByTestId('default-project-select');
    await expect(projectSelect).toBeVisible();
    
    // Select a different project
    await projectSelect.click();
    await page.getByText('Project 2').click();
    
    // Save settings
    await page.getByRole('button', { name: 'Save Changes' }).click();
    
    // Refresh the page
    await page.reload();
    
    // Project 2 should be selected
    await expect(page.getByTestId('default-project-select')).toHaveValue('project2');
  });

  test('shows error message for invalid settings', async ({ page }) => {
    // Try to save with an invalid setting (mock this by manipulating the page)
    await page.evaluate(() => {
      // Create a custom event to simulate invalid data
      const event = new CustomEvent('invalid-settings');
      document.dispatchEvent(event);
    });
    
    // Click save
    await page.getByRole('button', { name: 'Save Changes' }).click();
    
    // Should show error message
    await expect(page.getByText('Failed to save settings')).toBeVisible();
  });

  test('allows resetting to default settings', async ({ page }) => {
    // Reset button should be visible
    const resetButton = page.getByRole('button', { name: 'Reset to Defaults' });
    await expect(resetButton).toBeVisible();
    
    // Change some settings first
    await page.getByLabel('Dark').check();
    
    // Click reset
    await resetButton.click();
    
    // Should show confirmation dialog
    await expect(page.getByText('Reset all settings to default values?')).toBeVisible();
    
    // Confirm reset
    await page.getByRole('button', { name: 'Reset' }).click();
    
    // Settings should be reset to defaults
    await expect(page.getByLabel('Light')).toBeChecked();
    
    // Should show success message
    await expect(page.getByText('Settings reset to defaults')).toBeVisible();
  });

  test('cancels settings changes when cancel button is clicked', async ({ page }) => {
    // Change theme to dark
    await page.getByLabel('Dark').check();
    
    // Click cancel
    await page.getByRole('button', { name: 'Cancel' }).click();
    
    // Should navigate away from settings
    await expect(page).not.toHaveURL(/.*\/settings/);
    
    // Go back to settings
    await page.getByTestId('settings-button').click();
    
    // Theme should still be light (unchanged)
    await expect(page.getByLabel('Light')).toBeChecked();
  });

  test('guards against unsaved changes when navigating away', async ({ page }) => {
    // Change theme to dark
    await page.getByLabel('Dark').check();
    
    // Try to navigate away
    await page.getByTestId('app-logo').click();
    
    // Should show confirmation dialog
    await expect(page.getByText('You have unsaved changes')).toBeVisible();
    
    // Cancel navigation
    await page.getByRole('button', { name: 'Stay on Page' }).click();
    
    // Should still be on settings page
    await expect(page).toHaveURL(/.*\/settings/);
    
    // Dark theme should still be selected
    await expect(page.getByLabel('Dark')).toBeChecked();
    
    // Try to navigate away again
    await page.getByTestId('app-logo').click();
    
    // Confirm navigation this time
    await page.getByRole('button', { name: 'Discard Changes' }).click();
    
    // Should navigate away
    await expect(page).not.toHaveURL(/.*\/settings/);
  });
});
