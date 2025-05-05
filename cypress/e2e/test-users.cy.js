/// <reference types="cypress" />

describe('Test Users Management', () => {
  beforeEach(() => {
    // Login as admin before each test
    cy.visit('/login');
    cy.get('input[name="email"]').type('admin@kacooperatiba.com');
    cy.get('input[name="password"]').type('Password123!');
    cy.get('button[type="submit"]').click();
    
    // Wait for login to complete and redirect
    cy.url().should('include', '/admin');
  });
  
  it('should display predefined test users', () => {
    // Navigate to test users page
    cy.visit('/admin/test-users');
    
    // Check if the predefined test users section is displayed
    cy.contains('h2', 'Predefined Test Users').should('be.visible');
    
    // Check if all roles are displayed
    cy.contains('Admin / System Administrator').should('be.visible');
    cy.contains('Board of Directors').should('be.visible');
    cy.contains('General Manager').should('be.visible');
    cy.contains('Credit Officer').should('be.visible');
    cy.contains('Accountant').should('be.visible');
    cy.contains('Teller').should('be.visible');
    cy.contains('Compliance Officer').should('be.visible');
    cy.contains('Regular Member').should('be.visible');
    cy.contains('Membership Officer').should('be.visible');
    cy.contains('Security Manager').should('be.visible');
    cy.contains('Marketing Officer').should('be.visible');
    cy.contains('Partner/Third-Party User').should('be.visible');
    
    // Check if all emails are displayed
    cy.contains('admin@kacooperatiba.com').should('be.visible');
    cy.contains('director@kacooperatiba.com').should('be.visible');
    cy.contains('manager@kacooperatiba.com').should('be.visible');
    cy.contains('credit@kacooperatiba.com').should('be.visible');
    cy.contains('accountant@kacooperatiba.com').should('be.visible');
    cy.contains('teller@kacooperatiba.com').should('be.visible');
    cy.contains('compliance@kacooperatiba.com').should('be.visible');
    cy.contains('member@kacooperatiba.com').should('be.visible');
    cy.contains('membership@kacooperatiba.com').should('be.visible');
    cy.contains('security@kacooperatiba.com').should('be.visible');
    cy.contains('marketing@kacooperatiba.com').should('be.visible');
    cy.contains('partner@kacooperatiba.com').should('be.visible');
    
    // Check if the password is displayed
    cy.contains('Password123!').should('be.visible');
  });
  
  it('should copy email to clipboard when copy button is clicked', () => {
    // Navigate to test users page
    cy.visit('/admin/test-users');
    
    // Stub the clipboard API
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'writeText').resolves();
    });
    
    // Click the copy button for the admin user
    cy.contains('tr', 'Admin / System Administrator')
      .find('button')
      .contains('Copy Email')
      .click();
    
    // Check if the clipboard API was called with the correct email
    cy.window().then((win) => {
      expect(win.navigator.clipboard.writeText).to.be.calledWith('admin@kacooperatiba.com');
    });
    
    // Check if the button text changed to "Copied!"
    cy.contains('Copied!').should('be.visible');
  });
  
  it('should create a custom test user', () => {
    // Navigate to test users page
    cy.visit('/admin/test-users');
    
    // Scroll to the custom test user section
    cy.contains('h2', 'Create Custom Test Users').scrollIntoView();
    
    // Select the Member role
    cy.get('select[name="role"]').select('MEMBER');
    
    // Click the Create Test User button
    cy.contains('button', 'Create Test User').click();
    
    // Wait for the user to be created
    cy.contains('Test User').should('be.visible');
    
    // Check if the user appears in the list
    cy.get('table').contains('tr', 'Test User').should('be.visible');
  });
  
  it('should create a batch of test users', () => {
    // Navigate to test users page
    cy.visit('/admin/test-users');
    
    // Scroll to the custom test user section
    cy.contains('h2', 'Create Custom Test Users').scrollIntoView();
    
    // Enable batch mode
    cy.get('input#batchMode').check();
    
    // Set the batch count to 3
    cy.get('input#batchCount').clear().type('3');
    
    // Click the Create Test Users button
    cy.contains('button', 'Create 3 Test Users').click();
    
    // Wait for the users to be created
    cy.contains('Successfully created 3 test users').should('be.visible');
    
    // Check if the users appear in the list
    cy.get('table').find('tr').should('have.length.at.least', 3);
  });
});
