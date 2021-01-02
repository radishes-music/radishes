/// <reference types="cypress" />

context('News Music Basic', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Automatically jump to the recommended page when music is found', () => {
    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/music/recommend')
    })
  })

  it('Discover music secondary routing test', () => {
    cy.get('.secondary-bar-link:nth-child(2)').click()
    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/music/songlist')
      expect(loc.search).to.have.string('tag=all')
    })

    cy.get('.secondary-bar-link:nth-child(3)').click()
    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/music/toplist')
    })

    cy.get('.secondary-bar-link:nth-child(4)').click()
    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/music/artists')
    })
  })

  it('Jump to playlist', () => {
    cy.get('.song-list-container:nth-child(2)').click()
    cy.location().should(loc => {
      expect(loc.pathname).to.have.string('/list/song/')
    })
    cy.get('.bg-img img')
      .invoke('attr', 'src')
      .then(src => {
        expect(src).to.have.string('126.net')
      })
    // Determine whether there are songs in the playlist
    cy.get('.ant-table-tbody')
      .children()
      .should('have.length.greaterThan', 0)
  })

  it('Fine playlist filtering', () => {
    cy.visit('/music/songlist?tag=all')
    cy.get('.song-list')
      .children()
      .should('have.length.greaterThan', 0)

    cy.get('.find-music-songlist--hot ul li:first-child').click()
    cy.get('.song-list ul')
      .children()
      .should('have.length.greaterThan', 0)
    cy.contains('.active-tag', '华语')
  })

  it('Singer filter', () => {
    cy.visit('/music/artists')
    cy.get('.artists-content ul')
      .children()
      .should('have.length.greaterThan', 0)

    cy.contains('.filter-active', '全部')
    cy.get('.filter-group:first-child li:nth-child(2)').click()
    cy.get('.artists-content ul')
      .children()
      .should('have.length.greaterThan', 0)

    cy.get('.filter-group:last-child li:nth-child(2)').click()
    cy.contains('.filter-group:last-child .filter-active', 'A')
    cy.get('.artists-content ul')
      .children()
      .should('have.length.greaterThan', 0)
  })

  it('Singer details', () => {
    cy.visit('/music/artists')

    cy.get('.artists-content li:first-child').click()
    cy.location().should(loc => {
      expect(loc.pathname).to.match(/artist\/\d+\/album/)
    })

    cy.contains('.secondary-bar-link-active', '专辑')
  })

  // it('Double click to play the song', () => {
  //   cy.visit('/music/toplist')

  //   // https://github.com/cypress-io/cypress/issues/14269
  //   // Found it is a cache problem
  //   // Solution: Use a timestamp to ensure that the URL cannot hit the browser cache
  //   cy.intercept(/\/api\/song\/url/).as('getUrl')
  //   cy.intercept(/\/api\/song\/detail/).as('getDetail')
  //   cy.intercept(/\/api\/lyric/).as('getLyric')
  //   cy.get(
  //     '.toplist-expansion-contanier:first-child .none-select:first-child'
  //   ).dblclick()

  //   cy.wait(['@getUrl', '@getDetail', '@getLyric'], {
  //     requestTimeout: 20 * 1000
  //   }).then(() => {
  //     // Possibly due to insufficient performance in the ci automatic test
  //     cy.wait(1000).then(() => {
  //       cy.get('source')
  //         .invoke('attr', 'src')
  //         .then(src => {
  //           expect(src).to.have.string('.mp3')
  //         })

  //       // pause music
  //       cy.get('.music-command-group button:nth-child(3)').click()
  //     })
  //   })
  // })
})
