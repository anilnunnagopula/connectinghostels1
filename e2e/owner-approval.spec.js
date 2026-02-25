const { test, expect } = require('@playwright/test');

test.describe('Owner Approval Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as owner
    await page.goto('/login');
    await page.fill('input[name="email"]', 'owner@e2e.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button:has-text("Hostel Owner")');
    await page.click('button:has-text("Sign in as owner")');
    await expect(page).toHaveURL(/\/owner\/dashboard/);
  });

  test('Approve Student Booking Request', async ({ page }) => {
    // Navigate to View Requests
    await page.goto('/owner/view-requests');

    // Find the request from E2E Student
    // The UI uses "E2E Student" (from our seed)
    const requestCard = page.locator('div:has-text("E2E Student")').last();
    await expect(requestCard).toBeVisible();

    // Click "Authorize Lease"
    await requestCard.locator('button:has-text("Authorize Lease")').click();

    // Verify toast success or card removal
    // Assuming toast appears and card is removed
    await expect(page.locator('text=Lease Activated Successfully')).toBeVisible();
    await expect(page.locator('text=E2E Student')).not.toBeVisible();
  });
});
