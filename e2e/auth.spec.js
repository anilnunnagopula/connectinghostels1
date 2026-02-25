const { test, expect } = require('@playwright/test');

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('Student Login Success', async ({ page }) => {
    // Fill login form
    await page.fill('input[name="email"]', 'student@e2e.com');
    await page.fill('input[name="password"]', 'password123');
    
    // Ensure student role is selected (default)
    await page.click('button:has-text("Student")');
    
    // Submit
    await page.click('button:has-text("Sign in as student")');

    // Expect redirection to student dashboard
    await expect(page).toHaveURL(/\/student\/dashboard/);
    await expect(page.locator('h1')).toContainText(/Dashboard/i);
  });

  test('Owner Login Success', async ({ page }) => {
    // Fill login form
    await page.fill('input[name="email"]', 'owner@e2e.com');
    await page.fill('input[name="password"]', 'password123');
    
    // Select owner role
    await page.click('button:has-text("Hostel Owner")');
    
    // Submit
    await page.click('button:has-text("Sign in as owner")');

    // Expect redirection to owner dashboard
    await expect(page).toHaveURL(/\/owner\/dashboard/);
    await expect(page.locator('h1')).toContainText(/Command/i || /Dashboard/i);
  });

  test('Logout Functionality', async ({ page }) => {
    // Login first as student
    await page.fill('input[name="email"]', 'student@e2e.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button:has-text("Sign in as student")');
    await expect(page).toHaveURL(/\/student\/dashboard/);

    // Click logout (assuming it's in a sidebar or header)
    // Looking at OwnerLayout, there might be a logout button
    await page.click('button:has-text("Logout")');

    // Expect redirection to login
    await expect(page).toHaveURL(/\/login/);
  });
});
