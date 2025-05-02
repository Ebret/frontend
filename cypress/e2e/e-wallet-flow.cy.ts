describe('E-Wallet Flow', () => {
  beforeEach(() => {
    // Mock the API responses
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'Registration successful',
        data: {
          user: {
            id: 1,
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'MEMBER',
          },
        },
      },
    }).as('register');
    
    cy.intercept('POST', '/api/audit-logs', {
      statusCode: 201,
      body: {
        status: 'success',
        message: 'Audit log created successfully',
        data: {
          id: 1,
        },
      },
    }).as('createAuditLog');
    
    cy.intercept('POST', '/api/e-wallets', {
      statusCode: 201,
      body: {
        status: 'success',
        message: 'E-Wallet created successfully',
        data: {
          walletId: 'WALLET-123456',
          userId: 1,
          balance: 0,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
        },
      },
    }).as('createEWallet');
    
    // Visit the E-Wallet registration page
    cy.visit('/e-wallet/register');
  });
  
  it('completes the E-Wallet registration process', () => {
    // Step 1: Fill out basic information
    cy.get('input[name="firstName"]').type('Test');
    cy.get('input[name="lastName"]').type('User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="phoneNumber"]').type('+1234567890');
    cy.get('input[name="dateOfBirth"]').type('1990-01-01');
    
    // Proceed to step 2
    cy.contains('button', 'Next').click();
    
    // Step 2: Fill out additional information
    cy.get('input[name="address"]').should('be.visible').type('123 Main St');
    cy.get('select[name="idType"]').select('passport');
    cy.get('input[name="idNumber"]').type('AB123456');
    cy.get('input[name="password"]').type('Password123!');
    cy.get('input[name="confirmPassword"]').type('Password123!');
    
    // Accept the privacy agreement
    cy.contains('label', 'I agree to the').within(() => {
      cy.get('input[type="checkbox"]').check();
    });
    
    // Submit the form
    cy.contains('button', 'Create account').click();
    
    // Wait for API calls
    cy.wait('@register');
    cy.wait('@createAuditLog').its('request.body').should('have.property', 'actionType', 'DATA_PRIVACY_AGREEMENT_ACCEPTED');
    cy.wait('@createAuditLog').its('request.body').should('have.property', 'actionType', 'E_WALLET_CREATED');
    
    // Verify success message
    cy.contains('Your e-wallet account has been created successfully').should('be.visible');
    cy.contains('a', 'Sign in').should('be.visible');
  });
  
  it('validates required fields in step 1', () => {
    // Try to proceed without filling out the form
    cy.contains('button', 'Next').click();
    
    // Error messages should be displayed
    cy.contains('First name is required').should('be.visible');
    cy.contains('Last name is required').should('be.visible');
    cy.contains('Email is required').should('be.visible');
    cy.contains('Phone number is required').should('be.visible');
    cy.contains('Date of birth is required').should('be.visible');
  });
  
  it('validates required fields in step 2', () => {
    // Fill out step 1
    cy.get('input[name="firstName"]').type('Test');
    cy.get('input[name="lastName"]').type('User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="phoneNumber"]').type('+1234567890');
    cy.get('input[name="dateOfBirth"]').type('1990-01-01');
    
    // Proceed to step 2
    cy.contains('button', 'Next').click();
    
    // Try to submit without filling out step 2
    cy.contains('button', 'Create account').click();
    
    // Error messages should be displayed
    cy.contains('Address is required').should('be.visible');
    cy.contains('ID type is required').should('be.visible');
    cy.contains('ID number is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
    cy.contains('You must agree to the Data Privacy Agreement').should('be.visible');
  });
  
  it('validates email format', () => {
    // Fill out step 1 with invalid email
    cy.get('input[name="firstName"]').type('Test');
    cy.get('input[name="lastName"]').type('User');
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('input[name="phoneNumber"]').type('+1234567890');
    cy.get('input[name="dateOfBirth"]').type('1990-01-01');
    
    // Proceed to step 2
    cy.contains('button', 'Next').click();
    
    // Error message should be displayed
    cy.contains('Please enter a valid email address').should('be.visible');
  });
  
  it('validates password strength', () => {
    // Fill out step 1
    cy.get('input[name="firstName"]').type('Test');
    cy.get('input[name="lastName"]').type('User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="phoneNumber"]').type('+1234567890');
    cy.get('input[name="dateOfBirth"]').type('1990-01-01');
    
    // Proceed to step 2
    cy.contains('button', 'Next').click();
    
    // Fill out step 2 with weak password
    cy.get('input[name="address"]').type('123 Main St');
    cy.get('select[name="idType"]').select('passport');
    cy.get('input[name="idNumber"]').type('AB123456');
    cy.get('input[name="password"]').type('weak');
    cy.get('input[name="confirmPassword"]').type('weak');
    
    // Accept the privacy agreement
    cy.contains('label', 'I agree to the').within(() => {
      cy.get('input[type="checkbox"]').check();
    });
    
    // Submit the form
    cy.contains('button', 'Create account').click();
    
    // Error message should be displayed
    cy.contains('Password must be at least 8 characters').should('be.visible');
  });
  
  it('validates password confirmation', () => {
    // Fill out step 1
    cy.get('input[name="firstName"]').type('Test');
    cy.get('input[name="lastName"]').type('User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="phoneNumber"]').type('+1234567890');
    cy.get('input[name="dateOfBirth"]').type('1990-01-01');
    
    // Proceed to step 2
    cy.contains('button', 'Next').click();
    
    // Fill out step 2 with mismatched passwords
    cy.get('input[name="address"]').type('123 Main St');
    cy.get('select[name="idType"]').select('passport');
    cy.get('input[name="idNumber"]').type('AB123456');
    cy.get('input[name="password"]').type('Password123!');
    cy.get('input[name="confirmPassword"]').type('DifferentPassword123!');
    
    // Accept the privacy agreement
    cy.contains('label', 'I agree to the').within(() => {
      cy.get('input[type="checkbox"]').check();
    });
    
    // Submit the form
    cy.contains('button', 'Create account').click();
    
    // Error message should be displayed
    cy.contains('Passwords do not match').should('be.visible');
  });
  
  it('allows navigation between steps', () => {
    // Fill out step 1
    cy.get('input[name="firstName"]').type('Test');
    cy.get('input[name="lastName"]').type('User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="phoneNumber"]').type('+1234567890');
    cy.get('input[name="dateOfBirth"]').type('1990-01-01');
    
    // Proceed to step 2
    cy.contains('button', 'Next').click();
    
    // Verify we're on step 2
    cy.get('input[name="address"]').should('be.visible');
    
    // Go back to step 1
    cy.contains('button', 'Back').click();
    
    // Verify we're back on step 1
    cy.contains('button', 'Next').should('be.visible');
    
    // Verify the data is preserved
    cy.get('input[name="firstName"]').should('have.value', 'Test');
    cy.get('input[name="lastName"]').should('have.value', 'User');
    cy.get('input[name="email"]').should('have.value', 'test@example.com');
    cy.get('input[name="phoneNumber"]').should('have.value', '+1234567890');
    cy.get('input[name="dateOfBirth"]').should('have.value', '1990-01-01');
  });
  
  it('opens and closes the data privacy agreement modal', () => {
    // Fill out step 1
    cy.get('input[name="firstName"]').type('Test');
    cy.get('input[name="lastName"]').type('User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="phoneNumber"]').type('+1234567890');
    cy.get('input[name="dateOfBirth"]').type('1990-01-01');
    
    // Proceed to step 2
    cy.contains('button', 'Next').click();
    
    // Click the data privacy agreement link
    cy.contains('Data Privacy Agreement').click();
    
    // Verify the modal is displayed
    cy.contains('Data Privacy Agreement for').should('be.visible');
    cy.contains('1. Introduction').should('be.visible');
    cy.contains('2. Collection and Use of Personal Data').should('be.visible');
    
    // Close the modal
    cy.contains('button', 'Close').click();
    
    // Verify the modal is closed
    cy.contains('1. Introduction').should('not.exist');
  });
});
