describe('Cypress Simulator', () => {
  beforeEach(() => {
    cy.visit('./src/index.html?skipCaptcha=true', {
      onBeforeLoad(win) {win.localStorage.setItem('cookieConsent', 'accepted')}
    })
    cy.contains('button', 'Login').click();
  })

  it('Successfully simulates a Cypress command', () => {
    cy.get('#codeInput').type('cy.log("Yay!")');
    cy.contains('button', 'Run').should('be.visible').click();
    cy.get('#outputArea', { timeout: 6000 }).should('contain', 'Success:').and('contain', 'cy.log("Yay!") // Logged message "Yay!"').and('be.visible');
  })

  it('Shows an error when entering and running an invalid Cypress command', () => {
    cy.get('#codeInput').type('cylog"error")');
    cy.contains('button', 'Run').should('be.visible').click();
    cy.get('#outputArea', { timeout: 6000 }).should('contain', 'Error:').and('contain', 'Invalid Cypress command: cylog"error"').and('be.visible');
  })

  it('Shows a warning when entering and running a not-implemented Cypress command', () => {
    cy.get('#codeInput').type('cy.contains("Login"))');
    cy.contains('button', 'Run').should('be.visible').click();
    cy.get('#outputArea', { timeout: 6000 }).should('contain', 'Warning:').and('contain', 'The `cy.contains` command has not been implemented yet.');
  })

  it('Shows an error when entering and running a valid Cypress command without parentheses', () => {
    cy.get('#codeInput').type('cy.visit');
    cy.contains('button', 'Run').should('be.visible').click();
    cy.get('#outputArea', { timeout: 6000 }).should('contain', 'Error:').and('contain', 'Missing parentheses on `cy.visit` command');
  })

  it('Asks for help and gets common Cypress commands and examples with a link to the docs', () => {
    cy.get('#codeInput').type('help');
    cy.contains('button', 'Run').should('be.visible').click();
    cy.get('#outputArea', { timeout: 6000 }).should('contain', 'Common Cypress commands and examples:').and('contain', 'For more commands and details, visit the official Cypress API documentation.').and('be.visible');
    cy.contains('#outputArea a', 'official Cypress API documentation').should('have.attr', 'href', 'https://docs.cypress.io/api/table-of-contents').and('have.attr', 'target', '_blank').and('be.visible');
  })

  it('Maximizes and minimizes a simulation result', () => {
    cy.get('#codeInput').type('cy.log("Yay!")');
    cy.contains('button', 'Run').should('be.visible').click();
    cy.get('.expand-collapse').should('be.visible').click();
    cy.get('#outputArea', { timeout: 6000 }).should('contain', 'Success:').and('contain', 'cy.log("Yay!") // Logged message "Yay!"').and('be.visible');
    cy.get('#collapseIcon').should('be.visible');
    cy.get('.expand-collapse').should('be.visible').click();
    cy.get('#expandIcon').should('be.visible');
  })

  it('Logs out successfully', () => {
    cy.get('#sandwich-menu').should('be.visible').click();
    cy.get('#logoutButton').should('be.visible').click();
    cy.contains('h2', "Let's get started!").should('be.visible');
    cy.contains('button', 'Login').should('be.visible');
    cy.get('#sandwich-menu').should('not.be.visible');
  })

  it('Shows and hides the logout button', () => {
    cy.get('#sandwich-menu').should('be.visible').click();
    cy.contains('button', 'Logout').should('be.visible');
    cy.get('#sandwich-menu').should('be.visible').click();
    cy.contains('button', 'Logout').should('not.be.visible');
  })

  it('Shows the running state before showing the final result', () => {
    cy.get('#runButton').should('be.disabled');
    cy.get('#codeInput').type('cy.log("Test Running")');
    cy.get('#runButton').should('be.enabled').click();
    cy.contains('button', 'Running...').should('be.visible');
    cy.get('#outputArea').should('contain', 'Running... Please wait.').and('be.visible');
    cy.contains('button', 'Running...', { timeout: 6000 }).should('not.exist');
    cy.contains('button', 'Run').should('be.visible');
    cy.contains('#outputArea', 'Running... Please wait.', { timeout:6000 }).should('not.exist');
  })

  it('Checks the run button disabled and enabled states', () => {
    cy.contains('button', 'Run').should('be.visible').and('be.disabled');
    cy.get('#codeInput').type('run button test');
    cy.contains('button', 'Run').should('be.visible').and('be.enabled');
    cy.get('#codeInput').clear();
    cy.contains('button', 'Run').should('be.visible').and('be.disabled');
  })

  it('Clears the code input when logging off then logging in again', () => {
    cy.get('#codeInput').should('be.visible').type('cy.log("André")');
    cy.get('#sandwich-menu').should('be.visible').click();
    cy.contains('button', 'Logout').should('be.visible').click();
    cy.contains('button', 'Login').should('be.visible').click();
    cy.get('#codeInput').should('be.visible').and('have.value', '');
  })

  it('Disables the run button when logging off then logging in again', () => {
    cy.contains('button', 'Run').should('be.visible').and('be.disabled');
    cy.get('#codeInput').should('be.visible').type('cy.log("Test")');
    cy.contains('button', 'Run').should('be.visible').and('be.enabled');
    cy.get('#sandwich-menu').should('be.visible').click();
    cy.contains('button', 'Logout').should('be.visible').click();
    cy.contains('button', 'Login').should('be.visible').click();
    cy.contains('button', 'Run').should('be.visible').and('be.disabled');
  })

  it('Clears the code output when logging off then logging in again', () => {
    cy.get('#codeInput').should('be.visible').type('cy.log("Output Test")');
    cy.contains('button', 'Run').should('be.visible').click()
    cy.get('#outputArea', { timeout: 6000 }).should('contain', 'Success:').and('contain', 'cy.log("Output Test") // Logged message "Output Test"').and('be.visible');
    cy.get('#sandwich-menu').click();
    cy.contains('button', 'Logout').should('be.visible').click();
    cy.contains('button', 'Login').should('be.visible').click();
    cy.get('#outputArea').should('be.visible').and('have.value', '');
  })

  it("Doesn't show the cookie consent banner on the login page", () => {
    cy.clearAllLocalStorage();
    cy.reload();
    cy.contains('button', 'Login').should('be.visible');
    cy.get('#cookieConsent').should('not.be.visible');
  })
})

