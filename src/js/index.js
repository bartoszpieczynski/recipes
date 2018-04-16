import Search from "./models/Search";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import { elements, renderLoader, clearLoader } from "./views/base";

// Global state of the app
//  - Search object
//  - Current recipe object
//  - Shopping list object
//  - Liked recipes

//SEARCH

const state = {};

const controlSearch = async () => {
  const query = searchView.getInput();

  //TODO

  if (query) {
    state.search = new Search(query);

    //Prep UI for res
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchResults);

    try {
      //Search for recipes
      await state.search.getResults();

      //Res to UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      alert("Something went wrong with searching :(");
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResultPages.addEventListener("click", e => {
  const button = e.target.closest(".btn-inline");
  if (button) {
    const goToPage = parseInt(button.dataset.go, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

//Recipe
const controlRecipe = async () => {
  const id = window.location.hash.replace("#", "");

  if (id) {
    //Prep UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    //Highlite selected
    if (state.search) searchView.markSelected(id);

    //Create new recipe object
    state.recipe = new Recipe(id);

    try {
      //Get recipe data
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      //Calculate sarvings and time
      state.recipe.calcServings();
      state.recipe.calcTime();
      //Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }
};

["hashchange", "load"].forEach(event =>
  window.addEventListener(event, controlRecipe)
);

//LIST
const controlList = () => {
  if (!state.list) state.list = new List();

  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

elements.shoppingList.addEventListener("click", e => {
  const id = e.target.closest(".shopping__item").dataset.itemid;

  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    state.list.deleteItem(id);

    listView.deleteItem(id);
  } else if (e.target.matches(".shopping__count-value")) {
    const value = parseFloat(e.target.value, 10);
    state.list.updateCount(id, value);
  }
});

//LIKES

//TESTING

const controlLike = () => {
  if (!state.likes) state.likes = new Likes();

  const curId = state.recipe.id;

  if (!state.likes.isLiked(curId)) {
    const newLike = state.likes.addLike(
      curId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );

    likesView.toggleLikeBtn(true);

    likesView.renderLike(newLike);
  } else {
    state.likes.deleteLike(curId);
    likesView.toggleLikeBtn(false);

    likesView.deleteLike(curId);
  }

  likesView.toggleLikeMenu(state.likes.getNumberLikes());
};

//Restore likes on pageload
window.addEventListener("load", () => {
  state.likes = new Likes();
   //Restore likes
  state.likes.retrieveStorageData();
   //Toggle like manu
  likesView.toggleLikeMenu(state.likes.getNumberLikes());

  //Render likes
  state.likes.likes.forEach(like => likesView.renderLike(like));
});

//Recipe buttons
elements.recipe.addEventListener("click", e => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    //Decrease
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    //Increase
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    //Add to list button
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    //Likes
    controlLike();
  }
});


