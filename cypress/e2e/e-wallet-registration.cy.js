describe('E-Wallet Registration Flow', () => {
  beforeEach(() => {
    // Mock the API responses
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 200,
      body: {
        user: {
          id: 1,
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
        },
        token: 'fake-jwt-token',
      },
    }).as('registerUser');

    cy.intercept('POST', '/api/audit-logs', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'Audit log created successfully',
      },
    }).as('createAuditLog');

    // Visit the E-Wallet registration page
    cy.visit('/e-wallet/register', { failOnStatusCode: false });
  });

  it('should complete the registration process successfully', () => {
    // Step 1: Fill out personal information
    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="lastName"]').type('Doe');
    cy.get('input[name="email"]').type('john.doe@example.com');
    cy.get('input[name="phoneNumber"]').type('+1234567890');
    cy.get('input[name="dateOfBirth"]').type('1990-01-01');

    // Proceed to step 2
    cy.get('button').contains('Next').click();

    // Step 2: Fill out additional information
    cy.get('input[name="address"]').should('be.visible');
    cy.get('input[name="address"]').type('123 Main St, City, Country');
    cy.get('select[name="idType"]').select('passport');
    cy.get('input[name="idNumber"]').type('AB123456');
    cy.get('input[name="password"]').type('Password123!');
    cy.get('input[name="confirmPassword"]').type('Password123!');

    // Verify data privacy agreement elements
    cy.get('img[alt="Philippines Data Privacy Act Logo"]').should('be.visible');
    cy.get('div').contains('In compliance with Republic Act No. 10173').should('be.visible');

    // Accept data privacy agreement
    cy.get('input[type="checkbox"]').check();

    // Submit the form
    cy.get('button').contains('Create Account').click();

    // Wait for API calls
    cy.wait('@registerUser');
    cy.wait('@createAuditLog');

    // Verify success message
    cy.get('div').contains('Your E-Wallet account has been created successfully').should('be.visible');
    cy.get('button').contains('Go to Dashboard').should('be.visible');
  });

  it('should validate required fields in step 1', () => {
    // Try to proceed without filling out required fields
    cy.get('button').contains('Next').click();

    // Verify validation messages
    cy.get('div').contains('First name is required').should('be.visible');
    cy.get('div').contains('Last name is required').should('be.visible');
    cy.get('div').contains('Email address is required').should('be.visible');
    cy.get('div').contains('Phone number is required').should('be.visible');
    cy.get('div').contains('Date of birth is required').should('be.visible');
  });

  it('should validate required fields in step 2', () => {
    // Fill out step 1
    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="lastName"]').type('Doe');
    cy.get('input[name="email"]').type('john.doe@example.com');
    cy.get('input[name="phoneNumber"]').type('+1234567890');
    cy.get('input[name="dateOfBirth"]').type('1990-01-01');

    // Proceed to step 2
    cy.get('button').contains('Next').click();

    // Try to submit without filling out required fields
    cy.get('button').contains('Create Account').click();

    // Verify validation messages
    cy.get('div').contains('Address is required').should('be.visible');
    cy.get('div').contains('ID number is required').should('be.visible');
    cy.get('div').contains('Password is required').should('be.visible');
    cy.get('div').contains('You must agree to the Data Privacy Agreement').should('be.visible');
  });

  it('should validate password requirements', () => {
    // Fill out step 1
    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="lastName"]').type('Doe');
    cy.get('input[name="email"]').type('john.doe@example.com');
    cy.get('input[name="phoneNumber"]').type('+1234567890');
    cy.get('input[name="dateOfBirth"]').type('1990-01-01');

    // Proceed to step 2
    cy.get('button').contains('Next').click();

    // Fill out step 2 with a weak password
    cy.get('input[name="address"]').type('123 Main St, City, Country');
    cy.get('select[name="idType"]').select('passport');
    cy.get('input[name="idNumber"]').type('AB123456');
    cy.get('input[name="password"]').type('password');
    cy.get('input[name="confirmPassword"]').type('password');
    cy.get('input[type="checkbox"]').check();

    // Submit the form
    cy.get('button').contains('Create Account').click();

    // Verify validation message
    cy.get('div').contains('Password must be at least 8 characters and include uppercase, lowercase, number, and special character').should('be.visible');
  });

  it('should validate password confirmation', () => {
    // Fill out step 1
    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="lastName"]').type('Doe');
    cy.get('input[name="email"]').type('john.doe@example.com');
    cy.get('input[name="phoneNumber"]').type('+1234567890');
    cy.get('input[name="dateOfBirth"]').type('1990-01-01');

    // Proceed to step 2
    cy.get('button').contains('Next').click();

    // Fill out step 2 with mismatched passwords
    cy.get('input[name="address"]').type('123 Main St, City, Country');
    cy.get('select[name="idType"]').select('passport');
    cy.get('input[name="idNumber"]').type('AB123456');
    cy.get('input[name="password"]').type('Password123!');
    cy.get('input[name="confirmPassword"]').type('Password456!');
    cy.get('input[type="checkbox"]').check();

    // Submit the form
    cy.get('button').contains('Create Account').click();

    // Verify validation message
    cy.get('div').contains('Passwords do not match').should('be.visible');
  });
});
