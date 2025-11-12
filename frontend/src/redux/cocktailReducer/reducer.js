import {
  ADDRECIPE_ERROR,
  ADDRECIPE_LOADING,
  ADDRECIPE_SUCCESS,
  GETRECIPE_ERROR,
  GETRECIPE_LOADING,
  GETRECIPE_SUCCESS,
  GET_FEED_ERROR,
  GET_FEED_LOADING,
  GET_FEED_SUCCESS,
  UPDATE_RECIPE_SUCCESS,
} from "../recipeReducer/actionTypes";

// Nota: Por ahora reutilizamos los mismos tipos de acción.
// En la migración se reemplazarán por tipos específicos de cocktail.

const initState = {
  isLoading: false,
  isError: false,
  cocktails: [], // antes recipes
  friendCocktails: [], // antes friendRecipes
  feed: [],
};

export const reducer = (state = initState, action) => {
  switch (action.type) {
    case ADDRECIPE_ERROR:
      return { ...state, isLoading: false, isError: true };
    case ADDRECIPE_LOADING:
      return { ...state, isLoading: true, isError: false };
    case ADDRECIPE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        cocktails: [...state.cocktails, action.payload],
      };
    case GET_FEED_ERROR:
      return { ...state, isLoading: false, isError: true };
    case GET_FEED_LOADING:
      return { ...state, isLoading: true, isError: false };
    case GET_FEED_SUCCESS:
      return { ...state, isLoading: false, isError: false, feed: [...action.payload] };
    case UPDATE_RECIPE_SUCCESS:
      // Actualización simple del feed; refactorizar en etapas posteriores
      const newFeed = [...state.feed].map((rep) => (rep._id === action.payload._id ? action.payload : rep));
      const newCocktails = [...state.cocktails].map((rep) => (rep._id === action.payload._id ? action.payload : rep));
      return {
        ...state,
        isLoading: false,
        isError: false,
        cocktails: newCocktails,
        feed: newFeed,
      };
    default:
      return state;
  }
};