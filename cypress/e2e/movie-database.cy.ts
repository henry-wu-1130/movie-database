describe('Movie Database Application', () => {
  // Suppress React hydration errors in the console during tests
  Cypress.on('uncaught:exception', (err) => {
    // Return false to prevent Cypress from failing the test if there's a hydration error
    if (err.message.includes('Hydration failed')) {
      return false;
    }
    // For other errors, let Cypress handle them normally
    return true;
  });
  beforeEach(() => {
    // Visit the homepage before each test
    cy.visit('http://localhost:3000/en', {
      // Add a small delay to allow hydration to complete
      onBeforeLoad(win) {
        cy.spy(win.console, 'error').as('consoleError');
      },
    });

    // Wait for initial content to load
    // Use a longer timeout to ensure hydration completes
    cy.get('[data-testid="movie-list"]', { timeout: 10000 }).should('exist');
  });

  it('should search for movies and display results', () => {
    // Type a search query using Testing Library's role-based selector
    cy.findByRole('searchbox').type('Avengers');
    cy.findByRole('searchbox').type('{enter}');

    // Verify search results are displayed
    cy.url().should('include', '/en/search');
    cy.url().should('include', 'q=Avengers');
    cy.get('[data-testid="movie-list"]').should('exist');
    cy.get('[data-testid="movie-card"]').should('have.length.at.least', 1);

    // Test infinite scrolling by scrolling down
    cy.get('[data-testid="movie-card"]')
      .its('length')
      .then((initialCount) => {
        cy.scrollTo('bottom');
        cy.wait(1000); // Wait for new items to load
        cy.get('[data-testid="movie-card"]')
          .its('length')
          .should('be.gt', initialCount);
      });
  });

  it('should display movie details when clicking on a movie', () => {
    // Mock API responses for movie details
    cy.intercept('GET', '**/movie/299534?*', {
      fixture: 'movieDetails.json',
    }).as('getMovieDetails');
    cy.intercept('GET', '**/movie/299534/credits?*', {
      fixture: 'movieCredits.json',
    }).as('getMovieCredits');
    cy.intercept('GET', '**/movie/299534/videos?*', {
      fixture: 'movieVideos.json',
    }).as('getMovieVideos');
    cy.intercept('GET', '**/movie/299534/reviews?*', {
      fixture: 'movieReviews.json',
    }).as('getMovieReviews');

    // Intercept the first movie card click to redirect to our mocked movie ID
    cy.intercept('GET', '**/movie/*', (req) => {
      // Modify the URL to use our fixture movie ID
      const url = req.url.replace(/\/movie\/\d+/, '/movie/299534');
      req.url = url;
    }).as('redirectToMockedMovie');

    // Click on a movie card
    cy.get('[data-testid="movie-card"]').first().click();

    // Wait for API requests to complete
    cy.wait('@getMovieDetails');
    cy.wait('@getMovieCredits');
    cy.wait('@getMovieVideos');
    cy.wait('@getMovieReviews');

    // Verify movie details page is displayed
    cy.url().should('include', '/en/movie/');

    // Check if essential movie details are displayed
    cy.get('[data-testid="movie-title"]').should('contain', 'Test Movie');
    cy.get('[data-testid="movie-overview"]').should(
      'contain',
      'This is a test movie overview'
    );

    // Check if cast information is displayed
    cy.get('[data-testid="cast-section"]').should('exist');
    cy.get('[data-testid="cast-member"]').should('have.length.at.least', 1);
    cy.get('[data-testid="cast-section"]').should('contain', 'Actor One');

    // Check if trailer is available
    cy.get('[data-testid="videos-section"]').should('exist');
    cy.get('[data-testid="videos-section"]').should(
      'contain',
      'Official Trailer'
    );

    // Check if reviews are displayed
    cy.get('[data-testid="reviews-section"]').should('exist');
    cy.get('[data-testid="reviews-section"]').should('contain', 'Reviewer One');
  });

  it('should add and remove movies from watchlist', () => {
    // Click on a movie card
    cy.get('[data-testid="movie-card"]').first().click();

    // Get the movie title for later verification
    cy.get('[data-testid="movie-title"]').invoke('text').as('movieTitle');

    // Add movie to watchlist
    cy.get('[data-testid="watchlist-button"]').click();

    // TODO: Add Toast function
    // Verify success message
    // cy.get('[data-testid="toast-message"]').should(
    //   'contain',
    //   'added to watchlist'
    // );

    // Go to watchlist page
    cy.get('[data-testid="watchlist-link"]').click();

    // Verify movie is in watchlist
    cy.get('@movieTitle').then((movieTitle) => {
      cy.get('[data-testid="movie-card"]').should('contain', movieTitle);
    });

    // Hover over the movie card to show the three-dot menu
    cy.get('[data-testid="movie-menu-button"]').first().trigger('mouseover');

    // Click the three-dot menu button using the data-testid we added
    cy.get('[data-testid="movie-menu-button"]').first().click({ force: true });

    // Now click the watchlist button in the popover
    cy.get('[data-testid="watchlist-button"]').click();

    // TODO: Add Toast function
    // Verify success message
    // cy.get('[data-testid="toast-message"]').should(
    //   'contain',
    //   'removed from watchlist'
    // );

    // Verify movie is removed from watchlist by checking for empty watchlist message
    // Since we only added one movie, the watchlist should now be empty
    cy.get('[data-testid="empty-watchlist"]').should('exist');
  });

  it('should sort movies in watchlist', () => {
    // Add first movie to watchlist
    cy.visit('/');
    cy.get('[data-testid="movie-card"]').first().click();
    cy.get('[data-testid="movie-title"]').invoke('text').as('firstMovieTitle');
    cy.get('[data-testid="watchlist-button"]').click();
    cy.go('back');

    // Add second movie to watchlist
    cy.get('[data-testid="movie-card"]').eq(1).click();
    cy.get('[data-testid="movie-title"]').invoke('text').as('secondMovieTitle');
    cy.get('[data-testid="watchlist-button"]').click();

    // Go to watchlist page
    cy.get('[data-testid="watchlist-link"]').click();

    // Verify we have two movies in watchlist
    cy.get('[data-testid="movie-card"]').should('have.length', 2);

    // Sort by title (ascending)
    cy.get('select').select('original_title.asc');

    // Get movie titles after sorting
    cy.get('[data-testid="movie-title"]').then(($titles) => {
      const titles = $titles.map((i, el) => Cypress.$(el).text()).get();
      const sortedTitles = [...titles].sort();

      // Verify movies are sorted by title ascending
      expect(titles[0]).to.equal(sortedTitles[0]);
      expect(titles[1]).to.equal(sortedTitles[1]);
    });

    // Sort by title (descending)
    cy.get('select').select('original_title.desc');

    // Get movie titles after sorting
    cy.get('[data-testid="movie-title"]').then(($titles) => {
      const titles = $titles.map((i, el) => Cypress.$(el).text()).get();
      const sortedTitles = [...titles].sort().reverse();

      // Verify movies are sorted by title descending
      expect(titles[0]).to.equal(sortedTitles[0]);
      expect(titles[1]).to.equal(sortedTitles[1]);
    });
  });

  // it('should be responsive across different screen sizes', () => {
  //   // Test on mobile viewport
  //   cy.viewport('iphone-x');
  //   cy.reload();

  //   // Check for mobile layout elements
  //   cy.get('header').should('exist');

  //   // Test on tablet viewport
  //   cy.viewport('ipad-2');
  //   cy.reload();

  //   // Check for tablet layout elements
  //   cy.get('header').should('exist');

  //   // Test on desktop viewport
  //   cy.viewport(1920, 1080);
  //   cy.reload();

  //   // Check for desktop layout elements
  //   cy.get('header').should('exist');
  // });

  // it('should handle API errors gracefully', () => {
  //   // Intercept API requests and force them to fail
  //   cy.intercept('GET', '**/movie/popular**', {
  //     statusCode: 500,
  //     body: { success: false },
  //   }).as('apiError');

  //   // Visit the home page to trigger the intercepted request
  //   cy.visit('/');

  //   // Wait for the API request to complete
  //   cy.wait('@apiError');

  //   // Verify error message is displayed
  //   cy.contains(/error|failed/i).should('be.visible');

  //   // Test retry functionality by allowing the next request to succeed
  //   cy.intercept('GET', '**/movie/popular**', {
  //     statusCode: 200,
  //     fixture: 'popularMovies.json',
  //   }).as('retrySuccess');

  //   // Find and click any retry button or action
  //   cy.get('button')
  //     .contains(/retry|try again/i)
  //     .click();

  //   // Wait for the successful API request
  //   cy.wait('@retrySuccess');

  //   // Verify content is displayed
  //   cy.get('[data-testid="movie-card"]').should('exist');
  // });

  // it('should handle empty search results gracefully', () => {
  //   // Intercept search API and return empty results
  //   cy.intercept('GET', '**/search/movie**', {
  //     statusCode: 200,
  //     body: {
  //       results: [],
  //       page: 1,
  //       total_pages: 0,
  //       total_results: 0,
  //     },
  //   }).as('emptySearch');

  //   // Visit the home page
  //   cy.visit('/');

  //   // Perform search using the searchbox role
  //   cy.findByRole('searchbox').type('NonExistentMovieXYZ123{enter}');

  //   // Wait for search to complete
  //   cy.wait('@emptySearch');

  //   // Verify we're on the search page
  //   cy.url().should('include', '/search');

  //   // Verify empty state is displayed - no movie cards
  //   cy.get('[data-testid="movie-card"]').should('not.exist');

  //   // Should show some kind of no results message
  //   cy.contains(/no results|not found|no movies/i).should('be.visible');
  // });
});
