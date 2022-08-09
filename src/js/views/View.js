import icons from 'url:../../img/icons.svg'; //Parcel
// Parent class of all child view classes (recipeView,searchView,resultsView)
export default class View {
  // Making the data protected field.
  _data;
  // Method that get's all of the data as parameter and renders that data to the UI.
  render(data, render = true) {
    // If there is no data to be displayed or if there is data but that data is an array and it's empty return renderError message.
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    // Binding data to this keyword so it can be used by every other instance of RecipeView Class.
    this._data = data;
    // Storing the protected field function into a variable
    const markup = this._generateMarkup();

    if (!render) return markup;
    this._clear();
    // Inserting the HTML created down below from as a child of the ".recipe" (parent) class.
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    // Binding data to this keyword so it can be used by every other instance of RecipeView Class.
    this._data = data;
    // Storing the protected field function into a variable
    const newMarkup = this._generateMarkup();
    // Big object (virtual DOM or a copy of the real DOM), these methods will convert the actual markup string that's inserted into HTML into real DOM Node objects (Node List).
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // Selecting every element from the Virtual DOM, converting them to an array and storing them into a variable.
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // Selecting every element from the original, current DOM, converting them to an array and storing them into a variable.
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // For each of the newElements node list and for every index of the Virtual DOM and current DOM (_parentElement) make a check if there are any differences (there are differences in the virtual DOM because it get's updated every time we click on the update--servings button).
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // If the nodes from the newEl and curEl are not equal, and the firstChild text value in the newEl is not empty then trim the white spaces and change the textContent of the curEl with the updated text content from the newEl.
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      // If the nodes from the newEl and curEl are not equal,change the attributes property of the curEl with the updated attributes property from the newEl.
      if (!newEl.isEqualNode(curEl))
        // Converting the attributes (name:"class" and value"data- update-to) to an array and looping over it so each of the attributes from the newEl overwrite the attributes from the curEl.
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  //   Function created to clear previous HTML in the ".recipe class" so for example a new recipe can be rendered from start.
  _clear() {
    this._parentElement.innerHTML = '';
  }
  // loading recipe icon that spins upon rendering the data
  renderSpinner() {
    const markup = `
    <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  // Instead of hard-codding errors this function will implement a new error message from with different icon and text dependent on the error (by using template literals in the HTML file and then inserting it.)
  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>;
    `;
    //   Function created to clear previous HTML in the ".recipe class" so for example a new recipe can be rendered from start.
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  // Positive message that get's rendered on every searched recipe.
  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>;
    `;
    //   Function created to clear previous HTML in the ".recipe class" so for example a new recipe can be rendered from start.
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
