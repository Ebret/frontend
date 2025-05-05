describe('Login Flow', () => {
  beforeEach(() => {
    // Visit the login page before each test
    cy.visit('/login');
  });

  it('displays the login form', () => {
    // Check that the login form elements are visible
    cy.get('h1').should('contain', 'Sign in to your account');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible').and('contain', 'Sign in');
  });

  it('shows validation errors for empty fields', () => {
    // Submit the form without entering any data
    cy.get('button[type="submit"]').click();

    // Check that validation errors are displayed
    cy.get('form').should('contain', 'Email is required');
    cy.get('form').should('contain', 'Password is required');
  });

  it('shows error for invalid credentials', () => {
    // Enter invalid credentials
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Check that error message is displayed
    cy.get('div[role="alert"]').should('be.visible')
      .and('contain', 'Invalid email or password');
  });

  it('successfully logs in with valid credentials', () => {
    // Intercept the login API call
    cy.intercept('POST', '**/auth/login').as('loginRequest');

    // Enter valid credentials (from test database)
    cy.get('input[name="email"]').type('member@test.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Wait for the login request to complete
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    // Check that user is redirected to dashboard
    cy.url().should('include', '/dashboard');
    
    // Check that user info is displayed in the header
    cy.get('header').should('contain', 'Member User');
  });

  it('navigates to registration page', () => {
    // Click on the registration link
    cy.contains('Create an account').click();
    
    // Check that user is redirected to registration page
    cy.url().should('include', '/register');
  });

  it('navigates to forgot password page', () => {
    // Click on the forgot password link
    cy.contains('Forgot your password?').click();
    
    // Check that user is redirected to forgot password page
    cy.url().should('include', '/forgot-password');
  });
});
