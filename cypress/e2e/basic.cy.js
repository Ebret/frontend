/// <reference types="cypress" />

describe('Basic Tests', () => {
  it('should load the homepage', () => {
    // Visit the homepage
    cy.visit('/', { failOnStatusCode: false });
    
    // Wait for the page to load
    cy.get('body', { timeout: 10000 }).should('be.visible');
    
    // Take a screenshot
    cy.screenshot('homepage');
  });
  
  it('should have a title', () => {
    // Visit the homepage
    cy.visit('/', { failOnStatusCode: false });
    
    // Check if the page has a title
    cy.title().should('not.be.empty');
  });
});
