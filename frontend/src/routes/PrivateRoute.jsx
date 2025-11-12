import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

// PrivateRoute ahora soporta validación por roles mediante la prop optional `allowedRoles`.
// Si `allowedRoles` está definida, el usuario debe estar autenticado y tener un rol incluido.
export const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuth, loggedInUser } = useSelector((store) => store.authReducer);
  const location = useLocation();

  if (!isAuth) {
    return (
      <Navigate
        to="/login"
        state={{ pathname: location.pathname }}
        replace={true}
      />
    );
  }

  if (allowedRoles && Array.isArray(allowedRoles)) {
    const userRole = loggedInUser?.role;
    const isAllowed = userRole && allowedRoles.includes(userRole);
    if (!isAllowed) {
      // Redirige a inicio si el rol no está autorizado.
      return <Navigate to="/" replace={true} />;
    }
  }

  return children;
};
