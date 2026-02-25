const { test, expect } = require('@playwright/test');

test.describe('Student Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as student
    await page.goto('/login');
    await page.fill('input[name="email"]', 'student@e2e.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button:has-text("Sign in as student")');
    await expect(page).toHaveURL(/\/student\/dashboard/);
  });

  test('Browse and Request Booking', async ({ page }) => {
    // Go to hostels listing
    await page.goto('/student/hostels');
    
    // Search for our test hostel
    await page.fill('input[placeholder="Search hostels…"]', 'E2E Testing Villa');
    
    // Click on the hostel card
    await page.click('text=E2E Testing Villa');
    await expect(page).toHaveURL(/\/student\/hostels\/.+/);

    // Click "Send Request" (or "Request Room" based on component)
    await page.click('button:has-text("Send Request")');

    // On Booking Request Page
    await expect(page).toHaveURL(/\/booking-request\/.+/);
    
    // Select floor
    await page.selectOption('select', { label: 'Floor 1 (Ground Floor)' });
    
    // Enter room number
    await page.fill('input[type="number"]', '101');
    
    // Submit request
    await page.click('button:has-text("Send Booking Request")');

    // Verify success message
    await expect(page.locator('h1')).toContainText(/Request Sent/i);
    await expect(page.locator('text=E2E Testing Villa')).toBeVisible();
  });
});
