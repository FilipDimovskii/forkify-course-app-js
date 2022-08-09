import icons from 'url:../../img/icons.svg'; //Parcel
import View from './View';
import preview from './preview.js';
// Class about rendering the results to the page after a search has been done.
class resultsView extends View {
  _parentElement = document.querySelector('.results');
  // Error message
  _errorMessage = 'No recipes found for your query! Please try again.';
  // Positive message
  _message = '';
  // Generating the actual markup (Getting the data from model.js document stored in the state object from the already resolved promise and the already rendered data with the render function (from the already extended class View.js), by using the this keyword so the markup can access every recipe).Also this markup creates a new array with MAP method so it can display the results with icons and mini text on the left margin of the page.
  _generateMarkup() {
    // Rendering a preview for each of the results
    return this._data.map(result => preview.render(result, false)).join('');
  }
}

export default new resultsView();
