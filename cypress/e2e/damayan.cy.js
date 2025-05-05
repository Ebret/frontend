describe('Damayan Feature', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/login');
    cy.get('input[name="email"]').type('member@test.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Wait for dashboard to load
    cy.url().should('include', '/dashboard');
  });

  it('displays Damayan widget on dashboard', () => {
    // Check that the Damayan widget is visible on the dashboard
    cy.get('h3').contains('Damayan').should('be.visible');
    cy.get('div').contains('Your Contributions').should('be.visible');
    cy.contains('Contribute').should('be.visible');
  });

  it('navigates to Damayan dashboard', () => {
    // Click on the Dashboard link in the Damayan widget
    cy.contains('Dashboard').click();
    
    // Check that user is redirected to Damayan dashboard
    cy.url().should('include', '/damayan');
    
    // Check that Damayan dashboard elements are visible
    cy.get('h1').contains('Damayan Dashboard').should('be.visible');
    cy.contains('Fund Status').should('be.visible');
    cy.contains('Your Contributions').should('be.visible');
  });

  it('makes a contribution from the widget', () => {
    // Intercept the contribution API call
    cy.intercept('POST', '**/damayan/contributions').as('contributionRequest');
    
    // Click on the Contribute button in the widget
    cy.contains('Contribute').click();
    
    // Check that the quick contribution form is displayed
    cy.contains('Quick Contribution').should('be.visible');
    
    // Select an amount and submit
    cy.contains('₱50').click();
    cy.contains('Contribute ₱50').click();
    
    // Wait for the contribution request to complete
    cy.wait('@contributionRequest').its('response.statusCode').should('eq', 200);
    
    // Check that success message is displayed
    cy.contains('Thank you for your contribution').should('be.visible');
  });

  it('navigates to contribution history', () => {
    // Navigate to Damayan dashboard first
    cy.contains('Dashboard').click();
    cy.url().should('include', '/damayan');
    
    // Click on the View History link
    cy.contains('View History').click();
    
    // Check that user is redirected to contribution history page
    cy.url().should('include', '/damayan/history');
    
    // Check that history page elements are visible
    cy.get('h1').contains('Contribution History').should('be.visible');
    cy.contains('Your Damayan contribution history').should('be.visible');
    
    // Check that both chart and list views work
    cy.contains('Chart').click();
    cy.get('div[class*="chart"]').should('be.visible');
    
    cy.contains('List').click();
    cy.get('table').should('be.visible');
  });

  it('navigates to settings page and updates settings', () => {
    // Intercept the settings API call
    cy.intercept('PUT', '**/damayan/users/*/settings').as('updateSettingsRequest');
    
    // Navigate to Damayan dashboard first
    cy.contains('Dashboard').click();
    cy.url().should('include', '/damayan');
    
    // Click on the Settings link
    cy.contains('Settings').click();
    
    // Check that user is redirected to settings page
    cy.url().should('include', '/damayan/settings');
    
    // Check that settings page elements are visible
    cy.get('h1').contains('Damayan Settings').should('be.visible');
    
    // Update settings
    cy.get('input[name="autoContribute"]').check();
    cy.get('input[name="contributionAmount"]').clear().type('25');
    cy.contains('Save Changes').click();
    
    // Wait for the update request to complete
    cy.wait('@updateSettingsRequest').its('response.statusCode').should('eq', 200);
    
    // Check that success message is displayed
    cy.contains('Settings updated successfully').should('be.visible');
  });

  it('navigates to notifications page', () => {
    // Navigate to Damayan dashboard first
    cy.contains('Dashboard').click();
    cy.url().should('include', '/damayan');
    
    // Click on the Notifications link
    cy.contains('Notifications').click();
    
    // Check that user is redirected to notifications page
    cy.url().should('include', '/damayan/notifications');
    
    // Check that notifications page elements are visible
    cy.get('h1').contains('Damayan Notifications').should('be.visible');
    
    // Check that notifications are displayed or empty state is shown
    cy.get('body').then(($body) => {
      if ($body.text().includes('No notifications')) {
        cy.contains('No notifications').should('be.visible');
      } else {
        cy.get('div[class*="notification"]').should('be.visible');
      }
    });
  });

  it('requests assistance from the dashboard', () => {
    // Intercept the assistance request API call
    cy.intercept('POST', '**/damayan/assistance').as('assistanceRequest');
    
    // Navigate to Damayan dashboard
    cy.contains('Dashboard').click();
    cy.url().should('include', '/damayan');
    
    // Click on the Request Assistance button
    cy.contains('Request Assistance').click();
    
    // Fill out the assistance request form
    cy.get('input[name="amount"]').type('300');
    cy.get('textarea[name="reason"]').type('Test assistance request from Cypress');
    cy.get('select[name="damayanFundId"]').select(1);
    
    // Submit the form
    cy.contains('Submit Request').click();
    
    // Wait for the request to complete
    cy.wait('@assistanceRequest').its('response.statusCode').should('eq', 200);
    
    // Check that success message is displayed
    cy.contains('Assistance request submitted successfully').should('be.visible');
  });
});
