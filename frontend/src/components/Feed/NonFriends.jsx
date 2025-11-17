import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";
import { getAllNonFriends, updateUser } from "../../redux/userReducer/actions";
import { MiniCard_Friends } from "./MiniCard";
import axios from "axios";

export const NonFriends = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const loggedInUser = useSelector((store) => store.authReducer.loggedInUser);
  const nonFriends = useSelector((store) => store.userReducer.nonFriends);
  const token =
    useSelector((store) => store.authReducer.token) ||
    localStorage.getItem("token");
  const [sorted, setSorted] = React.useState([]);
  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // console.log(token, nonFriends);
  useEffect(() => {
    if (token) {
      dispatch(getAllNonFriends(token));
    }
  }, []);

  // Ordenar sugerencias por coincidencias con intereses del usuario
  useEffect(() => {
    const run = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        const { data } = await axios.get(`${API}/recipe/getAllRecipe`, { headers });
        const recipes = Array.isArray(data) ? data : [];
        const liked = new Set(loggedInUser?.likedRecipes || []);
        const saved = new Set(loggedInUser?.savedRecipes || []);
        const weights = { tags: new Map(), ingredients: new Map(), cuisine: new Map(), flavors: new Map() };
        const bump = (map, key, inc) => { if (!key) return; map.set(key, (map.get(key) || 0) + inc); };
        recipes.forEach((r) => {
          const id = r?._id;
          const inc = (liked.has(id) ? 3 : 0) + (saved.has(id) ? 2 : 0);
          if (!inc) return;
          (r.tags || []).forEach((t) => bump(weights.tags, t, inc));
          (r.ingredients || []).forEach((t) => bump(weights.ingredients, t, inc));
          (r.cuisine || []).forEach((t) => bump(weights.cuisine, t, inc));
          (r.flavors || []).forEach((t) => bump(weights.flavors, t, inc));
        });

        const scoreUser = (u) => {
          let s = 0;
          (u.recipes || []).forEach((r) => {
            (r.tags || []).forEach((t) => (s += (weights.tags.get(t) || 0)));
            (r.ingredients || []).forEach((t) => (s += (weights.ingredients.get(t) || 0)));
            (r.cuisine || []).forEach((t) => (s += (weights.cuisine.get(t) || 0)));
            (r.flavors || []).forEach((t) => (s += (weights.flavors.get(t) || 0)));
          });
          s += (u.recipes?.length || 0) * 0.5;
          return s;
        };

        const sortedList = [...nonFriends].sort((a, b) => scoreUser(b) - scoreUser(a));
        setSorted(sortedList);
      } catch (_) {
        setSorted(nonFriends);
      }
    };
    if (nonFriends.length > 0) run();
  }, [nonFriends, token]);

  function addRequestHandler(id, receiversRequest) {
    // console.log(id, receiversRequest);
    if (token) {
      if (!receiversRequest.includes(loggedInUser._id)) {
        receiversRequest.push(loggedInUser._id);
        dispatch(updateUser(id, { requests: receiversRequest }, token, toast,'request'));
      }
    }
  }

  return (
    <>
      {sorted.length > 0 ? (
        sorted.map((friend, i) => {
          return (
            <MiniCard_Friends
              key={i}
              friend={friend}
              addRequestHandler={addRequestHandler}
              userId={loggedInUser._id}
            />
          );
        })
      ) : (
        <h3>No se pudieron cargar usuarios</h3>
      )}
    </>
  );
};
