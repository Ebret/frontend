import { test, expect } from '@playwright/test';

// Mock data for the cooperative context
const mockCooperativeContext = {
  cooperativeType: 'MULTI_PURPOSE',
  cooperativeName: 'Test Cooperative',
  isLoading: false,
  isMultiPurpose: true,
};

// Mock data for the admin dashboard
const mockMetrics = [
  { name: 'Total Members', value: '1,254', change: '+12%', changeType: 'increase' },
  { name: 'Active Loans', value: '487', change: '+5%', changeType: 'increase' },
  { name: 'Total Deposits', value: '₱24.5M', change: '+8%', changeType: 'increase' },
  { name: 'Loan Disbursements (MTD)', value: '₱3.2M', change: '-3%', changeType: 'decrease' },
];

const mockFinancialData = {
  revenue: {
    total: 1250000,
    previousPeriod: 1150000,
    byCategory: {
      'Grocery': 625000,
      'Appliances': 312500,
    },
  },
  expenses: {
    total: 875000,
    previousPeriod: 805000,
    byCategory: {
      'Cost of Goods': 700000,
      'Salaries': 100000,
    },
  },
  profit: {
    total: 375000,
    previousPeriod: 345000,
  },
  transactions: {
    count: 3250,
    previousPeriod: 3000,
    byPaymentMethod: {
      'Cash': 1950,
      'Credit Card': 975,
    },
  },
  topProducts: [
    { id: 1, name: 'Rice (25kg)', quantity: 500, revenue: 625000 },
    { id: 2, name: 'Cooking Oil (1L)', quantity: 1200, revenue: 144000 },
  ],
};

const mockPendingApprovals = [
  { id: 1, type: 'Loan Application', name: 'Juan Dela Cruz', amount: '₱50,000', submittedAt: '2023-06-22 10:15:30' },
  { id: 2, type: 'Rate Change', name: 'Business Loan - 2 years', amount: '15% → 14.5%', submittedAt: '2023-06-22 11:30:45' },
];

const mockRecentActivity = [
  { id: 1, action: 'Loan Approved', user: 'Maria Santos', target: 'Pedro Reyes - ₱30,000', timestamp: '2023-06-22 15:45:22' },
  { id: 2, action: 'Rate Updated', user: 'Juan Dela Cruz', target: 'Time Deposit - 1 year: 4.5% → 5%', timestamp: '2023-06-22 14:30:15' },
];

