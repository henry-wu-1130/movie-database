describe('Movie App', () => {
  it('可以搜尋電影並顯示結果', () => {
    cy.visit('/en');
    cy.get('input[role="searchbox"]').type('Inception');
    cy.contains(/View all/i).click();
    cy.url().should('include', '/search');
    cy.get('[data-testid="movie-card"]').should('have.length.greaterThan', 0);
  });

  it('搜尋結果可以無限滾動', () => {
    cy.get('input[role="searchbox"]').type('man');
    cy.contains(/View all/i).click();
    cy.scrollTo('bottom');
    cy.get('[data-testid="movie-card"]').should('have.length.greaterThan', 10);
  });

  it('點擊電影可以看到詳細資訊（含導演、演員、預告片、評論）', () => {
    cy.get('input[role="searchbox"]').type('Inception');
    cy.contains(/View all/i).click();
    cy.get('[data-testid="movie-card"]').first().click();
    cy.url().should('include', '/movie/');
    cy.contains(/導演|Director/i);
    cy.contains(/演員|Cast/i);
    cy.contains(/預告片|Videos/i);
    cy.contains(/評論|Reviews/i);
  });

  it('可以將電影加入待看清單，並於待看清單頁面顯示', () => {
    cy.get('input[role="searchbox"]').type('Inception');
    cy.contains(/View all/i).click();
    cy.get('[data-testid="movie-card"]').first().click();
    cy.get('button')
      .contains(/加入待看清單|Add to Watchlist/i)
      .click();
    cy.get('a')
      .contains(/待看清單|Watchlist/i)
      .click();
    cy.url().should('include', '/watchlist');
    cy.get('[data-testid="movie-card"]').should('contain.text', 'Inception');
  });

  it('待看清單支援排序', () => {
    cy.visit('/watchlist');
    cy.get('[data-testid="sort-dropdown"]').select('release_date');
    // 檢查排序後第一部電影
    cy.get('[data-testid="movie-card"]').first().should('exist');
  });

  it('響應式設計：在手機尺寸下顯示正常', () => {
    cy.viewport('iphone-6');
    cy.get('input[role="searchbox"]').should('be.visible');
    cy.get('[data-testid="header"]').should('be.visible');
  });

  it('API 錯誤時顯示友善錯誤訊息', () => {
    // 模擬 API 錯誤
    cy.intercept('GET', '**/search/movie**', { statusCode: 500 }).as(
      'searchError'
    );
    cy.get('input[role="searchbox"]').type('error');
    cy.contains(/View all/i).click();
    cy.wait('@searchError');
    cy.contains(/錯誤|Error|發生問題/i).should('be.visible');
  });
});
