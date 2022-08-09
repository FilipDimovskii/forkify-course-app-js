import icons from 'url:../../img/icons.svg'; //Parcel
import View from './View';

class paginationView extends View {
  _parentElement = document.querySelector('.pagination');
  // Getting data from the controlPagination function as a parameter named ("handler") because paginationView.js shouldn't even know that controller.js exists (MVC Architecture).So basically controlPagination === handler.
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      // Looks UP in the DOM Tree so it can select the parent element (closest method is great to avoid adding multiple addEventListener's if both or more targets are in the same class).
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;
      // Creating special class (data)
      // The dataset read-only property of the HTMLElement interface provides read/write access to custom data attributes (data-*) on elements. It exposes a map of strings (DOMStringMap) with an entry for each data-* attribute.
      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }
  // Generating the actual markup (Getting the data from model.js document stored in the state object from the already resolved promise and the already rendered data with the render function (from the already extended class View.js), by using the this keyword so the markup can access every recipe).
  _generateMarkup() {
    const curPage = this._data.page;
    // How many pages are there?
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
    }
    // Last Page
    if (curPage === numPages && numPages > 1) {
      return `
      <button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
      `;
    }
    // Other page
    if (curPage < numPages) {
      return `
            <button data-goto="${
              curPage - 1
            }" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage - 1}</span>
                </button>
                
            <button data-goto="${
              curPage + 1
            }" class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
      `;
    }
    // Page 1, and there are NO other pages
    return '';
  }
}

export default new paginationView();
