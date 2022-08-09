import icons from 'url:../../img/icons.svg'; //Parcel
import View from './View';
import preview from './preview.js';
// Class about rendering the results to the page after a search has been done.
class bookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  // Error message
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it.';
  // Positive message
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  // Generating the actual markup (Getting the data from model.js document stored in the state object from the already resolved promise and the already rendered data with the render function (from the already extended class View.js), by using the this keyword so the markup can access every recipe (data)).Also this markup creates a new array with MAP method so it can display the bookmarks with icons and mini text on the bookmarks button of the page.
  _generateMarkup() {
    // Rendering a preview for each of the bookmarks
    return this._data.map(bookmark => preview.render(bookmark, false)).join('');
  }
}

export default new bookmarksView();
