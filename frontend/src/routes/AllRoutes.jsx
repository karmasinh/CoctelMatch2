import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { Feed } from "../pages/Feed";
import { Explore } from "../pages/Explore";
import { Account } from "../pages/Account";
import { Login } from "../pages/Login";
import { SignUp } from "../pages/SignUp";
import { PrivateRoute } from "./PrivateRoute";
import { AddCocktailModal } from "../pages/AddCocktailModal";
import SingleRecipe from "../pages/SingleRecipe";
import Admin from "../pages/Admin";
import SingleUser from "../pages/SingleUser";
import AdminNew from "../pages/AdminNew";
import AdminIngredients from "../pages/AdminIngredients";
import AdminUsers from "../pages/AdminUsers";
import MixologyGuides from "../pages/MixologyGuides";
import Team from "../pages/Team";
import Contact from "../pages/Contact";
import About from "../pages/About";
import IngredientsSearch from "../pages/IngredientsSearch";
import AdminHomeEditor from "../pages/AdminHomeEditor";

export const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/explore" element={<Explore />}></Route>
      <Route
        path="/feed"
        element={
          <PrivateRoute>
            <Feed />
          </PrivateRoute>
        }
      ></Route>
      <Route
        path="/user-recipes"
        element={
          <PrivateRoute>
            <AddCocktailModal />
          </PrivateRoute>
        }
      ></Route>
      <Route
        path="/account"
        element={
          <PrivateRoute>
            <Account />
          </PrivateRoute>
        }
      ></Route>
      <Route
        path="/recipe/:postId"
        element={
          <PrivateRoute>
            <SingleRecipe />
          </PrivateRoute>
        }
      ></Route>
      <Route
        path="/user/:userId"
        element={
            <SingleUser />
        }
      ></Route>
  <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminNew />
          </PrivateRoute>
        }
      ></Route>
      <Route
        path="/admin/ingredients"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminIngredients />
          </PrivateRoute>
        }
      ></Route>
      <Route
        path="/admin/users"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminUsers />
          </PrivateRoute>
        }
      ></Route>
      <Route path="/signup" element={<SignUp />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/mixology-guides" element={<MixologyGuides />}></Route>
      <Route path="/team" element={<Team />}></Route>
      <Route path="/contact" element={<Contact />}></Route>
      <Route path="/about" element={<About />}></Route>
      <Route path="/ingredients-search" element={<IngredientsSearch />}></Route>
      <Route
        path="/admin/home-editor"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminHomeEditor />
          </PrivateRoute>
        }
      ></Route>
    </Routes>
  );
};
