import axios from "axios";
import {
  GET_INGREDIENTS_LOADING,
  GET_INGREDIENTS_SUCCESS,
  GET_INGREDIENTS_ERROR,
  SEARCH_INGREDIENTS_LOADING,
  SEARCH_INGREDIENTS_SUCCESS,
  SEARCH_INGREDIENTS_ERROR,
} from "./actionTypes";

export const getIngredients = (token) => async (dispatch) => {
  dispatch({ type: GET_INGREDIENTS_LOADING });
  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : undefined;
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/ingredients`, config);
    dispatch({ type: GET_INGREDIENTS_SUCCESS, payload: res.data?.ingredients || [] });
  } catch (err) {
    console.log("Error fetching ingredients:", err?.response?.data || err.message);
    dispatch({ type: GET_INGREDIENTS_ERROR });
  }
};

export const searchIngredients = (query, token) => async (dispatch) => {
  dispatch({ type: SEARCH_INGREDIENTS_LOADING });
  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : undefined;
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/ingredients?search=${encodeURIComponent(query || "")}`,
      config
    );
    dispatch({ type: SEARCH_INGREDIENTS_SUCCESS, payload: res.data?.ingredients || [] });
  } catch (err) {
    console.log("Error searching ingredients:", err?.response?.data || err.message);
    dispatch({ type: SEARCH_INGREDIENTS_ERROR });
  }
};