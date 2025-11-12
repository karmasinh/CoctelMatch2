import {
  GET_INGREDIENTS_LOADING,
  GET_INGREDIENTS_SUCCESS,
  GET_INGREDIENTS_ERROR,
  SEARCH_INGREDIENTS_LOADING,
  SEARCH_INGREDIENTS_SUCCESS,
  SEARCH_INGREDIENTS_ERROR,
} from "./actionTypes";

const initState = {
  isLoading: false,
  isError: false,
  list: [],
  searchResults: [],
};

export const reducer = (state = initState, action) => {
  switch (action.type) {
    case GET_INGREDIENTS_LOADING:
    case SEARCH_INGREDIENTS_LOADING:
      return { ...state, isLoading: true, isError: false };
    case GET_INGREDIENTS_ERROR:
    case SEARCH_INGREDIENTS_ERROR:
      return { ...state, isLoading: false, isError: true };
    case GET_INGREDIENTS_SUCCESS:
      return { ...state, isLoading: false, isError: false, list: action.payload };
    case SEARCH_INGREDIENTS_SUCCESS:
      return { ...state, isLoading: false, isError: false, searchResults: action.payload };
    default:
      return state;
  }
};