describe('Cypress Simulator - Cookies Consent', () => {
  beforeEach(() => {
    cy.visit('./src/index.html?skipCaptcha=true');
    cy.contains('button', 'Login').click();
  })
  it('Consents on the cookies usage', () => {
    cy.get('#cookieConsent').as('cookieConsentBanner').should('be.visible').find("button:contains('Accept')").should('be.visible').click();
    cy.get('@cookieConsentBanner').should('not.be.visible');
    cy.window().its('localStorage.cookieConsent').should('be.equal', 'accepted');
  })

  it('Declines on the cookies usage', () => {
    cy.get('#cookieConsent').as('cookieConsentBanner').should('be.visible').find("button:contains('Decline')").should('be.visible').click();
    cy.get('@cookieConsentBanner').should('not.be.visible');
    cy.window().its('localStorage.cookieConsent').should('be.equal', 'declined');
  })
})

describe('Cypress Simulator - Captcha', () => {
  beforeEach(() => {
    cy.visit('./src/index.html');
    cy.contains('button', 'Login').click();
  })
  it("Disables the captcha verify button when no answer is provided or it's cleared", () => {
    cy.contains('button', 'Verify').should('be.disabled');
    cy.get('input[placeholder="Enter your answer"]').type('1');
    cy.contains('button', 'Verify').should('be.enabled');
    cy.get('input[placeholder="Enter your answer"]').clear();
    cy.contains('button', 'Verify').should('be.disabled');
  })

  it('Shows an error on a wrong captcha answer and goes back to its initial state', () => {
    cy.get('input[placeholder="Enter your answer"]').type('1000');
    cy.contains('button', 'Verify').should('be.visible').and('be.enabled').click();
    cy.contains('.error', 'Incorrect answer, please try again.').should('be.visible');
    cy.get('input[placeholder="Enter your answer"]').should('have.value', '');
    cy.contains('button', 'Verify').should('be.visible').and('be.disabled');
  })
})