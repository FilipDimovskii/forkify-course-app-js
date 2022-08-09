// Class about the search part of the page (button and input field).
class SearchView {
  // Re-assigning the recipeContainer into an private field.
  _parentEl = document.querySelector('.search');
  // Getting query data from parentEl('.search') > search_field and reading it's value (returning the results). This is the input we type in the search bar.
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }
  // Private field method to clear the search bar after we search for a query.
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }
  // Listening the event and passing it to the controller through ('handler') parameter data. This is Publisher.
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

// Default export (meaning the function is not attached to a const or variable).
export default new SearchView();