// Mock the API responses
async function mockApiResponses(page) {
  await page.route('**/api/cooperative/info', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockCooperativeContext),
    });
  });
  
  await page.route('**/api/admin/metrics', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockMetrics),
    });
  });
  
  await page.route('**/api/admin/financial', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockFinancialData),
    });
  });
  
  await page.route('**/api/admin/approvals', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockPendingApprovals),
    });
  });
  
  await page.route('**/api/admin/activity', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockRecentActivity),
    });
  });
}

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await mockApiResponses(page);
    
    // Navigate to the admin dashboard
    await page.goto('/admin');
  });
  
  test('displays the admin dashboard correctly', async ({ page }) => {
    // Check that the page title is correct
    await expect(page).toHaveTitle(/Dashboard/);
    
    // Check that the dashboard header is displayed
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Check that the quick links section is displayed
    await expect(page.locator('h2')).toContainText('Quick Links');
    
    // Check that the metrics are displayed
    for (const metric of mockMetrics) {
      await expect(page.getByText(metric.value)).toBeVisible();
    }
    
    // Check that the unified dashboard is displayed
    await expect(page.getByText('Overview')).toBeVisible();
    await expect(page.getByText('Financial')).toBeVisible();
    await expect(page.getByText('Approvals')).toBeVisible();
    await expect(page.getByText('Activity')).toBeVisible();
  });
  
  test('navigates between dashboard tabs', async ({ page }) => {
    // Check that the overview tab is active by default
    await expect(page.getByText('Total Members')).toBeVisible();
    
    // Click on the financial tab
    await page.getByText('Financial').click();
    
    // Check that the financial dashboard is displayed
    await expect(page.getByText('Revenue by Category')).toBeVisible();
    
    // Click on the approvals tab
    await page.getByText('Approvals').click();
    
    // Check that the approvals table is displayed
    await expect(page.getByText('Pending Approvals')).toBeVisible();
    await expect(page.getByText('Juan Dela Cruz')).toBeVisible();
    
    // Click on the activity tab
    await page.getByText('Activity').click();
    
    // Check that the activity table is displayed
    await expect(page.getByText('Recent Activity')).toBeVisible();
    await expect(page.getByText('Maria Santos')).toBeVisible();
    
    // Click back to the overview tab
    await page.getByText('Overview').click();
    
    // Check that the overview is displayed again
    await expect(page.getByText('Total Members')).toBeVisible();
  });
  
  test('changes financial period', async ({ page }) => {
    // Click on the financial tab
    await page.getByText('Financial').click();
    
    // Check that the financial dashboard is displayed
    await expect(page.getByText('Revenue by Category')).toBeVisible();
    
    // Check that the period selector is set to monthly by default
    await expect(page.locator('select')).toHaveValue('monthly');
    
    // Change the period to yearly
    await page.locator('select').selectOption('yearly');
    
    // Check that the period selector is updated
    await expect(page.locator('select')).toHaveValue('yearly');
  });
  
  test('navigates to quick links', async ({ page }) => {
    // Check that the quick links are displayed
    await expect(page.getByText('Approve Loan Applications')).toBeVisible();
    
    // Click on the "Approve Loan Applications" link
    const navigationPromise = page.waitForNavigation();
    await page.getByText('Approve Loan Applications').click();
    await navigationPromise;
    
    // Check that we navigated to the loan approvals page
    await expect(page.url()).toContain('/admin/loans/approve');
  });
  
  test('shows accessibility menu', async ({ page }) => {
    // Check that the accessibility button is displayed
    const accessibilityButton = page.getByRole('button', { name: 'Accessibility options' });
    await expect(accessibilityButton).toBeVisible();
    
    // Click on the accessibility button
    await accessibilityButton.click();
    
    // Check that the accessibility menu is displayed
    await expect(page.getByText('Accessibility')).toBeVisible();
    await expect(page.getByText('Font Size')).toBeVisible();
    await expect(page.getByText('Contrast')).toBeVisible();
    await expect(page.getByText('Reduced Motion')).toBeVisible();
    
    // Increase font size
    await page.getByRole('button', { name: 'Increase font size' }).click();
    
    // Check that the font size is increased
    await expect(page.getByText('17px')).toBeVisible();
    
    // Toggle contrast
    await page.getByText('Normal Contrast').click();
    
    // Check that the contrast is changed
    await expect(page.getByText('High Contrast')).toBeVisible();
    
    // Close the accessibility menu
    await page.getByRole('button', { name: 'Close accessibility menu' }).click();
    
    // Check that the accessibility menu is closed
    await expect(page.getByText('Accessibility')).not.toBeVisible();
  });
  
  test('shows skip to content link on tab focus', async ({ page }) => {
    // Tab to focus the skip to content link
    await page.keyboard.press('Tab');
    
    // Check that the skip to content link is visible
    await expect(page.getByText('Skip to main content')).toBeVisible();
    
    // Click the skip to content link
    await page.getByText('Skip to main content').click();
    
    // Check that the focus is moved to the main content
    await expect(page.locator('#main-content')).toBeFocused();
  });
});

test.describe('Admin Dashboard - Credit Cooperative', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses with Credit Cooperative type
    await page.route('**/api/cooperative/info', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...mockCooperativeContext,
          cooperativeType: 'CREDIT',
          isMultiPurpose: false,
        }),
      });
    });
    
    // Mock other API responses
    await page.route('**/api/admin/metrics', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockMetrics),
      });
    });
    
    await page.route('**/api/admin/approvals', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPendingApprovals),
      });
    });
    
    await page.route('**/api/admin/activity', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockRecentActivity),
      });
    });
    
    // Navigate to the admin dashboard
    await page.goto('/admin');
  });
  
  test('displays the admin dashboard correctly for Credit Cooperative', async ({ page }) => {
    // Check that the page title is correct
    await expect(page).toHaveTitle(/Dashboard/);
    
    // Check that the dashboard header is displayed
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Check that the metrics are displayed
    for (const metric of mockMetrics) {
      await expect(page.getByText(metric.value)).toBeVisible();
    }
    
    // Check that the unified dashboard is displayed
    await expect(page.getByText('Overview')).toBeVisible();
    
    // Check that the financial tab is not displayed for Credit Cooperative
    await expect(page.getByText('Financial')).not.toBeVisible();
    
    // Check that the Multi-Purpose specific metrics are not displayed
    await expect(page.getByText('Multi-Purpose Metrics')).not.toBeVisible();
  });
});
