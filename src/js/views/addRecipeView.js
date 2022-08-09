import icons from 'url:../../img/icons.svg'; //Parcel
import View from './View';

class addRecipeView extends View {
  // Setting the parent element.
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded 🔼';
  // Selecting child elements from HTML.
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  // Adding a constructor for this class because we want the function to be used on addRecipeClass only
  constructor() {
    // Because this is a child class we are binding the this keyword to this class only by calling super()
    super();
    // Making these methods protected by adding underscore sign "_" because it will be used inside of this class only, and also calling them.
    this._addHandlerShowWindow();
    this._addHandlerCloseWindow();
  }

  // Method that adds or removes the "hidden" class and bounds this keyword to the child elements.The add/remove functionality depends if the "hidden" class is active or not at the point we click on the button (addHandlerShowWindow function).

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    // The first "this" keyword points to the btnOpen button, for the second one we need to manually bind the "this" keyword to point to the toggleWindow function and the classes that are inside of it.
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerCloseWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    // Getting data for the upload button from the _parentElement which is ".upload".
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      //Getting the data from the FormData browser API (the data we filled in the form) making it to be received in a array and after that destructuring it into arrays of multiple entries (first one is name of the field (key) and second one is the value of the form).
      const dataArr = [...new FormData(this)];
      // Takes an array of entries and converts it to an object.
      const data = Object.fromEntries(dataArr);
      //This handler parameter will do whatever is inside the controlAddRecipe function (get's the data from controller.js)
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new addRecipeView();
