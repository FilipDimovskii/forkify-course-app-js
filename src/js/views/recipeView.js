// Importing View class (parent class of all views)
import View from './View.js';
// Importing the icons
import icons from 'url:../../img/icons.svg'; //Parcel
// Importing NPM fractional package
import fracty from 'fracty';
// Importing the state object from model (every API data is stored into this object)
import { state } from '../model';

// Class about viewing the recipe.
class RecipeView extends View {
  // Re-assigning the recipeContainer into an protected field.
  _parentElement = document.querySelector('.recipe');
  // Protected field error message that we can pass in to different errors later.
  _errorMessage = 'We could not find that recipe. Please try another one!';
  _message = '';

  // Getting data from the controlRecipes function as a parameter named ("handler") because recipeView.js shouldn't even know that controller.js exists (MVC Architecture).So basically controlRecipes === handler.
  addHandlerRender(handler) {
    // Attaching event listener for each of the events to the window object to show the recipe upon loading or re-loading the page depending on the haschange from the id.
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }
  // Getting data from the controlServings function as a parameter named ("handler") because recipeView.js shouldn't even know that controller.js exists (MVC Architecture).So basically controlServings === handler.
  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      // Looks UP in the DOM Tree so it can select the parent element (closest method is great to avoid adding multiple addEventListener's if both or more targets are in the same class).
      const btn = e.target.closest('.btn--update-servings');

      if (!btn) return;

      // Creating special class (data)
      // The dataset read-only property of the HTMLElement interface provides read/write access to custom data attributes (data-*) on elements. It exposes a map of strings (DOMStringMap) with an entry for each data-* attribute.
      const { updateTo } = btn.dataset;

      if (+updateTo > 0) handler(+updateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  // Generating the actual markup (Getting the data from model.js document stored in the state object from the already resolved promise and the already rendered data with the render function (from the already extended class View.js), by using the this keyword so the markup can access every recipe).
  _generateMarkup() {
    return `
    <figure class="recipe__fig">
          <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings - 1
              }">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings"data-update-to="${
                this._data.servings + 1
              }">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
           <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">

          
            ${this._data.ingredients
              .map(this._generateMarkupIngredient)
              .join('')}
            

            <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">0.5</div>
              <div class="recipe__description">
                <span class="recipe__unit">cup</span>
                ricotta cheese
              </div>
            </li>
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this._data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
        
    `;
  }
  // Recipe ingredients section
  _generateMarkupIngredient(ing) {
    return `
      <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${icons}#icon-check"></use>
        </svg>
      <div class="recipe__quantity">${
        ing.quantity ? new fracty(ing.quantity).toString() : ''
      }</div>
      <div class="recipe__description">
        <span class="recipe__unit">${ing.unit}</span>
        ${ing.description}
      </div>
    </li>
      `;
  }
}

// Default export (meaning the function is not attached to a const or variable).
export default new RecipeView();
