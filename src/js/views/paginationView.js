import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.getAttribute('data--goto');

      handler(goToPage);
    });
  }

  _generateMarkupButton(direction = 'left') {
    const curPage = this._data.page;
    return `
    <button data--goto="${
      direction === 'left' ? curPage - 1 : curPage + 1
    }" class="btn--inline pagination__btn--${
      direction === 'left' ? 'prev' : 'next'
    }">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-${
      direction === 'left' ? direction : 'right'
    }"></use>
      </svg>
      <span>Page ${direction === 'left' ? curPage - 1 : curPage + 1}</span>
    </button>
    `;
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );

    // Page 1 and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupButton('right');
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupButton('left');
    }

    // Other page
    if (curPage < numPages) {
      return `
      <div class="pagination">
        ${this._generateMarkupButton('left')} 
        ${this._generateMarkupButton('right')}
      </div>
      `;
    }

    // Page 1 and no other pages
    return '';
  }
}

export default new PaginationView();
