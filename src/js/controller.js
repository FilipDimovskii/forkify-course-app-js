// Importing * (everything) from model.js document as model so we can easily call everything by one variable (model).
import * as model from './model.js';
// Importing value for the setTimeout function.
import { MODAL_CLOSE_SEC } from './config.js';
// Importing the recipeView.js document so we can assign the rendered recipes.
import recipeView from './views/recipeView.js';
// Import searchView.js that contains a class about the search part of the page (button and input field).
import searchView from './views/searchView.js';
// Import resultsView.js that contains a class about the results part of the page.
import resultsView from './views/resultsView.js';
//Import paginationView.js that shows us the reduced results with icons on the left side (10 per page) and it renders markup that shows to us on which page we are (if there are multiple pages).
import paginationView from './views/paginationView.js';
// Import bookmarksView.js that contains a class about the bookmarks part of the page.
import bookmarksView from './views/bookmarksView.js';
// Import addRecipeView.js that contains a class about adding recipes by filling a form inside a modal window.We must import it so that the code that is in the module is actually being run.
import addRecipeView from './views/addRecipeView.js';
// Transpilling and pollyfiling the general code from ES6 to ES5.
import 'core-js/stable';
// Transpilling and pollyfiling the async code from ES6 to ES5.
import 'regenerator-runtime/runtime';

// Parcel
// if (module.hot) {
//   module.hot.accept();
// }

// Selecting the recipe class from the DOM and storing the data.
const recipeContainer = document.querySelector('.recipe');

///////////////////////////////////////

// Showing and controlling different recipes by configuring the ID in the window object
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    // Guard clause if the ID is not correct restart the function.
    if (!id) return;
    // While waiting for the function to start again load the spin animation on the recipeView.
    recipeView.renderSpinner();

    // 0) Update results view to mark (highlight) selected search result.
    resultsView.update(model.getSearchResultsPage());

    // 1) Update the bookmarks view.
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    // Waiting for the promise and consuming it by approaching loadRecipe function in the model.js document (recipe loading depends on the haschange from the ID).
    await model.loadRecipe(id);

    // 3) Rendering recipe
    // Rendering the recipe by approaching the exported data from recipeView class and the render method in it and getting the recipe from the state object.
    recipeView.render(model.state.recipe);
  } catch (error) {
    // Catching the error before returning the guard clause and alerting it to the UI.
    // Finally catching the error we threw manually before (first in the helper.js, after in model.js and now here) for the faulty response and alerting it to the UI.So basically the error was thrown and catched in this principle: helpers.js > model.js > controller.js by the help of the renderError function.
    recipeView.renderError();
  }
};

// Function about controlling the whole search section and rendering the results.

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // Getting the query from the searchView function and assigning it to a constant so that we can re-use it when searching the bar for recipes
    const query = searchView.getQuery();
    // Guard clause (if query cannot be found start the function again(return the function)).
    if (!query) return;
    // Waiting for the API data that contains all recipes to be loaded.
    await model.loadSearchResults(query);
    // Rendering results
    resultsView.render(model.getSearchResultsPage());
    // Render initial pagination buttons.
    paginationView.render(model.state.search);
  } catch (error) {
    // Finally catching the error and displaying it.
    console.log('💣', error);
  }
};

// Function to control and render recipe pages from the search bar (previous,next page).First it reduces the view port of the user (renders only 10 recipes with the getSearchResultPage function from model.js) and after depends of how many pages are there (check data set special class) displays the markup of pages in the controlPagination.js document
const controlPagination = function (goToPage) {
  // Rendering NEW results (on every click there is a different page rendered and the new render method overrides the previous one because of the clear() method).
  resultsView.render(model.getSearchResultsPage(goToPage));
  // Render NEW pagination buttons.
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  recipeView.update(model.state.recipe);
};

// Function about getting information from the model.state.recipe object in the model.js document and updating that recipe as bookmarked.

const controlAddBookmark = function () {
  // If bookmarked key does not exist or if it's value is false then bookmarked = true;
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  // If bookmarked key does exist and the value is true then delete it (set the value to false).
  else model.deleteBookmark(model.state.recipe.id);
  // Update the recipe view.
  recipeView.update(model.state.recipe);
  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

// Re-rendering the bookmarks to avoid a bug between new elements and current elements comparison becase of the local storage bookmarks that need to be displayed on page reload.

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data when it's available (await)
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    // This window method will allow us to change the URL without re-loading the page
    // 3 parameters state,title,the actual URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    // Finally catching the error
    console.error('💣', error);
    // Displaying the custom ui error message.
    addRecipeView.renderError(error.message);
  }
};

// These are subscriber's patterns.
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  // Passing data from controlRecipes function to the addHandlerRender function in recipeView.js
  recipeView.addHandlerRender(controlRecipes);
  // Passing data from controlServings function to the addHandlerUpdateServings function in recipeView.js
  recipeView.addHandlerUpdateServings(controlServings);
  // Passing data from controlSearchResults function to the addHandlerSearch function in searchView.js
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  // Passing data from controlRecipes function to the addHandlerRender function in recipeView.js
  searchView.addHandlerSearch(controlSearchResults);
  // Passing data from controlPagination function to the addHandlerRender function in paginationView.js
  paginationView.addHandlerClick(controlPagination);
  // Passing data from controlAddRecipe function to the addHandlerUpload function in addRecipeView.js
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
