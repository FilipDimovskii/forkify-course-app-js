// importing functions and constants from other documents so we don't hardcode everything.
import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

// Storing the destructured data (recipe) from the Promise with all of the new values for id,title,publisher etc.
export const state = {
  recipe: {},
  // The new mapped object from loadSearchResults containing the search API data
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  // Changing the values from the data API and storing them to a new object called state.
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    //If the recipe.key exists then return the object, spread it afterwards so we get the value of key which is recipe.key.Conditionally adds properties to an object!!!
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    // Awaiting the Promise, once is available store the resolved promise to the data variable.
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    // Store that data in to the createRecipeObject function that receives that data as a parameter and afterwards set the value of the function to be the same as state.recipe object.
    state.recipe = createRecipeObject(data);
    // When the page loads and we get the data from the API, if there is any bookmark which has the bookmark ID equal to the received id then bookmark the current recipe (bookmark = true) else set the value to false (not bookmarked)
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    // Checking if the key and values of the API object data and our data corresponds (if state.recipe === data.recipe).
    console.log(state.recipe);
  } catch (error) {
    // Temporary error handling.
    // Catching the error we threw manually beforein the helpers.js file for the faulty response and alerting it to the UI, then throwing it again so it displays the console.error from the controller.js
    console.error(`${error} !!!`);
    throw error;
  }
};

// Getting all of the recipe data that can be searched later on through the search field by q auery

export const loadSearchResults = async function (query) {
  try {
    // Assigning the query from state to just query
    state.search.query = query;
    // Awaiting the Promise, once is available store the resolved promise to the data variable.
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    // Creating a new array with map and assigning that data to the state object variable.
    state.search.results = data.data.recipes.map(rec => {
      return {
        // Changing the values from the data API and returning them to a new sub-object called search (in state).
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        //If the recipe.key exists then return the object, spread it afterwards so we get the value of key which is recipe.key.Conditionally adds properties to an object!!!
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
    console.log(state.search.results);
  } catch (error) {
    // Catching the error we threw manually before (from helpers.js) for the faulty response and alerting it to the UI, then throwing it again so it displays the error from controller.js
    console.error(`${error} !!!`);
    throw error;
  }
};
// Exporting a function that reduces the view from the recipes that we searched to 10 by page (default page is set to 1)
export const getSearchResultsPage = function (page = state.search.page) {
  // state.search.page get's updated everytime there's a click on the page's markup (prev,next page).
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; //0;
  const end = page * state.search.resultsPerPage; //9;

  return state.search.results.slice(start, end);
};

// Updating the servings
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // new quantity = old quantity * newServings / oldServings // 2 * 8 / 4 = 4
  });

  state.recipe.servings = newServings;
};

// Setting an item (object) in the local storage or web storage as a string.

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// Exporting a function to the controller.js document so when every time a recipe get's clicked for a bookmark it get's pushed into the empty bookmarks array and if the recipe id and the id of the state.recipe.id are the same it will add a parameter into the state.recipe object called bookmarked with the value of true.
export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

// Exporting a function to the controller.js document so when every time a recipe get's clicked for a undo-bookmark it get's removed from the bookmarks array and if the id of that exact element and the id of the state.recipe.id are the same it will add a parameter into the state.recipe object called bookmarked with the value of false.
export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

// Initialization function to get the items (bookmarks) that are stored in the localStorage and then converting them to an object.If there is a storage then that object from the localStorage becomes the state.bookmarks object.

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

// If needed to clear all bookmarks at once on page reload this function helps.

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

// Async function that get's exported (so than it can be used in other js files) which basically gets the newRecipe parameter and from that uploaded recipe it get's the entries (key,value) then for each of the entry key that starts with "ingredient" in the name (key = entry[0]) and for each of the value entry (value = entry[1]) that is not an empty string, create a new array with MAP method.Now that we have the ingredients from each of the ing get the quantity,unit,description parameters (values) and destructure them delete all white spaces in between, split the ing by "," separator and return the result as an object (converted) and store the results in the ingredients variable.
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // Storing the ingredients array
        const ingArr = ing[1].split(',').map(el => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        // If the number of the entered ingredients is different than 3, then throw a manual error. Basically if the ingredients are not containing the destructured format of ingredients [quantity, unit, description].
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format.'
          );
        const [quantity, unit, description] = ingArr;
        // Ternary operator
        // If there is a quantity convert it to a number else display "null".
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    // This object will be the oposite of the state.recipe object (converting the format of the parameters back to the original ones so the API can recognize).
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe);
    // Send the JSON data (newRecipe object) with the URL and the KEY as an parameters and await for server return.
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    // Store that data in to the createRecipeObject function that receives that data as a parameter and afterwards set the value of the function to be the same as state.recipe object.
    state.recipe = createRecipeObject(data);
    // Add the bookmark key to the object.
    addBookmark(state.recipe);
  } catch (error) {
    // Catch the error that we created manually and then re-throw it again in the controller.js
    throw error;
  }
};
