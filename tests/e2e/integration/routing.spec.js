/// <reference types="cypress" />

context('Automatic routing', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Jump Recommend', () => {
    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/music/recommend')
    })
  })
})
