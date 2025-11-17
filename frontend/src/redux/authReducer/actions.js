import {
  CREATE_USER_LOADING,
  CREATE_USER_ERROR,
  CREATE_USER_SUCCESS,
  LOGIN_USER_LOADING,
  LOGIN_USER_ERROR,
  LOGIN_USER_SUCCESS,
  POST_DISLIKE_SUCCESS,
  POST_LIKE_SUCCESS,
  RESET,
  UPDATE_USER_DETAILS,
} from "./actionTypes";
import {
  GET_LOGGEDUSER_LOADING,
  GET_LOGGEDUSER_SUCCESS,
  GET_LOGGEDUSER_ERROR,
} from "./actionTypes";
import axios from "axios";
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
export const createUser = (newUser, toast, navigate) => async (dispatch) => {
  dispatch({ type: CREATE_USER_LOADING });
  try {
    const response = await axios.post(
      `${API}/auth/signup`,
      newUser,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    // Handle the server response here
    console.log(response);
    dispatch({ type: CREATE_USER_SUCCESS });
    toast({
      title: "Registro exitoso",
      description: `${response.data.message}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    navigate("/login");
  } catch (error) {
    console.log(error);
    dispatch({ type: CREATE_USER_ERROR });
    toast({
      title: "Error al registrarse",
      description: `${error.response?.data?.message || "Inténtalo más tarde"}`,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  }
};

export const loginUser = (userObj, toast, navigate) => async (dispatch) => {
  dispatch({ type: LOGIN_USER_LOADING });
  try {
    const response = await axios.post(
      `${API}/auth/login`,
      userObj,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Handle the server response here
    // console.log(response);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      dispatch({ type: LOGIN_USER_SUCCESS, payload: response.data.token });

      // Cargar inmediatamente los datos del usuario autenticado para tener el rol disponible
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${response.data.token}`,
          },
        };
        const userRes = await axios.get(
          `${API}/users`,
          config
        );
        const userWithProfileImage = userRes.data.user;
        userWithProfileImage.profileImage = `${API}/${userWithProfileImage.profileImage}`;
        dispatch({ type: GET_LOGGEDUSER_SUCCESS, payload: userWithProfileImage });
      } catch (err) {
        // En caso de fallo, dejamos el flujo continuar; la app intentará cargar el usuario en páginas que lo requieran
        console.log("Error fetching user after login:", err);
      }

      toast({
        title: "Inicio de sesión exitoso",
        description: `${response.data.message}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    }
  } catch (error) {
    console.log(error);
    dispatch({ type: LOGIN_USER_ERROR });
    toast({
      title: "Error al iniciar sesión",
      description: `${error.response?.data?.message || "Verifica tus credenciales"}`,
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
};

export const logoutUser = (token, toast, navigate) => async (dispatch) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(
      `${API}/auth/logout`,
      config
    );
    localStorage.removeItem("token");
    toast({
      title: "Sesión cerrada",
      description: `${response.data.message}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    navigate("/");
  } catch (error) {
    console.log("Error whlie logging out:", error);
    toast({
      title: "Error al cerrar sesión",
      description: `${error.response?.data?.message || "Inténtalo más tarde"}`,
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }

  dispatch({ type: RESET });
};

//get data of the loggedin user
export const getUserData = (token, toast) => async (dispatch) => {
  dispatch({ type: GET_LOGGEDUSER_LOADING });
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.get(
      `${API}/users`,
      config
    );
    console.log(response.data.user);
    const userWithProfileImage = response.data.user;
    userWithProfileImage.profileImage = `${API}/${userWithProfileImage.profileImage}`;
    dispatch({ type: GET_LOGGEDUSER_SUCCESS, payload: userWithProfileImage });
  } catch (error) {
    console.log("Error fetching user data:", error);
    dispatch({ type: GET_LOGGEDUSER_ERROR });
    toast({
      title: "No se pudieron cargar tus datos",
      description: `${error.response?.data?.message || "Inténtalo más tarde"}`,
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
};

// update user details
export const updateUserDetails =
  (id, newData, headers, toast) => (dispatch) => {
    axios
      .patch(`${API}/users/update/${id}`, newData, {
        headers: headers,
      })
      .then((res) => {
        console.log(res.data.updatedUser, "data in action from backend");
        const updated = res.data.updatedUser;
        if (updated && updated.profileImage) {
          updated.profileImage = `${API}/${updated.profileImage}`;
        }
        dispatch({
          type: UPDATE_USER_DETAILS,
          payload: updated,
        });
        toast({
          title: "Datos actualizados",
          description: `${res.data.status}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title: "Error al actualizar tus datos",
          description: `${err.response?.data?.message || "Inténtalo más tarde"}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

// Get user recipes
export const getUserRecipes = (id, token) => (dispatch) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  axios
    .get(
      `${API}/recipe/getMyRecipe?populate=recipes`,
      config
    )
    .then((response) => {
      console.log(response.data.recipes);
      dispatch({
        type: "GET_USER_RECIPES",
        payload: response.data.recipes,
      });
    })
    .catch((error) => {
      console.error("Error fetching user recipes:", error);
    });
};

export const getAllRecipes = (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios
    .get(`${API}/recipe/getAllRecipe`, config)
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

// export const getUserDetailsForSingleRecipe = (token, id) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };

//   return axios.get(`${process.env.REACT_APP_API_URL}/users/${id}`, config)
//     .then((res) => {
//       return res.data;
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }
