/// <reference types="cypress" />

/* context('Navigate to App, Define A Flag', () => {
  beforeEach(() => {
    cy.visit('https://localhost:8443/feature-flag-admin')
  });

  // https://on.cypress.io/interacting-with-elements

  it('Navigate to flags of the first App', () => {

    // TODO need to use following sibling instead //a/bb[text()="zz"]/following-sibling::cc[1]/text()

    cy.intercept({
      method: 'POST',
      url: '/usersettings/api/v1/admin/featureFlagDefinition',
    }, { fixture: 'feagure-flag-definition/feagure-flag.json' });

    cy.intercept(
      {
        method: 'GET',
        url: '/usersettings/api/v1/admin/featureFlagDefinition/app/AuthService'
      }, 
      {
        body: []
      }
    );
    cy.xpath("//div[@row-index='0']/div[@role='gridcell']/scc-action-cell[@class='ng-star-inserted']/a[@class='ag-action-link ng-star-inserted']").click();

    // Open the new flag ui
    cy.xpath("//button[@class='mat-focus-indicator mat-raised-button mat-button-base mat-primary ng-star-inserted']/span[text()=' + Create Flag ']").click();

    // Enter the name of the flag
    cy.xpath("//input[@formcontrolname='name']").type("Cypress Test Flag");

    cy.xpath("//input[@formcontrolname='flagCode']").type("cypress test flag");

    //description
    cy.xpath("//textarea[@formcontrolname='description']").type("This is for unit testing");

    // message
    cy.xpath("//textarea[@formcontrolname='message']").type("GME TO THE MOON");

    //pmAlias
    cy.xpath("//input[@formcontrolname='pmAlias']").type("kagoksal@microsoft.com");
    
    cy.xpath("//button/span[text()=' Save ']").click();

  })
}) */

context('POST Request Success, grid renders', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: '/usersettings/api/v1/admin/featureFlagDefinition/app/AuthService',
        times: 1
      }, 
      {
        body: [{"id":"8ce28b4e-afef-461d-bff3-f4e7c193e64b","flagCode":"cypress-test-flag","environment":"int","appCode":"AuthService","name":"Cypress Test Flag","description":"This is for unit testing","pmAlias":"kagoksal@microsoft.com","message":"GME TO THE MOON","expirationDate":"2021-03-04T20:15:53.641Z","expirationValue":false,"expires":false}]
      }
    );

    cy.visit('https://localhost:8443/feature-flag-admin/app/AuthService')
  });

  it('Find the new flag on the grid', () => {

    cy.xpath("//div[text()='Cypress Test Flag']").should('exist');

  })
})
