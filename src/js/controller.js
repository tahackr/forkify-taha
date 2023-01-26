import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import SearchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC, RESET_FORM_MILISEC } from './config.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// 363b733b-a881-48fe-8e67-ec4ee2128abe   API key

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // Loading recipe
    await model.loadRecipe(id);

    // Rendering recipe
    recipeView.render(model.state.recipe);

    // Rendering pagination
    paginationView.render(model.state.search);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // Get search query
    const query = SearchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    // Load search results
    await model.loadSearchResults(query);

    // Render results
    resultsView.render(model.getSearchResultsPage());

    // Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update servings(in state)
  model.updateServings(newServings);
  // Update recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add or remove bookmark
  model.state.recipe.bookmarked
    ? model.deleteBookmark(model.state.recipe.id)
    : model.addBookmark(model.state.recipe);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Display success message
    addRecipeView.renderMessage();

    // Render bookmark
    bookmarksView.render(model.state.bookmarks);

    // Change ID in the url
    window.history.pushState(null, '', `${model.state.recipe.id}`);

    // Close form
    setTimeout(function () {
      addRecipeView.toggleWindow();
      setTimeout(function () {
        addRecipeView.resetMarkup();
      }, RESET_FORM_MILISEC);
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  SearchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();
